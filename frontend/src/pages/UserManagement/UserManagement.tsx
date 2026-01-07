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
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useMutation, useQuery } from "@tanstack/react-query";
import { handleCreateAlert, getUserAlerts } from "@/api/serviceAPI";
import { toast } from "react-hot-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserStore } from "@/store/authStore";
import { getUsers } from "@/api/authAPI";
import { t } from "i18next";
import { queryClient } from "@/lib/react-query";

export default function UserManagement() {
  const [activeTab, setActiveTab] = useState("users");
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  // Alert form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [level, setLevel] = useState("info");
  const [metadata, setMetadata] = useState("");

  const userData = useUserStore(state => state.userData);
  
  // Fetch alerts for current user
  const { data: alerts = [], isLoading: alertsLoading } = useQuery({
    queryKey: ["userAlerts", userData?.id],
    queryFn: () => getUserAlerts(userData?.id),
    enabled: !!userData?.id,
  });

  // Fetch all users
  const { data: allUsers = [], isLoading: usersLoading } = useQuery({
    queryKey: ["all_users"],
    queryFn: getUsers,
  });

  // Mutation for creating alerts
  const mutation = useMutation({
    mutationFn: (data: { title: string; description: string; level: string; metadata: any; user_ids: any }) =>
      handleCreateAlert(data),
    onSuccess: () => {
      toast.success(`Alert sent successfully to ${selectedUser?.profile?.first_name || "all users"}`);
      setOpen(false);
      setTitle("");
      setDescription("");
      setLevel("info");
      setMetadata("");
      queryClient.invalidateQueries(alerts)
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
      user_ids: selectedUser ? [selectedUser.id] : '',
    });
  };

  const notifications = [
    {
      id: 1,
      is_read: false,
      user: { username: "er_ops" },
      alert: {
        title: "First Contact Delay",
        description: "Avg time to first contact reached 24 min, exceeding 20 min threshold.",
        level: "critical",
        triggered_at: "2026-01-05T09:12:00",
      },
    },
    {
      id: 2,
      is_read: false,
      user: { username: "icu_head" },
      alert: {
        title: "ICU Communication Drop",
        description: "ICU communication coverage dropped to 60%, below 85% threshold.",
        level: "critical",
        triggered_at: "2026-01-05T09:18:00",
      },
    },
    {
      id: 3,
      is_read: false,
      user: { username: "er_manager" },
      alert: {
        title: "LWBS Rate Breach",
        description: "Main ER LWBS rate reached 9.4%, exceeding 5% threshold.",
        level: "critical",
        triggered_at: "2026-01-05T09:21:00",
      },
    },
    {
      id: 4,
      is_read: false,
      user: { username: "quality_team" },
      alert: {
        title: "High Revisit Risk",
        description: "Revisit rate without communication reached 18.2%, above 12% threshold.",
        level: "critical",
        triggered_at: "2026-01-05T09:25:00",
      },
    },
    {
      id: 5,
      is_read: true,
      user: { username: "quality_team" },
      alert: {
        title: "Low Patient Satisfaction",
        description: "Overall satisfaction dropped to 70%, below expected target.",
        level: "warning",
        triggered_at: "2026-01-05T09:30:00",
      },
    },
    {
      id: 6,
      is_read: false,
      user: { username: "er_ops" },
      alert: {
        title: "Level 4 Waiting Time Exceeded",
        description: "Triage Level 4 waiting time exceeded 30 minutes.",
        level: "critical",
        triggered_at: "2026-01-05T09:34:00",
      },
    },
    {
      id: 7,
      is_read: false,
      user: { username: "er_ops" },
      alert: {
        title: "Level 5 Extended Delay",
        description: "Level 5 patients experienced waiting times up to 50 minutes.",
        level: "critical",
        triggered_at: "2026-01-05T09:36:00",
      },
    },
    {
      id: 8,
      is_read: true,
      user: { username: "nursing_supervisor" },
      alert: {
        title: "Observation Communication Gap",
        description: "Observation section communication coverage dropped to 70%.",
        level: "warning",
        triggered_at: "2026-01-05T09:40:00",
      },
    },
    {
      id: 9,
      is_read: false,
      user: { username: "er_manager" },
      alert: {
        title: "Arrival Delay Trend",
        description: "Upward trend detected in arrival-to-first-contact time over 3 days.",
        level: "warning",
        triggered_at: "2026-01-05T09:42:00",
      },
    },
    {
      id: 10,
      is_read: false,
      user: { username: "quality_team" },
      alert: {
        title: "LOS Impact on Satisfaction",
        description: "LOS above 90 minutes correlated with satisfaction below 60%.",
        level: "warning",
        triggered_at: "2026-01-05T09:45:00",
      },
    },
    {
      id: 11,
      is_read: false,
      user: { username: "er_manager" },
      alert: {
        title: "High Shift Pressure",
        description: "Night shift under high pressure showed satisfaction at 50%.",
        level: "critical",
        triggered_at: "2026-01-05T09:48:00",
      },
    },
    {
      id: 12,
      is_read: false,
      user: { username: "quality_team" },
      alert: {
        title: "Triage Dissatisfaction Risk",
        description: "Triage dissatisfaction risk score reached 85.",
        level: "critical",
        triggered_at: "2026-01-05T09:52:00",
      },
    },
    {
      id: 13,
      is_read: true,
      user: { username: "er_ops" },
      alert: {
        title: "Fast Track LWBS Increase",
        description: "Fast Track LWBS rate exceeded normal baseline.",
        level: "warning",
        triggered_at: "2026-01-05T09:55:00",
      },
    },
    {
      id: 14,
      is_read: false,
      user: { username: "nursing_supervisor" },
      alert: {
        title: "Delayed First Communication",
        description: "Average time to first communication exceeded 15 minutes.",
        level: "critical",
        triggered_at: "2026-01-05T09:58:00",
      },
    },
    {
      id: 15,
      is_read: true,
      user: { username: "quality_team" },
      alert: {
        title: "Cardiology Risk Trend",
        description: "Cardiology dissatisfaction risk score is trending upward.",
        level: "warning",
        triggered_at: "2026-01-05T10:00:00",
      },
    },
  ];
  
  
  

  return (
    <div className="flex-1 overflow-auto p-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="my-5 mx-auto *:text-lg *:p-6 py-7">
          <TabsTrigger value="users">{t('users.title')}</TabsTrigger>
          <TabsTrigger value="notifications">{t('alerts.notify')}</TabsTrigger>
        </TabsList>

        {/* USERS & NOTIFY TAB */}
        <TabsContent value="users">
          <div className="flex justify-between">
            <div>
              <h1 className="text-4xl font-bold my-5">{t("users.title")}</h1>
              <h2 className="text-xl my-5 text-muted-foreground">
                {t('users.subtitle')}
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
            <h1 className="text-4xl font-bold my-5">{t('alerts.notify')}</h1>
            <h2 className="text-xl my-5 text-muted-foreground">
              {t('alerts.notify_all')}
            </h2>
          </div>

          {alertsLoading ? (
            <p className="text-muted-foreground">Loading alerts...</p>
          ) : alerts.length > 0 ? (
            <Table className="bg-primary/5 backdrop-blur-2xl p-4 rounded-2xl overflow-hidden border-border">
              <TableHeader>
                <TableRow className="*:p-3 border-border bg-secondary/10 hover:bg-secondary/5 rounded-2xl">
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
                  <TableRow className="*:px-5 border-border" key={alert.id}>
                    <TableCell>{alert.alert?.title ?? "-"}</TableCell>
                    <TableCell className="">{alert.alert?.description ?? "-"}</TableCell>
                    <TableCell>{alert.user?.username ?? "-"}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        alert.alert?.level === 'critical' ? 'bg-red-100 text-red-800' :
                        alert.alert?.level === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {alert.alert?.level ?? "-"}
                      </span>
                    </TableCell>
                    <TableCell>{alert.alert?.triggered_at ? new Date(alert.alert.triggered_at).toLocaleString() : "-"}</TableCell>
                    <TableCell>
                      <span className={`font-medium ${
                        alert.is_read ? 'text-green-700' : 'text-red-700'
                      }`}>
                        {alert.is_read ? 'Yes' : 'No'}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}

                {/* Dummy notifications */}
                {notifications.map((alert: any) => (
                  <TableRow className="*:px-5 border-border" key={alert.id}>
                    <TableCell>{alert.alert?.title ?? "-"}</TableCell>
                    <TableCell className="">{alert.alert?.description ?? "-"}</TableCell>
                    <TableCell>{alert.user?.username ?? "-"}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        alert.alert?.level === 'critical' ? 'bg-red-100 text-red-800' :
                        alert.alert?.level === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {alert.alert?.level ?? "-"}
                      </span>
                    </TableCell>
                    <TableCell>{alert.alert?.triggered_at ? new Date(alert.alert.triggered_at).toLocaleString() : "-"}</TableCell>
                    <TableCell>
                      <span className={`font-medium ${
                        alert.is_read ? 'text-green-700' : 'text-red-700'
                      }`}>
                        {alert.is_read ? 'Yes' : 'No'}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-muted-foreground text-center py-8">No alerts found.</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
