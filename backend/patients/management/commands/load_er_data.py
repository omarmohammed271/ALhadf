import pandas as pd
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from patients.models import ERVisit, CommunicationEvent, SatisfactionSignal, ContextData, ExperienceFailureIndicator
from datetime import timedelta

class Command(BaseCommand):
    help = "Load ER dashboard data from Excel into database"

    def add_arguments(self, parser):
        parser.add_argument(
            '--file',
            type=str,
            help='Path to the Excel file',
            required=True
        )

    def handle(self, *args, **kwargs):
        file_path = kwargs['file']
        xls = pd.ExcelFile(file_path)

        # ------------------ ERVisit ------------------
        # df_er = pd.read_excel(xls, sheet_name='ERVisit')
        # self.stdout.write("Loading ERVisit...")
        # for _, row in df_er.iterrows():
        #     # Get or create dummy patient user
        #     patient, _ = User.objects.get_or_create(username=row['patient'])
            
        #     ERVisit.objects.update_or_create(
        #         id=row['id'],
        #         defaults={
        #             'patient': patient,
        #             'arrival_ts': row['arrival_ts'],
        #             'triage_ts': row['triage_ts'],
        #             'first_contact_ts': row['first_contact_ts'],
        #             'disposition_ts': row['disposition_ts'],
        #             'triage_level': row['triage_level'],
        #             'er_section': row['er_section'],
        #             'disposition_type': row['disposition_type'],
        #             'length_of_stay': timedelta(minutes=row['length_of_stay']) if not pd.isna(row['length_of_stay']) else None,
        #             'revisit_72h': row['revisit_72h'],
        #             'age_group': row['age_group'],
        #             'metadata': {} if pd.isna(row['metadata']) else row['metadata']
        #         }
        #     )

        # ------------------ CommunicationEvent ------------------
        # df_com = pd.read_excel(xls, sheet_name='CommunicationEvent')
        # self.stdout.write("Loading CommunicationEvent...")
        # for _, row in df_com.iterrows():
        #     visit = ERVisit.objects.get(id=row['visit_id'])
        #     CommunicationEvent.objects.update_or_create(
        #         id=row['id'],
        #         defaults={
        #             'visit': visit,
        #             'event_type': row['event_type'],
        #             'event_ts': row['event_ts'],
        #             'staff_role': row['staff_role'],
        #             'initiated_by': row['initiated_by'],
        #             'metadata': {} if pd.isna(row['metadata']) else row['metadata']
        #         }
        #     )

        # ------------------ SatisfactionSignal ------------------
        # df_satisf = pd.read_excel(xls, sheet_name='SatisfactionSignal')
        # self.stdout.write("Loading SatisfactionSignal...")
        # for _, row in df_satisf.iterrows():
        #     visit = ERVisit.objects.get(id=row['visit_id'])
        #     SatisfactionSignal.objects.update_or_create(
        #         id=row['id'],
        #         defaults={
        #             'visit': visit,
        #             'overall_score': row['overall_score'],
        #             'waiting_score': row['waiting_score'],
        #             'communication_score': row['communication_score'],
        #             'respect_score': row['respect_score'],
        #             'comment': row['comment'],
        #             'metadata': {} if pd.isna(row['metadata']) else row['metadata']
        #         }
        #     )

        # ------------------ ContextData ------------------
        df_context = pd.read_excel(xls, sheet_name='ContextData')
        self.stdout.write("Loading ContextData...")
        for _, row in df_context.iterrows():
            ContextData.objects.update_or_create(
                id=row['id'],
                defaults={
                    'shift': row['shift'],
                    'staffing_level': row['staffing_level'],
                    'er_capacity_level': row['er_capacity_level'],
                    'date': row['date'],
                    'er_section': row['er_section'],
                    'metadata': {} if pd.isna(row['metadata']) else row['metadata']
                }
            )

        # ------------------ ExperienceFailureIndicator ------------------
        # df_fail = pd.read_excel(xls, sheet_name='ExperienceFailureIndicator')
        # self.stdout.write("Loading ExperienceFailureIndicator...")
        # for _, row in df_fail.iterrows():
        #     visit = ERVisit.objects.get(id=row['visit_id'])
        #     comm_event = None
        #     if not pd.isna(row['comm_event_id']):
        #         comm_event = CommunicationEvent.objects.get(id=int(row['comm_event_id']))
        #     ExperienceFailureIndicator.objects.update_or_create(
        #         id=row['id'],
        #         defaults={
        #             'visit': visit,
        #             'comm_event': comm_event,
        #             'lwbs': row['lwbs'],
        #             'time_to_first_contact': timedelta(minutes=row['time_to_first_contact']) if not pd.isna(row['time_to_first_contact']) else None,
        #             'time_without_communication': timedelta(minutes=row['time_without_communication']) if not pd.isna(row['time_without_communication']) else None,
        #             'revisit_reason': row['revisit_reason'],
        #             'metadata': {} if pd.isna(row['metadata']) else row['metadata']
        #         }
        #     )

        self.stdout.write(self.style.SUCCESS("All data loaded successfully!"))
