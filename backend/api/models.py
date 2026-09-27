from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.utils import timezone

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', 'ADMIN')
        return self.create_user(email, password, **extra_fields)

class Department(models.Model):
    name = models.CharField(max_length=255)
    code = models.CharField(max_length=50, unique=True)
    head = models.CharField(max_length=255, null=True, blank=True)
    email = models.EmailField(null=True, blank=True)
    phone = models.CharField(max_length=20, null=True, blank=True)
    active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class User(AbstractUser):
    ROLE_CHOICES = (
        ('CITIZEN', 'Citizen'),
        ('OFFICER', 'Officer'),
        ('ADMIN', 'Admin'),
    )
    username = None # Remove username field
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='CITIZEN')
    full_name = models.CharField(max_length=255)
    phone = models.CharField(max_length=20, null=True, blank=True)
    ward = models.CharField(max_length=255, null=True, blank=True)
    address = models.TextField(null=True, blank=True)
    pincode = models.CharField(max_length=20, null=True, blank=True)
    
    # Officer fields
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, blank=True)
    designation = models.CharField(max_length=255, null=True, blank=True)
    
    # Use 'active' as a property or alias for is_active if needed, but we will stick to is_active
    # The node backend used 'active'. Let's override is_active to be the main active field.
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['full_name']

    objects = UserManager()

    def __str__(self):
        return self.email

    @property
    def active(self):
        return self.is_active

    @active.setter
    def active(self, value):
        self.is_active = value

class Complaint(models.Model):
    STATUS_CHOICES = (
        ('SUBMITTED', 'Submitted'),
        ('UNDER_REVIEW', 'Under Review'),
        ('ASSIGNED', 'Assigned'),
        ('IN_PROGRESS', 'In Progress'),
        ('RESOLVED', 'Resolved'),
        ('CLOSED', 'Closed'),
        ('REJECTED', 'Rejected'),
    )
    PRIORITY_CHOICES = (
        ('LOW', 'Low'),
        ('MEDIUM', 'Medium'),
        ('HIGH', 'High'),
        ('CRITICAL', 'Critical'),
    )
    title = models.CharField(max_length=255)
    description = models.TextField()
    category = models.CharField(max_length=100)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='SUBMITTED')
    priority = models.CharField(max_length=50, choices=PRIORITY_CHOICES, default='MEDIUM')
    
    ward = models.CharField(max_length=255, null=True, blank=True)
    landmark = models.CharField(max_length=255, null=True, blank=True)
    pincode = models.CharField(max_length=20, null=True, blank=True)
    latitude = models.DecimalField(max_digits=10, decimal_places=8, null=True, blank=True)
    longitude = models.DecimalField(max_digits=11, decimal_places=8, null=True, blank=True)
    
    citizen = models.ForeignKey(User, on_delete=models.CASCADE, related_name='complaints')
    assigned_officer = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_complaints')
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    resolved_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.title

class Attachment(models.Model):
    complaint = models.ForeignKey(Complaint, on_delete=models.CASCADE, related_name='attachments')
    file_name = models.CharField(max_length=255)
    content_type = models.CharField(max_length=100, null=True, blank=True)
    size = models.IntegerField(null=True, blank=True)
    url = models.CharField(max_length=1000)
    resolution = models.CharField(max_length=255, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

class ComplaintUpdate(models.Model):
    complaint = models.ForeignKey(Complaint, on_delete=models.CASCADE, related_name='timeline')
    from_status = models.CharField(max_length=50, null=True, blank=True)
    to_status = models.CharField(max_length=50)
    remark = models.TextField(null=True, blank=True)
    by_user_id = models.IntegerField(null=True, blank=True)
    by_name = models.CharField(max_length=255)
    by_role = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)

class Feedback(models.Model):
    complaint = models.OneToOneField(Complaint, on_delete=models.CASCADE, related_name='feedback')
    citizen = models.ForeignKey(User, on_delete=models.CASCADE)
    citizen_name = models.CharField(max_length=255)
    rating = models.IntegerField()
    comment = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
