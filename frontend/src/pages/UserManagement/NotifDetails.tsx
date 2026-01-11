"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Mail, Clock, User } from "lucide-react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAlert } from "@/api/serviceAPI";

export default function NotifDetails() {
  const { notifId } = useParams();

  const {
    data: thisAlert,
    isPending,
  } = useQuery({
    queryKey: ["userAlert", notifId],
    queryFn: () => getAlert(notifId),
    enabled: !!notifId,
  });

  /* -------------------------------
     Pending state
  --------------------------------*/
  if (isPending) {
    return (
      <Card className="flex-1 mx-20 my-10 animate-pulse bg-muted/50">
        <CardHeader className="space-y-3">
          <div className="h-8 w-2/3 bg-muted rounded" />
          <div className="h-4 w-full bg-muted rounded" />
          <div className="h-4 w-5/6 bg-muted rounded" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-12 w-64 bg-muted rounded" />
          <div className="h-4 w-48 bg-muted rounded" />
          <div className="h-4 w-56 bg-muted rounded" />
        </CardContent>
      </Card>
    );
  }

  /* -------------------------------
     No alert found
  --------------------------------*/
  if (!thisAlert || !(thisAlert as any).alert) {
    return (
      <Card className="flex-1 mx-20 my-10">
        <CardContent className="py-20 text-center">
          <p className="text-lg font-medium">Notification not found</p>
          <p className="text-muted-foreground mt-1">
            This alert may have been deleted or you don’t have access to it.
          </p>
        </CardContent>
      </Card>
    );
  }

  const { user, alert, is_read } = thisAlert as any;

  const levelVariant =
    alert.level === "critical"
      ? "destructive"
      : alert.level === "warning"
      ? "secondary"
      : "default";

  

  return (
    <Card className="flex-1 overflow-auto mx-5 md:mx-20 my-5 md:my-10 bg-muted/30">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div className="space-y-3">
          <CardTitle className="text-3xl">{alert.title}</CardTitle>
          <Badge variant={levelVariant}>
            {alert.level.toUpperCase()}
          </Badge>
          <p
            className="text-lg text-muted-foreground"
            style={{ whiteSpace: "pre-line" }}
          >
            {alert.description}
          </p>
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="space-y-4 pt-4">
        {/* User */}
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback>
              {user?.first_name?.[0]}
              {user?.last_name?.[0]}
            </AvatarFallback>
          </Avatar>

          <div className="leading-tight">
            <p className="font-medium">
              {user.first_name} {user.last_name}
            </p>
            <p className="text-sm text-muted-foreground">
              {user.profile.position} ·{" "}
              {user.profile.department?.toUpperCase()}
            </p>
          </div>
        </div>

        {/* Meta */}
        <div className="grid gap-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Mail className="h-4 w-4" />
            <span>{user.email}</span>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>
              {new Date(alert.triggered_at).toLocaleString()}
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
