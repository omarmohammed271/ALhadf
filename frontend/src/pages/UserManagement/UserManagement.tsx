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
import { handleCreateAlert, getUserAlerts } from "@/api/serviceAPI"; // getUserAlerts fetches alerts for a user
import { toast } from "react-hot-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const users = [
  { id: 1, firstName: "John", lastName: "Doe", username: "jdoe", email: "john@example.com", phone: "+201234567890", role: "Admin" },
  { id: 2, firstName: "Sara", lastName: "Ali", username: "sali", email: "sara@example.com", phone: "+201987654321", role: "User" },
];

export default function UserManagement() {
  const [activeTab, setActiveTab] = useState("users");
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  // Alert form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [level, setLevel] = useState("info");
  const [metadata, setMetadata] = useState("");

  // Fetch alerts for selected user (if any)
  const { data: alerts = [], isLoading, isError } = useQuery({
    queryKey: ["userAlerts", selectedUser?.id], // unique key per user
    queryFn: () => selectedUser ? getUserAlerts(selectedUser.id) : Promise.resolve([]),
    enabled: !!selectedUser, // only fetch if user is selected
  });

  // Mutation for creating alerts
  const mutation = useMutation({
    mutationFn: (data: { title: string; description: string; level: string; metadata: any; user_ids: number[] }) =>
      handleCreateAlert(data),
    onSuccess: () => {
      toast.success(`Alert sent successfully to ${selectedUser?.firstName || "all users"}`);
      setOpen(false);
      setTitle("");
      setDescription("");
      setLevel("info");
      setMetadata("");
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
    if (!title || !description) return;

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
      user_ids: selectedUser ? [selectedUser.id] : users.map(u => u.id), // support Notify All
    });
  };

  return (
    <div className="flex-1 overflow-auto p-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="my-5 mx-auto *:text-lg *:p-6 py-7">
          <TabsTrigger value="users">Users & Notify</TabsTrigger>
          <TabsTrigger value="notifications">My Notifications</TabsTrigger>
        </TabsList>

        {/* USERS & NOTIFY TAB */}
        <TabsContent value="users">
          <div className="flex justify-between">
            <div>
              <h1 className="text-4xl font-bold my-5">Users in the system</h1>
              <h2 className="text-xl my-5 text-muted-foreground">
                Here, you can view all the users in the system and send alerts.
              </h2>
            </div>
            <div className="flex items-end py-5">
              <Button className="text-white" onClick={() => { setSelectedUser(null); setOpen(true); }}>
                Notify All
              </Button>
            </div>
          </div>

          <Table className="bg-primary/5 backdrop-blur-2xl p-10 rounded-2xl overflow-hidden border-border">
            <TableHeader>
              <TableRow className="*:p-5 border-border bg-secondary/10 hover:bg-secondary/5 rounded-2xl">
                <TableHead>First Name</TableHead>
                <TableHead>Last Name</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>

            <TableBody>
              {users.map((user) => (
                <TableRow className="*:px-5 border-border" key={user.id}>
                  <TableCell>{user.firstName}</TableCell>
                  <TableCell>{user.lastName}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>{user.role}</TableCell>
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

          {/* Alert Dialog */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="text-foreground border-border">
              <DialogHeader>
                <DialogTitle>
                  Notify {selectedUser?.firstName ?? "All Users"} {selectedUser?.lastName ?? ""}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <Input placeholder="Alert title" value={title} onChange={(e) => setTitle(e.target.value)} />
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
                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button onClick={handleSend} disabled={mutation.isPending} className="text-white">
                  {mutation.isPending ? "Sending..." : "Send Alert"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* NOTIFICATIONS TAB */}
        <TabsContent value="notifications">
            <div>
              <h1 className="text-4xl font-bold my-5">My Alerts</h1>
              <h2 className="text-xl my-5 text-muted-foreground">
                Here, you can view all your alerts and toggle read/unread status.
              </h2>
            </div>
          {alerts && alerts.length > 0 ? (
            <Table className="bg-primary/5 backdrop-blur-2xl p-4 rounded-2xl overflow-hidden border-border">
              <TableHeader>
                <TableRow className="*:p-3 border-border bg-secondary/10 hover:bg-secondary/5 rounded-2xl">
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Created At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alerts.map((alert: any) => (
                  <TableRow key={alert.id}>
                    <TableCell>{alert.title}</TableCell>
                    <TableCell>{alert.description}</TableCell>
                    <TableCell>{alert.level}</TableCell>
                    <TableCell>{new Date(alert.triggered_at).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-muted-foreground">No alerts found.</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
