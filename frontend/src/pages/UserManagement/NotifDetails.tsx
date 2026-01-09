"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Mail, Clock, User } from "lucide-react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAlert } from "@/api/serviceAPI";

type NotifDetailsProps = {
  data: {
    id: number;
    is_read: boolean;
    read_at: string | null;
    user: {
      username: string;
      email: string;
      first_name: string;
      last_name: string;
      profile: {
        department: string;
        position: string;
      };
    };
    alert: {
      title: string;
      description: string;
      level: "info" | "warning" | "error";
      status: "read" | "unread";
      triggered_at: string;
    };
  };
};

export default function NotifDetails() {
    
    const { notifId } = useParams();

    // // Fetch alerts for current user
    const { data: thisAlert, isPending: alertsPending } = useQuery({
        queryKey: ["userAlerts", notifId],
        queryFn: () => getAlert(notifId),
        enabled: !!notifId,
    });
    
    console.log(notifId);
    console.log(thisAlert);
    const { user, alert, is_read } = thisAlert as any || {};

    const levelVariant =
    alert?.level === "critical"
      ? "destructive"
      : alert?.level === "warning"
      ? "secondary"
      : "default";

  return (
    <Card className="flex-1 overflow-auto mx-20 my-10 bg-muted/30">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div className="space-y-3">
          <CardTitle className="text-3xl">{alert?.title}</CardTitle>
          <p className="text-lg text-muted-foreground" style={{ whiteSpace: 'pre-line' }}>
            {alert?.description}
          </p>
        </div>

        <Badge variant={levelVariant} className="">
          {alert?.level.toUpperCase()}
        </Badge>
      </CardHeader>

      <Separator />

      <CardContent className="space-y-4 pt-4">
        {/* User */}
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback>
              {user?.first_name[0]}
              {user?.last_name[0]}
            </AvatarFallback>
          </Avatar>

          <div className="leading-tight">
            <p className="font-medium">
              {user?.first_name} {user?.last_name}
            </p>
            <p className="text-sm text-muted-foreground">
              {user?.profile.position} · {user?.profile.department.toUpperCase()}
            </p>
          </div>
        </div>

        {/* Meta */}
        <div className="grid gap-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Mail className="h-4 w-4" />
            <span>{user?.email}</span>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>
              {new Date(alert?.triggered_at).toLocaleString()}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <Badge variant={is_read ? "outline" : "default"}>
              {is_read ? "Read" : "Unread"}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
