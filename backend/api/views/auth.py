import logging
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from api.models import User
from api.serializers import UserSerializer
from api.db_utils import reset_db_sequences

logger = logging.getLogger(__name__)

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    refresh['role'] = user.role
    refresh['sub'] = str(user.id)
    access = refresh.access_token
    access['role'] = user.role
    access['sub'] = str(user.id)
    return str(access)

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    email = request.data.get('email', '').strip()
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
    email = data.get('email', '').strip()
    password = data.get('password')

    if not full_name or not email or not password:
        return Response({'message': 'Name, email and password are required'}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(email__iexact=email).exists():
        return Response({'message': 'An account with this email address already exists. Please sign in.'}, status=status.HTTP_409_CONFLICT)

    def do_create():
        return User.objects.create_user(
            email=email,
            password=password,
            full_name=full_name,
            phone=data.get('phone', ''),
            ward=data.get('ward', ''),
            address=data.get('address', ''),
            pincode=data.get('pincode', ''),
            role='CITIZEN'
        )

    try:
        user = do_create()
    except Exception as exc:
        logger.warning(f"Initial user registration creation failed: {exc}. Resyncing DB sequences...")
        reset_db_sequences()
        try:
            user = do_create()
        except Exception as retry_exc:
            logger.error(f"User registration error after resync: {retry_exc}")
            err_msg = str(retry_exc)
            if 'duplicate key' in err_msg.lower() or 'unique' in err_msg.lower():
                return Response({'message': 'An account with this email already exists.'}, status=status.HTTP_409_CONFLICT)
            return Response({'message': f'Registration failed: {err_msg}'}, status=status.HTTP_400_BAD_REQUEST)

    token = get_tokens_for_user(user)
    return Response({'token': token, 'user': UserSerializer(user).data}, status=status.HTTP_201_CREATED)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_me(request):
    return Response(UserSerializer(request.user).data)
