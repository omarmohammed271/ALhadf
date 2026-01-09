import { Bell, ChevronRight } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

export function Notifications() {
  const [notifications] = useState<any[]>([
    {
      id: 1,
      title: "New ER Visit",
      description: "A new ER visit has been registered.",
      is_read: false,
    },
    {
      id: 2,
      title: "Context Updated",
      description: "ER context data was updated.",
      is_read: true,
    },
  ]);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />

          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary" />
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80 p-2 border-border space-y-2">
        {notifications.length === 0 ? (
          <div className="p-4 text-sm text-muted-foreground">
            No notifications
          </div>
        ) : (
          notifications.map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              className={cn(
                "flex flex-col items-start gap-1 p-3 cursor-pointer",
                !notification.is_read && "bg-muted/50"
              )}
            >
              <div className="flex items-center gap-2 w-full">
                {!notification.is_read && (
                  <span className="h-2 w-2 rounded-full bg-primary" />
                )}
                <span className="font-medium text-sm">
                  {notification.title}
                </span>
              </div>

              <p className="text-xs text-muted-foreground">
                {notification.description}
              </p>
            </DropdownMenuItem>
          ))
        )}
        <div>
            <Link to={'/user-notifications'} className="text-foreground/30 text-sm font-medium items-center px-3 flex">
                All Notifications <ChevronRight className="size-5"/>
            </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
