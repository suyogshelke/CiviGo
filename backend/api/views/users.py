from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from api.models import User, Department
from api.serializers import UserSerializer

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_me(request):
    user = request.user
    user.full_name = request.data.get('fullName', user.full_name)
    user.phone = request.data.get('phone', user.phone)
    user.ward = request.data.get('ward', user.ward)
    user.address = request.data.get('address', user.address)
    user.pincode = request.data.get('pincode', user.pincode)
    user.save()
    return Response(UserSerializer(user).data)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_password(request):
    user = request.user
    current_password = request.data.get('currentPassword')
    new_password = request.data.get('newPassword')
    if not current_password or not new_password:
        return Response({'message': 'Current and new password are required'}, status=status.HTTP_400_BAD_REQUEST)
    if not user.check_password(current_password):
        return Response({'message': 'Your current password is incorrect'}, status=status.HTTP_400_BAD_REQUEST)
    user.set_password(new_password)
    user.save()
    return Response({'success': True})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def users_list(request):
    if request.user.role != 'ADMIN':
        return Response({'message': 'Access forbidden'}, status=status.HTTP_403_FORBIDDEN)
    users = User.objects.all().order_by('full_name')
    role = request.query_params.get('role')
    if role:
        users = users.filter(role=role)
    return Response(UserSerializer(users, many=True).data)

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def toggle_user_active(request, pk):
    if request.user.role != 'ADMIN':
        return Response({'message': 'Access forbidden'}, status=status.HTTP_403_FORBIDDEN)
    try:
        user = User.objects.get(pk=pk)
        if user.role == 'ADMIN':
            return Response({'message': 'The administrator account cannot be deactivated'}, status=status.HTTP_400_BAD_REQUEST)
        user.is_active = not user.is_active
        user.save()
        return Response(UserSerializer(user).data)
    except User.DoesNotExist:
        return Response({'message': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_officer(request):
    if request.user.role != 'ADMIN':
        return Response({'message': 'Access forbidden'}, status=status.HTTP_403_FORBIDDEN)
    data = request.data
    email = data.get('email')
    full_name = data.get('fullName') or data.get('full_name')
    if not email or not full_name:
        return Response({'message': 'Full name and email are required'}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(email__iexact=email).exists():
        return Response({'message': 'A user with this email already exists'}, status=status.HTTP_409_CONFLICT)

    department = None
    dept_id = data.get('departmentId')
    if dept_id:
        try:
            department = Department.objects.get(pk=dept_id)
        except Department.DoesNotExist:
            pass

    user = User.objects.create_user(
        email=email,
        password=data.get('password', 'Officer@123'),
        full_name=full_name,
        phone=data.get('phone', ''),
        department=department,
        designation=data.get('designation', ''),
        role='OFFICER'
    )
    return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_officer(request, pk):
    if request.user.role != 'ADMIN':
        return Response({'message': 'Access forbidden'}, status=status.HTTP_403_FORBIDDEN)
    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return Response({'message': 'Officer not found'}, status=status.HTTP_404_NOT_FOUND)

    data = request.data
    user.full_name = data.get('fullName', user.full_name)
    user.email = data.get('email', user.email)
    user.phone = data.get('phone', user.phone)
    user.designation = data.get('designation', user.designation)
    if 'departmentId' in data:
        dept_id = data.get('departmentId')
        try:
            user.department = Department.objects.get(pk=dept_id) if dept_id else None
        except Department.DoesNotExist:
            user.department = None
    if data.get('password'):
        user.set_password(data.get('password'))
    user.save()
    return Response(UserSerializer(user).data)
