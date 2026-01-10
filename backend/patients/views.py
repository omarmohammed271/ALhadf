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
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response


def dictfetchone(cursor):
    columns = [col[0] for col in cursor.description]
    row = cursor.fetchone()
    return dict(zip(columns, row)) if row else None


def dictfetchall(cursor):
    columns = [col[0] for col in cursor.description]
    return [dict(zip(columns, row)) for row in cursor.fetchall()]



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def er_dashboard_api(request):
    response = {}

    with connection.cursor() as cursor:

      cursor.execute("""
        SELECT
          ROUND(
            AVG(EXTRACT(EPOCH FROM (first_contact_ts - arrival_ts)) / 60)
            FILTER (WHERE first_contact_ts IS NOT NULL
                  AND first_contact_ts >= arrival_ts),
            0
          ) AS avg_time_to_first_contact
        FROM patients_ervisit;

      """)
      response["avg_time_to_first_contact"] = dictfetchone(cursor)


      # Timely communication % (≤ 30 min)
      cursor.execute("""
          WITH first_comm AS (
            SELECT
              visit_id,
              MIN(event_ts) AS first_comm_ts
            FROM patients_communicationevent
            GROUP BY visit_id
          )
          SELECT
            ROUND(
              100.0 * COUNT(*) FILTER (
                WHERE fc.first_comm_ts IS NOT NULL
                  AND EXTRACT(EPOCH FROM (fc.first_comm_ts - v.arrival_ts)) / 60 <= 15
              ) / NULLIF(COUNT(*), 0),
              0
            ) AS timely_communication_pct
          FROM patients_ervisit v
          LEFT JOIN first_comm fc
            ON fc.visit_id = v.id;

      """)
      response["timely_communication_pct"] = dictfetchone(cursor)


      # Avg satisfaction
      cursor.execute("""
          SELECT
            ROUND(AVG(overall_score), 1) AS avg_satisfaction
          FROM patients_satisfactionsignal
          WHERE overall_score IS NOT NULL;
      """)
      response["avg_satisfaction"] = dictfetchone(cursor)


      # LWBS rate
      cursor.execute("""
          SELECT
              er_section,
              COUNT(*) AS total_visits,
              COUNT(CASE WHEN disposition_type = 'lwbs' THEN 1 END) AS lwbs_count,
              ROUND(
                  COUNT(CASE WHEN disposition_type = 'lwbs' THEN 1 END)::numeric 
                  / COUNT(*) * 100,
                  1
              ) AS lwbs_rate_pct
          FROM patients_ervisit
          GROUP BY er_section
          ORDER BY lwbs_rate_pct DESC;
      """)
      response["lwbs_rate"] = dictfetchone(cursor)


      # 72h revisit rate
      cursor.execute("""
          SELECT
            ROUND(
              100.0 * COUNT(*) FILTER (WHERE revisit_72h = TRUE)
              / NULLIF(COUNT(*) FILTER (WHERE disposition_ts IS NOT NULL), 0),
              0
            ) AS revisit_rate_pct
          FROM patients_ervisit;
      """)
      response["revisit_rate"] = dictfetchone(cursor)


      # High dissatisfaction risk %
      cursor.execute("""
          WITH visit_risk AS (
            SELECT
              v.id,
              (
                0.35 * LEAST(
                  GREATEST(
                    (EXTRACT(EPOCH FROM e.time_to_first_contact) / 60 - 15) / 30 * 100,
                    0
                  ),
                  100
                )
                + 0.25 * CASE
                    WHEN e.time_without_communication IS NULL
                        OR EXTRACT(EPOCH FROM e.time_without_communication) / 60 > 30
                    THEN 100 ELSE 0
                  END
                + 0.25 * CASE WHEN e.lwbs THEN 100 ELSE 0 END
                + 0.15 * CASE WHEN v.revisit_72h THEN 100 ELSE 0 END
              ) AS risk_score
            FROM patients_ervisit v
            JOIN patients_experiencefailureindicator e
              ON e.visit_id = v.id
          )
          SELECT
            ROUND(
              100.0 * COUNT(*) FILTER (WHERE risk_score >= 70)
              / NULLIF(COUNT(*), 0),
              0
            ) AS high_risk_visit_pct
          FROM visit_risk;
      """)
      response["high_risk_pct"] = dictfetchone(cursor)




      # ----------------------------------------
      
      
      
      # Arrival → First contact trend
      cursor.execute("""
        SELECT
            er_section,
            ROUND(
                AVG(EXTRACT(EPOCH FROM (first_contact_ts - arrival_ts))/60),
                2
            ) AS avg_minutes
        FROM patients_ervisit
        WHERE first_contact_ts IS NOT NULL
        GROUP BY er_section
        ORDER BY er_section;
      """)
      response["arrival_to_first_contact_trend"] = dictfetchall(cursor)


      # Waiting time by triage
      cursor.execute("""
          SELECT
              triage_level,
              ROUND(
                  EXTRACT(EPOCH FROM (first_contact_ts - arrival_ts)) / 60,
                  2
              ) AS wait_minutes
          FROM patients_ervisit
          WHERE triage_level IS NOT NULL
            AND first_contact_ts IS NOT NULL
          ORDER BY triage_level;
      """)
      response["waiting_time_by_triage"] = dictfetchall(cursor)


      # Communication coverage by ER section
      cursor.execute("""
          SELECT
              v.er_section,
              ROUND(
                  100.0 * COUNT(DISTINCT c.visit_id) / NULLIF(COUNT(DISTINCT v.id),0),
                  2
              ) AS coverage_pct
          FROM patients_ervisit v
          LEFT JOIN patients_communicationevent c
            ON c.visit_id = v.id
          GROUP BY v.er_section
          ORDER BY v.er_section;

      """)
      response["communication_coverage_by_er_section"] = dictfetchall(cursor)


      # First communication trend
      cursor.execute("""
        WITH first_comm AS (
            SELECT
                visit_id,
                MIN(event_ts) AS first_comm_ts
            FROM patients_communicationevent
            WHERE event_type = 'initial'
            GROUP BY visit_id
        )
        SELECT
            v.er_section,
            ROUND(
                AVG(
                    GREATEST(EXTRACT(EPOCH FROM (fc.first_comm_ts - v.arrival_ts)) / 60, 0)
                ),
                2
            ) AS avg_minutes_to_first_contact
        FROM patients_ervisit v
        LEFT JOIN first_comm fc ON fc.visit_id = v.id
        GROUP BY v.er_section
        ORDER BY avg_minutes_to_first_contact DESC NULLS LAST;

      """)
      response["first_communication_trend"] = dictfetchall(cursor)


      # LOS vs satisfaction
      cursor.execute("""
        SELECT
          CASE
            WHEN EXTRACT(EPOCH FROM v.length_of_stay)/60 <= 30 THEN 30
            WHEN EXTRACT(EPOCH FROM v.length_of_stay)/60 <= 60 THEN 60
            WHEN EXTRACT(EPOCH FROM v.length_of_stay)/60 <= 90 THEN 90
            WHEN EXTRACT(EPOCH FROM v.length_of_stay)/60 <= 120 THEN 120
            WHEN EXTRACT(EPOCH FROM v.length_of_stay)/60 <= 180 THEN 180
            ELSE 240
          END AS los_bucket_minutes,
          ROUND(AVG(s.overall_score)*20, 2) AS avg_satisfaction_pct
        FROM patients_ervisit v
        JOIN patients_satisfactionsignal s ON s.visit_id = v.id
        WHERE v.length_of_stay IS NOT NULL
          AND s.overall_score IS NOT NULL
        GROUP BY los_bucket_minutes
        ORDER BY los_bucket_minutes;

      """)
      response["los_vs_satisfaction"] = dictfetchall(cursor)


      # First contact delay impact
      cursor.execute("""
        SELECT
          CASE
            WHEN EXTRACT(EPOCH FROM (v.first_contact_ts - v.arrival_ts))/60 <= 5 THEN '0-5 min'
            WHEN EXTRACT(EPOCH FROM (v.first_contact_ts - v.arrival_ts))/60 <= 10 THEN '5-10 min'
            WHEN EXTRACT(EPOCH FROM (v.first_contact_ts - v.arrival_ts))/60 <= 15 THEN '10-15 min'
            WHEN EXTRACT(EPOCH FROM (v.first_contact_ts - v.arrival_ts))/60 <= 30 THEN '15-30 min'
            ELSE '30+ min'
          END AS delay_bucket,
          ROUND(AVG(s.overall_score)*20, 2) AS avg_satisfaction_pct
        FROM patients_ervisit v
        JOIN patients_satisfactionsignal s ON s.visit_id = v.id
        WHERE v.first_contact_ts IS NOT NULL
          AND v.arrival_ts IS NOT NULL
          AND s.overall_score IS NOT NULL
        GROUP BY delay_bucket
        ORDER BY MIN(EXTRACT(EPOCH FROM (v.first_contact_ts - v.arrival_ts)));

      """)
      response["first_contact_delay_impact"] = dictfetchall(cursor)


      # LWBS by ER section
      cursor.execute("""
          SELECT
              er_section,
              ROUND(
                  100.0 * SUM(CASE WHEN disposition_type = 'lwbs' THEN 1 ELSE 0 END)
                  / NULLIF(COUNT(*), 0),
                  1
              ) AS lwbs_rate
          FROM patients_ervisit
          GROUP BY er_section
          ORDER BY lwbs_rate DESC;

      """)
      response["lwbs_by_er_section"] = dictfetchall(cursor)


      # Revisit vs communication
      cursor.execute("""
          WITH comm_flag AS (
            SELECT DISTINCT visit_id
            FROM patients_communicationevent
          )
          SELECT
            CASE
              WHEN c.visit_id IS NULL THEN 'No Communication'
              ELSE 'Communication Provided'
            END AS communication_status,

            ROUND(
              100.0 * COUNT(*) FILTER (WHERE v.revisit_72h = TRUE) / COUNT(*),
              2
            ) AS revisit_rate_pct
          FROM patients_ervisit v
          LEFT JOIN comm_flag c
            ON c.visit_id = v.id
          GROUP BY communication_status
          ORDER BY communication_status;

      """)
      response["revisit_vs_communication"] = dictfetchall(cursor)


      # Satisfaction by Shift & Pressure Level
      cursor.execute("""
          WITH shifts AS (
              SELECT unnest(ARRAY['Morning','Afternoon','Night']) AS shift
          ),
          pressure_levels AS (
              SELECT unnest(ARRAY['low','medium','high']) AS pressure_level
          ),
          matrix AS (
              SELECT s.shift, p.pressure_level
              FROM shifts s CROSS JOIN pressure_levels p
          )
          SELECT
              m.shift,
              m.pressure_level,
              ROUND(AVG(s.overall_score) * 20, 2) AS avg_satisfaction_pct
          FROM matrix m
          LEFT JOIN (
              SELECT
                  v.*,
                  CASE
                      WHEN EXTRACT(HOUR FROM v.arrival_ts) BETWEEN 7 AND 14 THEN 'Morning'
                      WHEN EXTRACT(HOUR FROM v.arrival_ts) BETWEEN 15 AND 22 THEN 'Afternoon'
                      ELSE 'Night'
                  END AS shift
              FROM patients_ervisit v
          ) v ON v.shift = m.shift
          LEFT JOIN patients_contextdata cd
                ON cd.date = DATE(v.arrival_ts)
                AND cd.er_section = v.er_section
                AND (
                      (cd.shift = 'day' AND v.shift = 'Morning')
                      OR (cd.shift = 'evening' AND v.shift = 'Afternoon')
                      OR (cd.shift = 'night' AND v.shift = 'Night')
                )
          LEFT JOIN patients_satisfactionsignal s ON s.visit_id = v.id
          GROUP BY m.shift, m.pressure_level
          ORDER BY
              CASE m.shift
                  WHEN 'Morning' THEN 1
                  WHEN 'Afternoon' THEN 2
                  ELSE 3
              END,
              m.pressure_level;

      """) 
      response["satisfaction_by_shift"] = dictfetchall(cursor)
      
      # Dissatisfaction risk by ER section
      cursor.execute("""
        WITH section_metrics AS (
            SELECT
                v.er_section,
                AVG(EXTRACT(EPOCH FROM (v.first_contact_ts - v.arrival_ts)) / 60)
                    FILTER (WHERE v.first_contact_ts IS NOT NULL) AS avg_first_contact_min,
                AVG(
                    CASE
                        WHEN e.time_without_communication IS NULL THEN 0
                        WHEN EXTRACT(EPOCH FROM e.time_without_communication)/60 > 30 THEN 1
                        ELSE 0
                    END
                ) * 100 AS comm_failure_pct,
                AVG(CASE WHEN e.lwbs THEN 1 ELSE 0 END) * 100 AS lwbs_pct,
                AVG(CASE WHEN v.revisit_72h THEN 1 ELSE 0 END) * 100 AS revisit_pct
            FROM patients_ervisit v
            LEFT JOIN patients_experiencefailureindicator e ON e.visit_id = v.id
            GROUP BY v.er_section
        )
        SELECT
            er_section AS section,
            ROUND(
                0.35 * LEAST(GREATEST((avg_first_contact_min - 15)/30*100, 0), 100)
              + 0.25 * comm_failure_pct
              + 0.25 * lwbs_pct
              + 0.15 * revisit_pct,
              0
            ) AS risk_score
        FROM section_metrics
        ORDER BY risk_score DESC;

      """)
      response["risk_by_er_section"] = dictfetchall(cursor)

    return Response(response)
