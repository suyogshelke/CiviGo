from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from ..models import User
from ..serializers import UserSerializer

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    refresh.payload['role'] = user.role
    return str(refresh.access_token)

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    email = request.data.get('email')
    password = request.data.get('password')
    if not email or not password:
        return Response({'message': 'Email and password are required'}, status=status.HTTP_400_BAD_REQUEST)
    try:
        user = User.objects.get(email__iexact=email)
        if not user.is_active or not user.check_password(password):
            return Response({'message': 'Invalid email or password'}, status=status.HTTP_401_UNAUTHORIZED)
        token = get_tokens_for_user(user)
        return Response({'token': token, 'user': UserSerializer(user).data})
    except User.DoesNotExist:
        return Response({'message': 'Invalid email or password'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    data = request.data
    full_name = data.get('fullName') or data.get('full_name')
    email = data.get('email')
    password = data.get('password')

    if not full_name or not email or not password:
        return Response({'message': 'Name, email and password are required'}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(email__iexact=email).exists():
        return Response({'message': 'A record with that value already exists'}, status=status.HTTP_409_CONFLICT)

    user = User.objects.create_user(
        email=email,
        password=password,
        full_name=full_name,
        phone=data.get('phone', ''),
        ward=data.get('ward', ''),
        address=data.get('address', ''),
        pincode=data.get('pincode', ''),
        role='CITIZEN'
    )
    token = get_tokens_for_user(user)
    return Response({'token': token, 'user': UserSerializer(user).data}, status=status.HTTP_201_CREATED)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_me(request):
    return Response(UserSerializer(request.user).data)
