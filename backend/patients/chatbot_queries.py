from django.db import connection
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

def dictfetchone(cursor):
    columns = [col[0] for col in cursor.description]
    row = cursor.fetchone()
    return dict(zip(columns, row)) if row else None


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def busiest_er_section(request):
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT er_section, COUNT(*) AS visit_count
            FROM patients_ervisit
            GROUP BY er_section
            ORDER BY visit_count DESC
            LIMIT 1;
        """)
        row = dictfetchone(cursor)
    result = f"{row['er_section']} ({row['visit_count']} visits)" if row else ""
    return Response(result)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def most_common_triage(request):
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT triage_level, COUNT(*) AS count
            FROM patients_ervisit
            WHERE triage_level IS NOT NULL
            GROUP BY triage_level
            ORDER BY count DESC
            LIMIT 1;
        """)
        row = dictfetchone(cursor)
    result = f"{row['triage_level']} ({row['count']} visits)" if row else ""
    return Response(result)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def avg_communications_per_visit(request):
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT ROUND(AVG(comm_count), 2) AS avg_communications
            FROM (
                SELECT COUNT(*) AS comm_count
                FROM patients_communicationevent
                GROUP BY visit_id
            ) sub;
        """)
        row = dictfetchone(cursor)
    result = str(row['avg_communications']) if row else ""
    return Response(result)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def worst_satisfaction_section(request):
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT v.er_section, ROUND(AVG(s.overall_score), 2) AS avg_score
            FROM patients_satisfactionsignal s
            JOIN patients_ervisit v ON v.id = s.visit_id
            WHERE s.overall_score IS NOT NULL
            GROUP BY v.er_section
            ORDER BY avg_score ASC
            LIMIT 1;
        """)
        row = dictfetchone(cursor)
    result = f"{row['er_section']} ({row['avg_score']})" if row else ""
    return Response(result)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def visits_without_communication(request):
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT ROUND(
                100.0 * COUNT(*) / (SELECT COUNT(*) FROM patients_ervisit),
                2
            ) AS percentage
            FROM patients_ervisit v
            WHERE NOT EXISTS (
                SELECT 1 FROM patients_communicationevent c
                WHERE c.visit_id = v.id
            );
        """)
        row = dictfetchone(cursor)
    result = f"{row['percentage']}%" if row else ""
    return Response(result)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def busiest_shift(request):
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT c.shift, COUNT(v.id) AS visit_count
            FROM patients_contextdata c
            JOIN patients_ervisit v ON DATE(v.arrival_ts) = c.date
            AND v.er_section = c.er_section
            GROUP BY c.shift
            ORDER BY visit_count DESC
            LIMIT 1;
        """)
        row = dictfetchone(cursor)
    result = f"{row['shift']} ({row['visit_count']} visits)" if row else ""
    return Response(result)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def avg_time_to_first_contact_lwbs(request):
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT 
              ROUND(AVG(EXTRACT(EPOCH FROM (first_contact_ts - arrival_ts)) / 60), 2)
              AS avg_minutes
            FROM patients_ervisit
            WHERE disposition_type = 'lwbs'
            AND first_contact_ts IS NOT NULL;
        """)
        row = dictfetchone(cursor)
    result = f"{row['avg_minutes']} min" if row else ""
    return Response(result)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def most_common_failure_reason(request):
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT revisit_reason, COUNT(*) AS count
            FROM patients_experiencefailureindicator
            WHERE revisit_reason IS NOT NULL
            GROUP BY revisit_reason
            ORDER BY count DESC
            LIMIT 1;
        """)
        row = dictfetchone(cursor)
    result = f"{row['revisit_reason']} ({row['count']} times)" if row else ""
    return Response(result)
