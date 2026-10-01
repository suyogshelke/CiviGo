from datetime import timedelta
from django.db.models import Avg, Count, Q
from django.utils import timezone
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from api.models import Complaint, Department, Feedback, User

PRIORITY_META = {
    'LOW': {'label': 'Low', 'variant': 'success', 'icon': 'bi-arrow-down', 'slaDays': 15, 'weight': 1},
    'MEDIUM': {'label': 'Medium', 'variant': 'info', 'icon': 'bi-dash', 'slaDays': 10, 'weight': 2},
    'HIGH': {'label': 'High', 'variant': 'warning', 'icon': 'bi-arrow-up', 'slaDays': 5, 'weight': 3},
    'CRITICAL': {'label': 'Critical', 'variant': 'danger', 'icon': 'bi-exclamation-triangle', 'slaDays': 2, 'weight': 4},
}

OPEN_STATUSES = ['SUBMITTED', 'UNDER_REVIEW', 'ASSIGNED', 'IN_PROGRESS']
RESOLVED_STATUSES = ['RESOLVED', 'CLOSED']

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def analytics_overview(request):
    if request.user.role != 'ADMIN':
        return Response({'message': 'Access forbidden'}, status=status.HTTP_403_FORBIDDEN)

    all_complaints = Complaint.objects.all()
    total = all_complaints.count()

    pending = all_complaints.filter(status__in=OPEN_STATUSES).count()
    resolved = all_complaints.filter(status__in=RESOLVED_STATUSES).count()
    resolution_rate = round((resolved / total) * 100) if total else 0

    # byStatus
    by_status = {}
    for item in all_complaints.values('status').annotate(count=Count('id')):
        by_status[item['status']] = item['count']

    # byCategory
    by_category = {}
    for item in all_complaints.values('category').annotate(count=Count('id')):
        by_category[item['category']] = item['count']

    # byPriority
    by_priority = {}
    for item in all_complaints.values('priority').annotate(count=Count('id')):
        by_priority[item['priority']] = item['count']

    # byWard
    by_ward = {}
    for item in all_complaints.exclude(ward='').values('ward').annotate(count=Count('id')):
        by_ward[item['ward']] = item['count']

    # byDepartment
    by_department = {}
    for dept in Department.objects.all():
        dept_complaints = all_complaints.filter(department=dept)
        by_department[dept.name] = {
            'total': dept_complaints.count(),
            'resolved': dept_complaints.filter(status__in=RESOLVED_STATUSES).count(),
        }
    # Unassigned complaints
    unassigned = all_complaints.filter(department__isnull=True)
    if unassigned.exists():
        by_department['Unassigned'] = {
            'total': unassigned.count(),
            'resolved': unassigned.filter(status__in=RESOLVED_STATUSES).count(),
        }

    # Resolution time
    resolved_complaints = all_complaints.filter(status__in=RESOLVED_STATUSES, resolved_at__isnull=False)
    resolution_days = [
        max(0, (c.resolved_at - c.created_at).total_seconds() / 86400)
        for c in resolved_complaints
    ]
    avg_resolution_days = f"{sum(resolution_days) / len(resolution_days):.1f}" if resolution_days else "0.0"

    # Feedback rating
    feedbacks = Feedback.objects.all()
    avg_rating_val = feedbacks.aggregate(avg=Avg('rating'))['avg']
    avg_rating = f"{avg_rating_val:.1f}" if avg_rating_val else "0.0"

    # 6-month trend
    trend = []
    now = timezone.now()
    for i in range(5, -1, -1):
        # Calculate month range
        year = now.year
        month = now.month - i
        while month <= 0:
            month += 12
            year -= 1
        month_label = timezone.datetime(year, month, 1).strftime('%b')
        submitted_count = all_complaints.filter(
            created_at__year=year,
            created_at__month=month
        ).count()
        resolved_count = all_complaints.filter(
            resolved_at__year=year,
            resolved_at__month=month
        ).count()
        trend.append({
            'month': month_label,
            'submitted': submitted_count,
            'resolved': resolved_count,
        })

    critical = all_complaints.filter(priority='CRITICAL', status__in=OPEN_STATUSES).count()
    dept_count = Department.objects.count()
    officer_count = User.objects.filter(role='OFFICER').count()
    citizen_count = User.objects.filter(role='CITIZEN').count()

    return Response({
        'totals': {
            'total': total,
            'pending': pending,
            'resolved': resolved,
            'resolutionRate': resolution_rate,
            'avgResolutionDays': avg_resolution_days,
            'avgRating': avg_rating,
            'critical': critical,
            'departments': dept_count,
            'officers': officer_count,
            'citizens': citizen_count,
        },
        'byStatus': by_status,
        'byCategory': by_category,
        'byPriority': by_priority,
        'byWard': by_ward,
        'byDepartment': by_department,
        'trend': trend,
        'priorityMeta': PRIORITY_META,
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def analytics_officer(request):
    if request.user.role != 'OFFICER':
        return Response({'message': 'Access forbidden'}, status=status.HTTP_403_FORBIDDEN)
    qs = Complaint.objects.filter(assigned_officer=request.user)
    return Response({
        'assigned': qs.count(),
        'inProgress': qs.filter(status='IN_PROGRESS').count(),
        'resolved': qs.filter(status__in=RESOLVED_STATUSES).count(),
        'pending': qs.filter(status__in=['ASSIGNED', 'IN_PROGRESS']).count(),
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def analytics_citizen(request):
    if request.user.role != 'CITIZEN':
        return Response({'message': 'Access forbidden'}, status=status.HTTP_403_FORBIDDEN)
    qs = Complaint.objects.filter(citizen=request.user)
    return Response({
        'total': qs.count(),
        'open': qs.filter(status__in=OPEN_STATUSES).count(),
        'resolved': qs.filter(status__in=RESOLVED_STATUSES).count(),
        'awaitingFeedback': qs.filter(status='RESOLVED', feedback__isnull=True).count(),
    })
