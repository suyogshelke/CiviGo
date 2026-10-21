from datetime import timedelta
from django.core.management.base import BaseCommand
from django.utils import timezone
from api.models import User, Department, Complaint, ComplaintUpdate, Feedback, Attachment

class Command(BaseCommand):
    help = 'Seeds database with initial data matching database/seed.sql and database/schema.sql'

    def handle(self, *args, **options):
        self.stdout.write('Starting database seeding...')
        now = timezone.now()

        # 1. Departments
        departments_data = [
            (1, 'Public Works', 'PWD', 'Eng. R. Deshmukh', 'pwd@punecivic.gov.in', '9820011001'),
            (2, 'Sanitation', 'SAN', 'Ms. K. Patil', 'sanitation@punecivic.gov.in', '9820011002'),
            (3, 'Water Supply', 'WTR', 'Mr. A. Joshi', 'water@punecivic.gov.in', '9820011003'),
            (4, 'Drainage', 'DRN', 'Mr. S. Kulkarni', 'drainage@punecivic.gov.in', '9820011004'),
            (5, 'Electricity', 'ELE', 'Ms. P. Rane', 'electricity@punecivic.gov.in', '9820011005'),
            (6, 'Roads & Transport', 'RTO', 'Mr. V. Gaikwad', 'roads@punecivic.gov.in', '9820011006'),
        ]

        dept_map = {}
        for d_id, name, code, head, email, phone in departments_data:
            dept, _ = Department.objects.update_or_create(
                id=d_id,
                defaults={
                    'name': name,
                    'code': code,
                    'head': head,
                    'email': email,
                    'phone': phone,
                    'active': True,
                }
            )
            dept_map[d_id] = dept

        self.stdout.write(f'Seeded {len(dept_map)} departments.')

        # 2. Users
        users_data = [
            # Admin
            (1, 'ADMIN', 'System Administrator', 'admin@civigo.in', '9800000001', 'Admin@123', 'Ward 5 — Shivajinagar', 'Municipal HQ, Shivajinagar', None, None, None),
            # Officers
            (2, 'OFFICER', 'Rahul Deshmukh', 'rahul.officer@civigo.in', '9800000002', 'Officer@123', None, None, None, 'Junior Engineer', 1),
            (3, 'OFFICER', 'Kavita Patil', 'kavita.officer@civigo.in', '9800000003', 'Officer@123', None, None, None, 'Sanitary Inspector', 2),
            (4, 'OFFICER', 'Amit Joshi', 'amit.officer@civigo.in', '9800000004', 'Officer@123', None, None, None, 'Section Officer', 3),
            (5, 'OFFICER', 'Sunil Kulkarni', 'sunil.officer@civigo.in', '9800000005', 'Officer@123', None, None, None, 'Field Engineer', 4),
            (6, 'OFFICER', 'Priya Rane', 'priya.officer@civigo.in', '9800000006', 'Officer@123', None, None, None, 'Electrical Supervisor', 5),
            # Citizens
            (7, 'CITIZEN', 'Suyog Shelke', 'suyog@civigo.in', '9811100007', 'Citizen@123', 'Ward 1 — Kothrud', 'Kothrud, Pune', '411038', None, None),
            (8, 'CITIZEN', 'Soham Shelke', 'soham@civigo.in', '9811100008', 'Citizen@123', 'Ward 2 — Karve Nagar', 'Karve Nagar, Pune', '411052', None, None),
            (9, 'CITIZEN', 'Meera Nair', 'meera@civigo.in', '9811100009', 'Citizen@123', 'Ward 4 — Erandwane', 'Erandwane, Pune', '411004', None, None),
            (10, 'CITIZEN', 'Imran Shaikh', 'imran@civigo.in', '9811100010', 'Citizen@123', 'Ward 6 — Kondhwa', 'Kondhwa, Pune', '411048', None, None),
        ]

        user_map = {}
        for u_id, role, full_name, email, phone, password, ward, address, pincode, designation, dept_id in users_data:
            user, created = User.objects.get_or_create(
                id=u_id,
                defaults={'email': email, 'role': role, 'full_name': full_name}
            )
            user.email = email
            user.role = role
            user.full_name = full_name
            user.phone = phone or ''
            user.ward = ward or ''
            user.address = address or ''
            user.pincode = pincode or ''
            user.designation = designation or ''
            user.department = dept_map.get(dept_id)
            user.is_active = True
            user.set_password(password)
            if role == 'ADMIN':
                user.is_staff = True
                user.is_superuser = True
            user.save()
            user_map[u_id] = user

        self.stdout.write(f'Seeded {len(user_map)} users.')

        # 3. Complaints
        complaints_data = [
            (1, 'Large pothole causing traffic slowdown', 'A deep pothole near the bus depot is causing daily traffic slowdowns and is a hazard to two-wheelers.', 'POTHOLE', 'RESOLVED', 'HIGH', 1, 'Ward 1 — Kothrud', 'near Bus Depot', '411038', 18.507, 73.807, 7, 2, 30, 21, 21),
            (2, 'Garbage not collected for over a week', 'Community waste bin opposite City Mall has been overflowing for over a week, attracting stray animals.', 'GARBAGE', 'IN_PROGRESS', 'MEDIUM', 2, 'Ward 2 — Karve Nagar', 'opposite City Mall', '411052', 18.502, 73.812, 8, 3, 12, 3, None),
            (3, 'Continuous water leakage from main pipeline', 'A burst pipe beside the government school is wasting water and flooding the lane.', 'WATER_LEAKAGE', 'ASSIGNED', 'CRITICAL', 3, 'Ward 4 — Erandwane', 'beside Government School', '411004', 18.516, 73.821, 9, 4, 6, 4, None),
            (4, 'Blocked drainage causing waterlogging', 'Blocked drainage near the water tank causes waterlogging after every rain.', 'DRAINAGE', 'UNDER_REVIEW', 'HIGH', 4, 'Ward 6 — Kondhwa', 'near Water Tank', '411048', 18.463, 73.885, 10, None, 8, 6, None),
            (5, 'Frequent power cuts in the evening', 'The area faces frequent evening power cuts, disrupting work and study.', 'ELECTRICITY', 'SUBMITTED', 'MEDIUM', 5, 'Ward 1 — Kothrud', 'at Main Chowk', '411038', 18.509, 73.805, 7, None, 2, 2, None),
            (6, 'Streetlight not working for two weeks', 'The streetlight near the temple road junction has been off for two weeks, leaving the lane dark at night.', 'STREETLIGHT', 'CLOSED', 'LOW', 5, 'Ward 2 — Karve Nagar', 'near Temple Road', '411052', 18.498, 73.815, 8, 6, 45, 33, 34),
            (7, 'Traffic signal not functioning', 'The traffic signal at the main chowk is not functioning, causing confusion during peak hours.', 'TRAFFIC', 'SUBMITTED', 'HIGH', 6, 'Ward 4 — Erandwane', 'at Main Chowk', '411004', 18.518, 73.823, 9, None, 3, 3, None),
            (8, 'No water supply for three days', 'No water supply for three days behind the market yard; residents are struggling.', 'WATER_SUPPLY', 'RESOLVED', 'MEDIUM', 3, 'Ward 6 — Kondhwa', 'behind Market Yard', '411048', 18.461, 73.888, 10, 4, 20, 14, 14),
            (9, 'Aggressive stray dogs near park', 'A pack of aggressive stray dogs near the park is frightening morning walkers and children.', 'STRAY_ANIMALS', 'REJECTED', 'LOW', 2, 'Ward 1 — Kothrud', 'near Temple Road', '411038', 18.505, 73.809, 7, None, 15, 12, None),
            (10, 'Loud construction noise late at night', 'Construction work opposite the petrol pump continues late at night, disturbing residents.', 'NOISE', 'ASSIGNED', 'MEDIUM', 2, 'Ward 2 — Karve Nagar', 'opposite Petrol Pump', '411052', 18.500, 73.818, 8, 3, 5, 3, None),
        ]

        complaint_map = {}
        for c_id, title, desc, cat, st, pri, d_id, ward, lm, pin, lat, lng, cit_id, off_id, c_days, u_days, r_days in complaints_data:
            c, _ = Complaint.objects.update_or_create(
                id=c_id,
                defaults={
                    'title': title,
                    'description': desc,
                    'category': cat,
                    'status': st,
                    'priority': pri,
                    'department': dept_map.get(d_id),
                    'ward': ward,
                    'landmark': lm,
                    'pincode': pin,
                    'latitude': lat,
                    'longitude': lng,
                    'citizen': user_map[cit_id],
                    'assigned_officer': user_map.get(off_id) if off_id else None,
                    'created_at': now - timedelta(days=c_days),
                    'updated_at': now - timedelta(days=u_days),
                    'resolved_at': (now - timedelta(days=r_days)) if r_days is not None else None,
                }
            )
            # Ensure custom created_at timestamp persists
            Complaint.objects.filter(id=c_id).update(
                created_at=now - timedelta(days=c_days),
                updated_at=now - timedelta(days=u_days),
                resolved_at=(now - timedelta(days=r_days)) if r_days is not None else None,
            )
            complaint_map[c_id] = c

        self.stdout.write(f'Seeded {len(complaint_map)} complaints.')

        # 4. Timeline updates
        ComplaintUpdate.objects.all().delete()
        updates_data = [
            # #1 pothole
            (1, None, 'SUBMITTED', 'Complaint submitted by citizen.', 7, 'Suyog Shelke', 'CITIZEN', 30),
            (1, 'SUBMITTED', 'UNDER_REVIEW', 'Complaint reviewed and verified. Forwarding to the concerned department.', 1, 'System Administrator', 'ADMIN', 28),
            (1, 'UNDER_REVIEW', 'ASSIGNED', 'Complaint assigned to the field officer for inspection.', 2, 'Rahul Deshmukh', 'OFFICER', 26),
            (1, 'ASSIGNED', 'IN_PROGRESS', 'Site inspection completed. Repair work has commenced.', 2, 'Rahul Deshmukh', 'OFFICER', 24),
            (1, 'IN_PROGRESS', 'RESOLVED', 'Work completed and verified on site. Issue has been resolved.', 2, 'Rahul Deshmukh', 'OFFICER', 21),
            # #2 garbage
            (2, None, 'SUBMITTED', 'Complaint submitted by citizen.', 8, 'Soham Shelke', 'CITIZEN', 12),
            (2, 'SUBMITTED', 'UNDER_REVIEW', 'Complaint reviewed and verified. Forwarding to the concerned department.', 1, 'System Administrator', 'ADMIN', 10),
            (2, 'UNDER_REVIEW', 'ASSIGNED', 'Complaint assigned to the field officer for inspection.', 3, 'Kavita Patil', 'OFFICER', 7),
            (2, 'ASSIGNED', 'IN_PROGRESS', 'Site inspection completed. Repair work has commenced.', 3, 'Kavita Patil', 'OFFICER', 3),
            # #3 water leakage
            (3, None, 'SUBMITTED', 'Complaint submitted by citizen.', 9, 'Meera Nair', 'CITIZEN', 6),
            (3, 'SUBMITTED', 'UNDER_REVIEW', 'Complaint reviewed and verified. Forwarding to the concerned department.', 1, 'System Administrator', 'ADMIN', 5),
            (3, 'UNDER_REVIEW', 'ASSIGNED', 'Complaint assigned to the field officer for inspection.', 4, 'Amit Joshi', 'OFFICER', 4),
            # #4 drainage
            (4, None, 'SUBMITTED', 'Complaint submitted by citizen.', 10, 'Imran Shaikh', 'CITIZEN', 8),
            (4, 'SUBMITTED', 'UNDER_REVIEW', 'Complaint reviewed and verified. Forwarding to the concerned department.', 1, 'System Administrator', 'ADMIN', 6),
            # #5 electricity
            (5, None, 'SUBMITTED', 'Complaint submitted by citizen.', 7, 'Suyog Shelke', 'CITIZEN', 2),
            # #6 streetlight
            (6, None, 'SUBMITTED', 'Complaint submitted by citizen.', 8, 'Soham Shelke', 'CITIZEN', 45),
            (6, 'SUBMITTED', 'UNDER_REVIEW', 'Complaint reviewed and verified. Forwarding to the concerned department.', 1, 'System Administrator', 'ADMIN', 43),
            (6, 'UNDER_REVIEW', 'ASSIGNED', 'Complaint assigned to the field officer for inspection.', 6, 'Priya Rane', 'OFFICER', 41),
            (6, 'ASSIGNED', 'IN_PROGRESS', 'Site inspection completed. Repair work has commenced.', 6, 'Priya Rane', 'OFFICER', 38),
            (6, 'IN_PROGRESS', 'RESOLVED', 'Work completed and verified on site. Issue has been resolved.', 6, 'Priya Rane', 'OFFICER', 34),
            (6, 'RESOLVED', 'CLOSED', 'Complaint closed after citizen confirmation.', 6, 'Priya Rane', 'OFFICER', 33),
            # #7 traffic
            (7, None, 'SUBMITTED', 'Complaint submitted by citizen.', 9, 'Meera Nair', 'CITIZEN', 3),
            # #8 water supply
            (8, None, 'SUBMITTED', 'Complaint submitted by citizen.', 10, 'Imran Shaikh', 'CITIZEN', 20),
            (8, 'SUBMITTED', 'UNDER_REVIEW', 'Complaint reviewed and verified. Forwarding to the concerned department.', 1, 'System Administrator', 'ADMIN', 18),
            (8, 'UNDER_REVIEW', 'ASSIGNED', 'Complaint assigned to the field officer for inspection.', 4, 'Amit Joshi', 'OFFICER', 17),
            (8, 'ASSIGNED', 'IN_PROGRESS', 'Site inspection completed. Repair work has commenced.', 4, 'Amit Joshi', 'OFFICER', 16),
            (8, 'IN_PROGRESS', 'RESOLVED', 'Work completed and verified on site. Issue has been resolved.', 4, 'Amit Joshi', 'OFFICER', 14),
            # #9 stray animals
            (9, None, 'SUBMITTED', 'Complaint submitted by citizen.', 7, 'Suyog Shelke', 'CITIZEN', 15),
            (9, 'SUBMITTED', 'UNDER_REVIEW', 'Complaint reviewed and verified. Forwarding to the concerned department.', 1, 'System Administrator', 'ADMIN', 13),
            (9, 'UNDER_REVIEW', 'REJECTED', 'Complaint could not be validated — insufficient or duplicate information.', 1, 'System Administrator', 'ADMIN', 12),
            # #10 noise
            (10, None, 'SUBMITTED', 'Complaint submitted by citizen.', 8, 'Soham Shelke', 'CITIZEN', 5),
            (10, 'SUBMITTED', 'UNDER_REVIEW', 'Complaint reviewed and verified. Forwarding to the concerned department.', 1, 'System Administrator', 'ADMIN', 4),
            (10, 'UNDER_REVIEW', 'ASSIGNED', 'Complaint assigned to the field officer for inspection.', 3, 'Kavita Patil', 'OFFICER', 3),
        ]

        updates = []
        for c_id, from_st, to_st, remark, b_id, b_name, b_role, days in updates_data:
            update = ComplaintUpdate(
                complaint=complaint_map[c_id],
                from_status=from_st,
                to_status=to_st,
                remark=remark,
                by_user_id=b_id,
                by_name=b_name,
                by_role=b_role,
            )
            updates.append((update, now - timedelta(days=days)))

        for u, created_time in updates:
            u.save()
            ComplaintUpdate.objects.filter(id=u.id).update(created_at=created_time)

        self.stdout.write(f'Seeded {len(updates)} timeline updates.')

        # 5. Feedback
        Feedback.objects.all().delete()
        feedback_data = [
            (1, 7, 'Suyog Shelke', 5, 'Quick and satisfactory resolution. Thank you!', 20),
            (6, 8, 'Soham Shelke', 4, 'Resolved properly. Hope it stays fixed.', 33),
            (8, 10, 'Imran Shaikh', 4, 'Issue was resolved well, though it took a little time.', 13),
        ]

        for c_id, cit_id, cit_name, rating, comment, days in feedback_data:
            fb = Feedback.objects.create(
                complaint=complaint_map[c_id],
                citizen=user_map[cit_id],
                citizen_name=cit_name,
                rating=rating,
                comment=comment,
            )
            Feedback.objects.filter(id=fb.id).update(
                created_at=now - timedelta(days=days),
                updated_at=now - timedelta(days=days)
            )

        self.stdout.write(f'Seeded {len(feedback_data)} feedback ratings.')
        self.stdout.write(self.style.SUCCESS('Successfully seeded database with full demo dataset!'))
