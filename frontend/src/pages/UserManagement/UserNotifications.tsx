"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getUserAlerts, markReadAlerts } from "@/api/serviceAPI";
import { useUserStore } from "@/store/authStore";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { queryClient } from "@/lib/react-query";

export default function UserNotifications() {

  const navigate = useNavigate();
  const {t} = useTranslation();

  const userData = useUserStore(state => state.userData);
  
  // Fetch alerts for current user
  const { data: myAlerts = [], isPending: alertsPending } = useQuery({
    queryKey: ["userAlerts", userData?.id],
    queryFn: getUserAlerts,
    enabled: !!userData?.id,
  });
  
  // Fetch alerts for current user
  const { mutate: toggleRead, isPending: readPending } = useMutation({
    mutationKey: ["userAlerts", userData?.id],
    mutationFn: markReadAlerts,
    onSuccess() {
      queryClient.invalidateQueries(myAlerts as any);
    },
  });
  const alerts = (myAlerts as any).data;
  
  const handleRead = (alert: any) => {
    if (!alert.is_read){
      toggleRead(alert.id)
    }
    navigate(`${alert.id}/`)
  }

  return (
    <div className="flex-1 overflow-auto p-4 md:px-20 mt-10">
        {/* NOTIFICATIONS TAB */}
          <div>
            <h1 className="text-4xl font-bold my-5">{t('dataForm.alerts.your_notify')}</h1>
            <h2 className="text-xl my-5 text-muted-foreground">
              {t('dataForm.alerts.your_notify_all')}
            </h2>
          </div>

          {alertsPending ? (
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
                  <TableRow className="*:px-5 border-border cursor-pointer" key={alert.id} onClick={()=>{handleRead(alert)}}>
                    <TableCell className=" whitespace-pre-line text-wrap max-w-40">{(() => {
                        const alertTitle = String(alert.alert?.title ?? "-");
                        const truncated = alertTitle.slice(0, 100);
                        return (
                          <>
                            {truncated}
                            {alertTitle.length > 100 ? "…" : ""}
                          </>
                        );
                      })()}</TableCell>
                    <TableCell className=" whitespace-pre-line text-wrap max-w-40">
                      {(() => {
                        const alertDescription = String(alert.alert?.description ?? "-");
                        const truncated = alertDescription.slice(0, 100);
                        return (
                          <>
                            {truncated}
                            {alertDescription.length > 100 ? "…" : ""}
                          </>
                        );
                      })()}
                    </TableCell>
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
    </div>
  );
}
