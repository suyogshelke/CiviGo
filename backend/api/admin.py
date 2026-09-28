from django.contrib import admin
from .models import User, Department, Complaint, ComplaintUpdate, Feedback, Attachment

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('email', 'full_name', 'role', 'department', 'ward', 'phone', 'is_active')
    list_filter = ('role', 'is_active', 'department')
    search_fields = ('email', 'full_name', 'phone', 'ward')
    ordering = ('-id',)

@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ('name', 'code', 'head', 'email', 'phone', 'active', 'created_at')
    list_filter = ('active',)
    search_fields = ('name', 'code', 'head')
    ordering = ('id',)

class AttachmentInline(admin.TabularInline):
    model = Attachment
    extra = 0

class ComplaintUpdateInline(admin.TabularInline):
    model = ComplaintUpdate
    extra = 0
    readonly_fields = ('created_at',)

@admin.register(Complaint)
class ComplaintAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'category', 'status', 'priority', 'department', 'citizen', 'assigned_officer', 'created_at')
    list_filter = ('status', 'priority', 'department', 'created_at')
    search_fields = ('title', 'description', 'citizen__email', 'citizen__full_name', 'landmark', 'ward')
    ordering = ('-created_at',)
    inlines = [ComplaintUpdateInline, AttachmentInline]

@admin.register(ComplaintUpdate)
class ComplaintUpdateAdmin(admin.ModelAdmin):
    list_display = ('complaint', 'from_status', 'to_status', 'by_name', 'by_role', 'created_at')
    list_filter = ('to_status', 'by_role', 'created_at')
    search_fields = ('complaint__title', 'by_name', 'remark')

@admin.register(Feedback)
class FeedbackAdmin(admin.ModelAdmin):
    list_display = ('complaint', 'citizen_name', 'rating', 'comment', 'created_at')
    list_filter = ('rating', 'created_at')
    search_fields = ('citizen_name', 'comment', 'complaint__title')

@admin.register(Attachment)
class AttachmentAdmin(admin.ModelAdmin):
    list_display = ('complaint', 'file_name', 'content_type', 'size', 'created_at')
    search_fields = ('file_name', 'complaint__title')
