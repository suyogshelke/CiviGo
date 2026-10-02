import os
import sys
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.test.client import Client

def test_api():
    client = Client()
    print("=== Testing Django Backend Endpoints ===")

    # 1. Admin login
    print("\n1. Admin Login (admin@civigo.in)...")
    res = client.post('/api/auth/login', {'email': 'admin@civigo.in', 'password': 'Admin@123'}, content_type='application/json')
    assert res.status_code == 200, f"Admin login failed: {res.status_code} {res.content}"
    admin_token = res.json()['token']
    print(f"   -> Success! Role: {res.json()['user']['role']}")

    # 2. Officer login
    print("\n2. Officer Login (rahul.officer@civigo.in)...")
    res = client.post('/api/auth/login', {'email': 'rahul.officer@civigo.in', 'password': 'Officer@123'}, content_type='application/json')
    assert res.status_code == 200, f"Officer login failed: {res.status_code} {res.content}"
    officer_token = res.json()['token']
    print(f"   -> Success! Role: {res.json()['user']['role']}")

    # 3. Citizen login
    print("\n3. Citizen Login (suyog@civigo.in)...")
    res = client.post('/api/auth/login', {'email': 'suyog@civigo.in', 'password': 'Citizen@123'}, content_type='application/json')
    assert res.status_code == 200, f"Citizen login failed: {res.status_code} {res.content}"
    citizen_token = res.json()['token']
    print(f"   -> Success! Role: {res.json()['user']['role']}")

    # 4. Verify /api/auth/me with JWT Bearer
    print("\n4. Current User Profile (/api/auth/me)...")
    res = client.get('/api/auth/me', HTTP_AUTHORIZATION=f'Bearer {citizen_token}')
    assert res.status_code == 200, f"/auth/me failed: {res.status_code}"
    print(f"   -> Success! User: {res.json()['full_name']} ({res.json()['email']})")

    # 5. List Departments
    print("\n5. List Departments (/api/departments)...")
    res = client.get('/api/departments', HTTP_AUTHORIZATION=f'Bearer {citizen_token}')
    assert res.status_code == 200, f"/departments failed: {res.status_code}"
    deps = res.json()
    assert len(deps) == 6, f"Expected 6 departments, got {len(deps)}"
    print(f"   -> Success! Found {len(deps)} departments.")

    # 6. List Complaints
    print("\n6. List Complaints (/api/complaints)...")
    res = client.get('/api/complaints', HTTP_AUTHORIZATION=f'Bearer {admin_token}')
    assert res.status_code == 200, f"/complaints failed: {res.status_code}"
    complaints = res.json()
    assert len(complaints) >= 10, f"Expected >= 10 complaints, got {len(complaints)}"
    print(f"   -> Success! Found {len(complaints)} complaints for admin.")

    # 7. Public tracking (/api/complaints/1 without auth)
    print("\n7. Public Tracking (/api/complaints/1 without token)...")
    res = client.get('/api/complaints/1')
    assert res.status_code == 200, f"Public tracking failed: {res.status_code}"
    c1 = res.json()
    assert c1['id'] == 1
    assert len(c1['timeline']) > 0
    print(f"   -> Success! Tracked '{c1['title']}', status: {c1['status']}, timeline steps: {len(c1['timeline'])}")

    # 8. Citizen submit new complaint
    print("\n8. Citizen Submit Complaint (/api/complaints)...")
    res = client.post('/api/complaints', {
        'title': 'Test Broken Water Pipe',
        'description': 'Water leaking near colony gate.',
        'category': 'WATER_LEAKAGE',
        'ward': 'Ward 1 — Kothrud',
        'priority': 'HIGH',
    }, HTTP_AUTHORIZATION=f'Bearer {citizen_token}')
    assert res.status_code == 201, f"Complaint creation failed: {res.status_code} {res.content}"
    new_c = res.json()
    new_c_id = new_c['id']
    print(f"   -> Success! Created complaint ID {new_c_id}, auto-routed dept: {new_c['departmentName']}")

    # 9. Officer update complaint status
    print(f"\n9. Officer Update Status (/api/complaints/{new_c_id}/status)...")
    res = client.patch(
        f'/api/complaints/{new_c_id}/status',
        {'toStatus': 'IN_PROGRESS', 'remark': 'Officer inspected the leak site.'},
        content_type='application/json',
        HTTP_AUTHORIZATION=f'Bearer {officer_token}'
    )
    assert res.status_code == 200, f"Status update failed: {res.status_code} {res.content}"
    print(f"   -> Success! Status updated to {res.json()['status']}")

    # 10. Admin Analytics Overview
    print("\n10. Admin Analytics Overview (/api/analytics/overview)...")
    res = client.get('/api/analytics/overview', HTTP_AUTHORIZATION=f'Bearer {admin_token}')
    assert res.status_code == 200, f"Analytics overview failed: {res.status_code} {res.content}"
    analytics = res.json()
    assert 'totals' in analytics
    assert 'byStatus' in analytics
    assert 'byDepartment' in analytics
    assert len(analytics['trend']) == 6
    print(f"    -> Success! Total: {analytics['totals']['total']}, Resolution rate: {analytics['totals']['resolutionRate']}%, Departments: {analytics['totals']['departments']}")

    # 11. Officer Analytics
    print("\n11. Officer Analytics (/api/analytics/officer)...")
    res = client.get('/api/analytics/officer', HTTP_AUTHORIZATION=f'Bearer {officer_token}')
    assert res.status_code == 200, f"Officer stats failed: {res.status_code}"
    print(f"    -> Success! Assigned: {res.json()['assigned']}, Resolved: {res.json()['resolved']}")

    # 12. Citizen Analytics
    print("\n12. Citizen Analytics (/api/analytics/citizen)...")
    res = client.get('/api/analytics/citizen', HTTP_AUTHORIZATION=f'Bearer {citizen_token}')
    assert res.status_code == 200, f"Citizen stats failed: {res.status_code}"
    print(f"    -> Success! Total filed: {res.json()['total']}, Open: {res.json()['open']}")

    print("\n=======================================================")
    print("  ALL 12 ENDPOINT TESTS PASSED SUCCESSFULLY! (100%)")
    print("=======================================================")

if __name__ == '__main__':
    test_api()
