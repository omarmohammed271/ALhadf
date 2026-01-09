"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MoreVertical } from "lucide-react";
import { useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useMutation, useQuery } from "@tanstack/react-query";
import { handleCreateAlert, getAllAlerts } from "@/api/serviceAPI";
import { toast } from "react-hot-toast";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useUserStore } from "@/store/authStore";
import { getUsers } from "@/api/authAPI";
import { queryClient } from "@/lib/react-query";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export default function UserManagement() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("users");
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const { t } = useTranslation();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [level, setLevel] = useState("info");
  const [metadata, setMetadata] = useState("");

  const userData = useUserStore(state => state.userData);

  /* -------------------------
     Alerts
  --------------------------*/
  const { data: alerts, isLoading: alertsLoading } = useQuery({
    queryKey: ["allAlerts", userData?.id],
    queryFn: () => getAllAlerts(userData?.id),
    enabled: !!userData?.id,
  });

  /* -------------------------
     Users
  --------------------------*/
  const { data: allUsers = [], isLoading: usersLoading } = useQuery({
    queryKey: ["all_users"],
    queryFn: getUsers,
  });

  /* -------------------------
     Create alert
  --------------------------*/
  const mutation = useMutation({
    mutationFn: handleCreateAlert,
    onSuccess: () => {
      toast.success(
        `Alert sent successfully to ${
          selectedUser?.profile?.first_name || "all users"
        }`
      );

      setOpen(false);
      setTitle("");
      setDescription("");
      setLevel("info");
      setMetadata("");

      queryClient.invalidateQueries({
        queryKey: ["allAlerts", userData?.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["userAlerts", userData?.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["unreadUserAlerts", userData?.id],
      });
    },
    onError: (err: any) => {
      toast.error(
        err?.response?.data?.detail ||
          err?.response?.data?.message ||
          err.message ||
          "Failed to send alert"
      );
    },
  });

  const handleSend = () => {
    if (mutation.isPending) return;

    if (!title || !description) {
      toast.error("Title and description are required");
      return;
    }

    let parsedMetadata = {};
    try {
      parsedMetadata = metadata ? JSON.parse(metadata) : {};
    } catch {
      toast.error("Metadata must be valid JSON");
      return;
    }

    mutation.mutate({
      title,
      description,
      level,
      metadata: parsedMetadata,
      user_ids: selectedUser ? [selectedUser.id] : "",
    });
  };

  return (
    <div className="flex-1 overflow-auto p-4 md:px-20">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="my-5 mx-auto text-sm md:*:text-lg *:p-5 py-6">
          <TabsTrigger value="users">
            {t("dataForm.users.title")}
          </TabsTrigger>
          <TabsTrigger value="notifications">
            {t("dataForm.alerts.notify")}
          </TabsTrigger>
        </TabsList>

        {/* USERS TAB */}
        <TabsContent value="users">
          <div className="flex justify-between">
            <div>
              <h1 className="text-4xl font-bold my-5">{t("dataForm.users.title")}</h1>
              <h2 className="text-xl my-5 text-muted-foreground">
                {t('dataForm.users.subtitle')}
              </h2>
            </div>
            <div className="flex items-end py-5">
              <Button 
                className="text-white" 
                onClick={() => { 
                  setSelectedUser(null); 
                  setOpen(true); 
                }}
                disabled={usersLoading}
              >
                Notify All
              </Button>
            </div>
          </div>

          {usersLoading ? (
            <p className="text-muted-foreground">Loading users...</p>
          ) : (
            <Table className="bg-primary/5 backdrop-blur-2xl p-10 rounded-2xl overflow-hidden border-border">
              <TableHeader>
                <TableRow className="*:p-5 border-border bg-secondary/10 hover:bg-secondary/5 rounded-2xl">
                  <TableHead>First Name</TableHead>
                  <TableHead>Last Name</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>

              <TableBody>
                {allUsers.map((user: any) => (
                  <TableRow className="*:px-5 border-border" key={user.id}>
                    <TableCell>{user.first_name ?? "-"}</TableCell>
                    <TableCell>{user.last_name ?? "-"}</TableCell>
                    <TableCell>{user.username ?? "-"}</TableCell>
                    <TableCell>{user.email ?? "-"}</TableCell>
                    <TableCell>{user.profile?.phone_number ?? "-"}</TableCell>
                    <TableCell>{user.profile?.position ?? "-"}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="border-border" align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedUser(user);
                              setOpen(true);
                            }}
                          >
                            Notify
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {/* Alert Dialog */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="text-foreground border-border max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  Notify {selectedUser?.profile?.first_name ?? "All Users"} {selectedUser?.profile?.last_name ?? ""}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <Input 
                  placeholder="Alert title" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  max={148}
                />
                <Textarea
                  placeholder="Alert description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-25"
                />
                <Select value={level} onValueChange={setLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select alert level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
                <Textarea
                  placeholder='{"context": "ER Visit", "priority": "high"}'
                  value={metadata}
                  onChange={(e) => setMetadata(e.target.value)}
                  className="min-h-20"
                />
              </div>

              <DialogFooter className="space-x-2">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleSend} 
                  disabled={mutation.isPending}
                  className="text-white"
                >
                  {mutation.isPending ? "Sending..." : "Send Alert"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* NOTIFICATIONS TAB */}
        <TabsContent value="notifications">
          <div>
            <h1 className="text-4xl font-bold my-5">
              {t("dataForm.alerts.notify")}
            </h1>
            <h2 className="text-xl my-5 text-muted-foreground">
              {t("dataForm.alerts.notify_all")}
            </h2>
          </div>

          {alertsLoading ? (
            <p className="text-muted-foreground">Loading alerts...</p>
          ) : alerts.length > 0 ? (
            <Table className="bg-primary/5 backdrop-blur-2xl p-4 rounded-2xl overflow-hidden border-border">
              <TableHeader>
                <TableRow className="*:p-3 border-border bg-secondary/10">
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>To</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Is Read</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alerts.map((alert: any) => (
                  <TableRow className="*:px-5 border-border cursor-pointer" key={alert.id} onClick={() => {navigate(`/user-notifications/${alert.id}/`);}}>
                    <TableCell className="whitespace-pre-line max-w-40">
                      {String(alert.alert?.title ?? "-").slice(0, 100)}
                      {String(alert.alert?.title ?? "").length > 100 && "…"}
                    </TableCell>
                    <TableCell className="whitespace-pre-line max-w-40">
                      {String(alert.alert?.description ?? "-").slice(0, 100)}
                      {String(alert.alert?.description ?? "").length > 100 && "…"}
                    </TableCell>
                    <TableCell>{alert.user?.username ?? "-"}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          alert.alert?.level === "critical"
                            ? "bg-red-100 text-red-800"
                            : alert.alert?.level === "warning"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {alert.alert?.level ?? "-"}
                      </span>
                    </TableCell>
                    <TableCell>
                      {alert.alert?.triggered_at
                        ? new Date(
                            alert.alert.triggered_at
                          ).toLocaleString()
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`font-medium ${
                          alert.is_read
                            ? "text-green-700"
                            : "text-red-700"
                        }`}
                      >
                        {alert.is_read ? "Yes" : "No"}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              No alerts found.
            </p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
