from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from api.models import Department
from api.serializers import DepartmentSerializer

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def departments(request):
    if request.method == 'GET':
        deps = Department.objects.all().order_by('name')
        return Response(DepartmentSerializer(deps, many=True).data)

    elif request.method == 'POST':
        if request.user.role != 'ADMIN':
            return Response({'message': 'You do not have permission to perform this action'}, status=status.HTTP_403_FORBIDDEN)
        serializer = DepartmentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_department(request, pk):
    if request.user.role != 'ADMIN':
        return Response({'message': 'You do not have permission to perform this action'}, status=status.HTTP_403_FORBIDDEN)
    try:
        dep = Department.objects.get(pk=pk)
    except Department.DoesNotExist:
        return Response({'message': 'Department not found'}, status=status.HTTP_404_NOT_FOUND)

    serializer = DepartmentSerializer(dep, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
