from rest_framework import serializers
from .models import User, Department, Complaint, Attachment, ComplaintUpdate, Feedback

CATEGORY_LABELS = {
    'POTHOLE': 'Pothole / Road Damage',
    'GARBAGE': 'Garbage Accumulation',
    'WATER_LEAKAGE': 'Water Pipeline Leakage',
    'WATER_SUPPLY': 'No / Low Water Supply',
    'DRAINAGE': 'Drainage / Sewage Overflow',
    'ELECTRICITY': 'Frequent Power Outage',
    'STREETLIGHT': 'Streetlight Malfunction',
    'TRAFFIC': 'Traffic Signal Failure',
    'STRAY_ANIMALS': 'Stray Animal Menace',
    'NOISE': 'Noise Pollution',
    'OTHER': 'Other Civic Issue',
}

class UserSerializer(serializers.ModelSerializer):
    fullName = serializers.CharField(source='full_name', read_only=True)
    departmentName = serializers.SerializerMethodField()
    departmentId = serializers.IntegerField(source='department_id', read_only=True, allow_null=True)
    createdAt = serializers.DateTimeField(source='date_joined', read_only=True)

    class Meta:
        model = User
        fields = [
            'id', 'role', 'full_name', 'fullName', 'email', 'phone',
            'ward', 'address', 'pincode', 'designation',
            'departmentId', 'departmentName', 'active', 'createdAt'
        ]

    def get_departmentName(self, obj):
        return obj.department.name if obj.department else None

class DepartmentSerializer(serializers.ModelSerializer):
    createdAt = serializers.DateTimeField(source='created_at', read_only=True)
    
    class Meta:
        model = Department
        fields = ['id', 'name', 'code', 'head', 'email', 'phone', 'active', 'createdAt']

class AttachmentSerializer(serializers.ModelSerializer):
    fileName = serializers.CharField(source='file_name', read_only=True)
    contentType = serializers.CharField(source='content_type', read_only=True)
    createdAt = serializers.DateTimeField(source='created_at', read_only=True)

    class Meta:
        model = Attachment
        fields = ['id', 'fileName', 'contentType', 'size', 'url', 'resolution', 'createdAt']

class ComplaintUpdateSerializer(serializers.ModelSerializer):
    fromStatus = serializers.CharField(source='from_status', read_only=True)
    toStatus = serializers.CharField(source='to_status', read_only=True)
    byName = serializers.CharField(source='by_name', read_only=True)
    byRole = serializers.CharField(source='by_role', read_only=True)
    createdAt = serializers.DateTimeField(source='created_at', read_only=True)

    class Meta:
        model = ComplaintUpdate
        fields = ['id', 'fromStatus', 'toStatus', 'remark', 'byName', 'byRole', 'createdAt']

class FeedbackSerializer(serializers.ModelSerializer):
    citizenName = serializers.CharField(source='citizen_name', read_only=True)
    createdAt = serializers.DateTimeField(source='created_at', read_only=True)
    updatedAt = serializers.DateTimeField(source='updated_at', read_only=True)

    class Meta:
        model = Feedback
        fields = ['id', 'rating', 'comment', 'citizenName', 'createdAt', 'updatedAt']

class ComplaintSerializer(serializers.ModelSerializer):
    categoryLabel = serializers.SerializerMethodField()
    departmentId = serializers.IntegerField(source='department_id', read_only=True, allow_null=True)
    departmentName = serializers.SerializerMethodField()
    wardName = serializers.CharField(source='ward', read_only=True)
    citizenId = serializers.IntegerField(source='citizen_id', read_only=True)
    citizenName = serializers.SerializerMethodField()
    assignedOfficerId = serializers.IntegerField(source='assigned_officer_id', read_only=True, allow_null=True)
    assignedOfficerName = serializers.SerializerMethodField()
    createdAt = serializers.DateTimeField(source='created_at', read_only=True)
    updatedAt = serializers.DateTimeField(source='updated_at', read_only=True)
    resolvedAt = serializers.DateTimeField(source='resolved_at', read_only=True)
    
    attachments = AttachmentSerializer(many=True, read_only=True)
    timeline = ComplaintUpdateSerializer(many=True, read_only=True)
    feedback = FeedbackSerializer(read_only=True)

    class Meta:
        model = Complaint
        fields = [
            'id', 'title', 'description', 'category', 'categoryLabel',
            'status', 'priority', 'departmentId', 'departmentName',
            'wardName', 'landmark', 'pincode', 'latitude', 'longitude',
            'citizenId', 'citizenName', 'assignedOfficerId', 'assignedOfficerName',
            'createdAt', 'updatedAt', 'resolvedAt', 'attachments', 'timeline', 'feedback'
        ]

    def get_categoryLabel(self, obj):
        return CATEGORY_LABELS.get(obj.category, obj.category.replace('_', ' ').title() if obj.category else '')

    def get_departmentName(self, obj):
        return obj.department.name if obj.department else None

    def get_citizenName(self, obj):
        return obj.citizen.full_name if obj.citizen else None

    def get_assignedOfficerName(self, obj):
        return obj.assigned_officer.full_name if obj.assigned_officer else None
