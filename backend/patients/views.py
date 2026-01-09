from django.db.models import Count, Avg
from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.authentication import TokenAuthentication
from rest_framework.response import Response
from rest_framework.views import APIView
from account.permissions import HasERPermission

from .models import ERVisit, CommunicationEvent, SatisfactionSignal, ContextData, ExperienceFailureIndicator
from .serializers import (
    ERVisitSerializer, CommunicationEventSerializer,
    SatisfactionSignalSerializer, ExperienceFailureIndicatorSerializer, ContextDataSerializer
)


class ERVisitViewSet(viewsets.ModelViewSet):
    queryset = ERVisit.objects.all().order_by('-arrival_ts')
    serializer_class = ERVisitSerializer
    authentication_classes = [TokenAuthentication]
    # permission_classes = [HasERPermission]

    # def get_permissions(self):
    #     if self.action == 'create':
    #         self.required_permission = 'add_input'
    #     else:
    #         # Viewers and Admins can see the list
    #         self.required_permission = 'view'
    #     return super().get_permissions()


class CommunicationEventViewSet(viewsets.ModelViewSet):
    queryset = CommunicationEvent.objects.all()
    serializer_class = CommunicationEventSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [HasERPermission]

    def get_permissions(self):
        if self.action == 'create':
            self.required_permission = 'add_input'
        else:
            # Viewers and Admins can see the list
            self.required_permission = 'view'
        return super().get_permissions()


class SatisfactionSignalViewSet(viewsets.ModelViewSet):
    queryset = SatisfactionSignal.objects.all()
    serializer_class = SatisfactionSignalSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [HasERPermission]

    def get_permissions(self):
        if self.action == 'create':
            self.required_permission = 'add_input'
        else:
            # Viewers and Admins can see the list
            self.required_permission = 'view'
        return super().get_permissions()


class ContextDataViewSet(viewsets.ModelViewSet):
    queryset = ContextData.objects.all()
    serializer_class = ContextDataSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [HasERPermission]

    def get_permissions(self):
        if self.action == 'create':
            self.required_permission = 'add_input'
        else:
            # Viewers and Admins can see the list
            self.required_permission = 'view'
        return super().get_permissions()


class ExperienceFailureIndicatorViewSet(viewsets.ModelViewSet):
    queryset = ExperienceFailureIndicator.objects.all()
    serializer_class = ExperienceFailureIndicatorSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [HasERPermission]

    def get_permissions(self):
        if self.action == 'create':
            self.required_permission = 'add_input'
        else:
            # Viewers and Admins can see the list
            self.required_permission = 'view'
        return super().get_permissions()




from django.db import connection
from django.http import JsonResponse
from django.views.decorators.http import require_GET
from django.views.decorators.csrf import csrf_exempt


def dictfetchone(cursor):
    columns = [col[0] for col in cursor.description]
    row = cursor.fetchone()
    return dict(zip(columns, row)) if row else None


def dictfetchall(cursor):
    columns = [col[0] for col in cursor.description]
    return [dict(zip(columns, row)) for row in cursor.fetchall()]

@require_GET
@csrf_exempt
def er_dashboard_api(request):
    response = {}

    with connection.cursor() as cursor:

        cursor.execute("""
            SELECT
              ROUND(AVG(EXTRACT(EPOCH FROM (first_contact_ts - arrival_ts)) / 60), 2)
              AS avg_minutes_to_first_contact
            FROM patients_ervisit;
        """)
        response["avg_time_to_first_contact"] = dictfetchone(cursor)

        cursor.execute("""
            WITH first_comm AS (
              SELECT visit_id, MIN(event_ts) AS first_comm_ts
              FROM patients_communicationevent
              GROUP BY visit_id
            )
            SELECT
              ROUND(
                100.0 * COUNT(*) FILTER (
                  WHERE EXTRACT(EPOCH FROM (fc.first_comm_ts - v.arrival_ts))/60 <= 30
                ) / COUNT(*),
                2
              ) AS timely_communication_pct
            FROM patients_ervisit v
            LEFT JOIN first_comm fc USING (visit_id);
        """)
        response["timely_communication_pct"] = dictfetchone(cursor)

        cursor.execute("""
            SELECT ROUND(AVG(overall_score), 2) AS avg_satisfaction
            FROM patients_satisfactionsignal;
        """)
        response["avg_satisfaction"] = dictfetchone(cursor)

        cursor.execute("""
            SELECT
              ROUND(100.0 * COUNT(*) FILTER (WHERE lwbs) / COUNT(*), 2)
              AS lwbs_rate_pct
            FROM patients_experiencefailureindicator;
        """)
        response["lwbs_rate"] = dictfetchone(cursor)

        cursor.execute("""
            SELECT
              ROUND(100.0 * COUNT(*) FILTER (WHERE revisit_72h) / COUNT(*), 2)
              AS revisit_rate_pct
            FROM patients_ervisit;
        """)
        response["revisit_rate"] = dictfetchone(cursor)

        cursor.execute("""
            SELECT
              ROUND(
                100.0 * COUNT(*) FILTER (
                  WHERE time_to_first_contact > INTERVAL '60 minutes'
                     OR time_without_communication > INTERVAL '60 minutes'
                ) / COUNT(*),
                2
              ) AS high_risk_pct
            FROM patients_experiencefailureindicator;
        """)
        response["high_risk_pct"] = dictfetchone(cursor)

        cursor.execute("""
            SELECT
              DATE(arrival_ts) AS day,
              ROUND(AVG(EXTRACT(EPOCH FROM (first_contact_ts - arrival_ts))/60),2)
                AS avg_minutes
            FROM patients_ervisit
            GROUP BY day
            ORDER BY day;
        """)
        response["arrival_to_first_contact_trend"] = dictfetchall(cursor)

        cursor.execute("""
            SELECT
              triage_level,
              EXTRACT(EPOCH FROM (first_contact_ts - arrival_ts))/60 AS wait_minutes
            FROM patients_ervisit;
        """)
        response["waiting_time_by_triage"] = dictfetchall(cursor)

        cursor.execute("""
            SELECT
              v.er_section,
              ROUND(
                100.0 * COUNT(DISTINCT c.visit_id) / COUNT(DISTINCT v.visit_id),
                2
              ) AS communication_coverage_pct
            FROM patients_ervisit v
            LEFT JOIN patients_communicationevent c USING (visit_id)
            GROUP BY v.er_section;
        """)
        response["communication_coverage_by_er_section"] = dictfetchall(cursor)

        cursor.execute("""
            WITH first_comm AS (
              SELECT visit_id, MIN(event_ts) AS first_comm_ts
              FROM patients_communicationevent
              GROUP BY visit_id
            )
            SELECT
              DATE(v.arrival_ts) AS day,
              ROUND(AVG(EXTRACT(EPOCH FROM (fc.first_comm_ts - v.arrival_ts))/60),2)
                AS avg_minutes
            FROM patients_ervisit v
            JOIN first_comm fc USING (visit_id)
            GROUP BY day
            ORDER BY day;
        """)
        response["first_communication_trend"] = dictfetchall(cursor)

        cursor.execute("""
            SELECT
              v.length_of_stay,
              s.overall_score
            FROM patients_ervisit v
            JOIN patients_satisfactionsignal s USING (visit_id);
        """)
        response["los_vs_satisfaction"] = dictfetchall(cursor)

        cursor.execute("""
            SELECT
              CASE
                WHEN EXTRACT(EPOCH FROM e.time_to_first_contact) / 60 <= 15 THEN '0-15'
                WHEN EXTRACT(EPOCH FROM e.time_to_first_contact) / 60 <= 30 THEN '16-30'
                WHEN EXTRACT(EPOCH FROM e.time_to_first_contact) / 60 <= 60 THEN '31-60'
                ELSE '60+'
              END AS wait_bucket,
              ROUND(AVG(s.overall_score), 2) AS avg_satisfaction
            FROM patients_experiencefailureindicator e
            JOIN patients_satisfactionsignal s USING (visit_id)
            GROUP BY wait_bucket
            ORDER BY wait_bucket;
        """)
        response["first_contact_delay_impact"] = dictfetchall(cursor)

        cursor.execute("""
            SELECT
              v.er_section,
              ROUND(
                100.0 * COUNT(*) FILTER (WHERE e.lwbs) / COUNT(*),
                2
              ) AS lwbs_rate_pct
            FROM patients_ervisit v
            JOIN patients_experiencefailureindicator e USING (visit_id)
            GROUP BY v.er_section;
        """)
        response["lwbs_by_er_section"] = dictfetchall(cursor)

        cursor.execute("""
            WITH comm_flag AS (
              SELECT DISTINCT visit_id FROM patients_communicationevent
            )
            SELECT
              CASE
                WHEN c.visit_id IS NULL THEN 'No Communication'
                ELSE 'Communication'
              END AS communication_status,
              ROUND(
                100.0 * COUNT(*) FILTER (WHERE v.revisit_72h) / COUNT(*),
                2
              ) AS revisit_rate
            FROM patients_ervisit v
            LEFT JOIN comm_flag c USING (visit_id)
            GROUP BY communication_status;
        """)
        response["revisit_vs_communication"] = dictfetchall(cursor)

        cursor.execute("""
            SELECT
              v.er_section,
              ROUND(
                AVG(
                  CASE
                    WHEN e.time_to_first_contact > INTERVAL '60 minutes'
                      OR e.time_without_communication > INTERVAL '60 minutes'
                    THEN 1 ELSE 0
                  END
                ) * 100,
                2
              ) AS risk_score
            FROM patients_ervisit v
            JOIN patients_experiencefailureindicator e USING (visit_id)
            GROUP BY v.er_section;
        """)
        response["risk_by_er_section"] = dictfetchall(cursor)

    return JsonResponse(response)
