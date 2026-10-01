import os
from django.conf import settings
from django.core.files.storage import default_storage
from django.db.models import Q
from django.utils import timezone
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from api.models import Complaint, Attachment, ComplaintUpdate, Feedback, User, Department
from api.serializers import ComplaintSerializer, FeedbackSerializer
from api.db_utils import reset_db_sequences

CATEGORY_DEPT_CODE = {
    'POTHOLE': 'PWD',
    'GARBAGE': 'SAN',
    'WATER_LEAKAGE': 'WTR',
    'WATER_SUPPLY': 'WTR',
    'DRAINAGE': 'DRN',
    'ELECTRICITY': 'ELE',
    'STREETLIGHT': 'ELE',
    'TRAFFIC': 'RTO',
    'STRAY_ANIMALS': 'SAN',
    'NOISE': 'SAN',
}

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser, JSONParser])
def complaints(request):
    if request.method == 'GET':
        qs = Complaint.objects.all().order_by('-created_at')

        if request.user.role == 'CITIZEN':
            qs = qs.filter(citizen=request.user)

        # Filters
        status_filter = request.query_params.get('status')
        if status_filter:
            qs = qs.filter(status=status_filter)

        priority_filter = request.query_params.get('priority')
        if priority_filter:
            qs = qs.filter(priority=priority_filter)

        category_filter = request.query_params.get('category')
        if category_filter:
            qs = qs.filter(category=category_filter)

        dept_id = request.query_params.get('departmentId')
        if dept_id:
            qs = qs.filter(department_id=dept_id)

        officer_id = request.query_params.get('assignedOfficerId')
        if officer_id:
            qs = qs.filter(assigned_officer_id=officer_id)

        search = request.query_params.get('search')
        if search:
            search = search.strip()
            num = ''.join(filter(str.isdigit, search))
            q_filter = Q(title__icontains=search) | Q(description__icontains=search) | Q(ward__icontains=search)
            if num:
                q_filter |= Q(id=int(num))
            qs = qs.filter(q_filter)

        return Response(ComplaintSerializer(qs, many=True).data)

    elif request.method == 'POST':
        if request.user.role != 'CITIZEN':
            return Response({'message': 'Only citizens can submit complaints'}, status=status.HTTP_403_FORBIDDEN)

        data = request.data
        title = data.get('title')
        description = data.get('description')
        category = data.get('category', 'OTHER')

        if not title or not description:
            return Response({'message': 'Title and description are required'}, status=status.HTTP_400_BAD_REQUEST)

        # Resolve department
        department = None
        dept_id = data.get('departmentId')
        if dept_id:
            try:
                department = Department.objects.get(pk=dept_id)
            except Department.DoesNotExist:
                pass
        if not department and category in CATEGORY_DEPT_CODE:
            department = Department.objects.filter(code=CATEGORY_DEPT_CODE[category]).first()

        def do_create_complaint():
            complaint_obj = Complaint.objects.create(
                title=title,
                description=description,
                category=category,
                priority=data.get('priority', 'MEDIUM'),
                ward=data.get('ward', request.user.ward or ''),
                landmark=data.get('landmark', ''),
                pincode=data.get('pincode', request.user.pincode or ''),
                latitude=data.get('latitude') if data.get('latitude') not in [None, ''] else None,
                longitude=data.get('longitude') if data.get('longitude') not in [None, ''] else None,
                citizen=request.user,
                department=department,
                status='SUBMITTED'
            )
            ComplaintUpdate.objects.create(
                complaint=complaint_obj,
                from_status=None,
                to_status='SUBMITTED',
                remark='Complaint submitted by citizen.',
                by_user_id=request.user.id,
                by_name=request.user.full_name,
                by_role=request.user.role
            )
            return complaint_obj

        try:
            c = do_create_complaint()
        except Exception:
            reset_db_sequences()
            try:
                c = do_create_complaint()
            except Exception as exc:
                return Response({'message': f'Failed to create complaint: {str(exc)}'}, status=status.HTTP_400_BAD_REQUEST)

        # Handle uploaded attachments
        files = request.FILES.getlist('files')
        for f in files:
            saved_path = default_storage.save(os.path.join('uploads', f.name), f)
            filename = os.path.basename(saved_path)
            Attachment.objects.create(
                complaint=c,
                file_name=filename,
                content_type=getattr(f, 'content_type', 'image/jpeg'),
                size=getattr(f, 'size', 0),
                url=f'/api/files/{filename}'
            )

        return Response(ComplaintSerializer(c).data, status=status.HTTP_201_CREATED)

@api_view(['GET'])
@permission_classes([AllowAny])
def complaint_detail(request, pk):
    try:
        c = Complaint.objects.get(pk=pk)
    except Complaint.DoesNotExist:
        return Response({'message': 'Complaint not found'}, status=status.HTTP_404_NOT_FOUND)

    # If requested by citizen user, ensure proper access or let public track
    return Response(ComplaintSerializer(c).data)

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser, JSONParser])
def update_complaint_status(request, pk):
    if request.user.role not in ['OFFICER', 'ADMIN']:
        return Response({'message': 'Access forbidden'}, status=status.HTTP_403_FORBIDDEN)

    try:
        c = Complaint.objects.get(pk=pk)
    except Complaint.DoesNotExist:
        return Response({'message': 'Complaint not found'}, status=status.HTTP_404_NOT_FOUND)

    to_status = request.data.get('toStatus') or request.data.get('status')
    remark = request.data.get('resolutionNote') or request.data.get('remark') or f'Status updated to {to_status}.'

    if to_status and to_status != c.status:
        from_status = c.status
        c.status = to_status
        if to_status == 'RESOLVED' and not c.resolved_at:
            c.resolved_at = timezone.now()
        c.save()

        ComplaintUpdate.objects.create(
            complaint=c,
            from_status=from_status,
            to_status=to_status,
            remark=remark,
            by_user_id=request.user.id,
            by_name=request.user.full_name,
            by_role=request.user.role
        )

    # Handle resolution file attachments
    files = request.FILES.getlist('files')
    for f in files:
        saved_path = default_storage.save(os.path.join('uploads', f.name), f)
        filename = os.path.basename(saved_path)
        Attachment.objects.create(
            complaint=c,
            file_name=filename,
            content_type=getattr(f, 'content_type', 'image/jpeg'),
            size=getattr(f, 'size', 0),
            url=f'/api/files/{filename}',
            resolution='RESOLUTION'
        )

    return Response(ComplaintSerializer(c).data)

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_complaint_priority(request, pk):
    if request.user.role not in ['OFFICER', 'ADMIN']:
        return Response({'message': 'Access forbidden'}, status=status.HTTP_403_FORBIDDEN)
    try:
        c = Complaint.objects.get(pk=pk)
        new_priority = request.data.get('priority')
        if new_priority:
            c.priority = new_priority
            c.save()
        return Response(ComplaintSerializer(c).data)
    except Complaint.DoesNotExist:
        return Response({'message': 'Complaint not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def assign_complaint(request, pk):
    if request.user.role != 'ADMIN':
        return Response({'message': 'Access forbidden'}, status=status.HTTP_403_FORBIDDEN)
    try:
        c = Complaint.objects.get(pk=pk)
    except Complaint.DoesNotExist:
        return Response({'message': 'Complaint not found'}, status=status.HTTP_404_NOT_FOUND)

    officer_id = request.data.get('officerId')
    try:
        officer = User.objects.get(pk=officer_id, role='OFFICER', is_active=True)
    except User.DoesNotExist:
        return Response({'message': 'Selected officer does not exist'}, status=status.HTTP_400_BAD_REQUEST)

    c.assigned_officer = officer
    if officer.department:
        c.department = officer.department
    from_status = c.status
    if c.status in ['SUBMITTED', 'UNDER_REVIEW']:
        c.status = 'ASSIGNED'
    c.save()

    remark = request.data.get('remark') or f'Complaint assigned to {officer.full_name}.'
    ComplaintUpdate.objects.create(
        complaint=c,
        from_status=from_status,
        to_status=c.status,
        remark=remark,
        by_user_id=request.user.id,
        by_name=request.user.full_name,
        by_role=request.user.role
    )

    return Response(ComplaintSerializer(c).data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def submit_feedback(request, pk):
    if request.user.role != 'CITIZEN':
        return Response({'message': 'Only citizens can submit feedback'}, status=status.HTTP_403_FORBIDDEN)
    try:
        c = Complaint.objects.get(pk=pk, citizen=request.user)
    except Complaint.DoesNotExist:
        return Response({'message': 'You can only rate your own complaints'}, status=status.HTTP_403_FORBIDDEN)

    rating = request.data.get('rating')
    if not rating:
        return Response({'message': 'Rating is required'}, status=status.HTTP_400_BAD_REQUEST)

    feedback, _ = Feedback.objects.update_or_create(
        complaint=c,
        defaults={
            'citizen': request.user,
            'citizen_name': request.user.full_name,
            'rating': int(rating),
            'comment': request.data.get('comment', '')
        }
    )
    return Response(FeedbackSerializer(feedback).data)
