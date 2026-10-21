from .auth import login, register, get_me
from .departments import departments, update_department
from .users import (
    update_me,
    update_password,
    users_list,
    toggle_user_active,
    create_officer,
    update_officer,
)
from .complaints import (
    complaints,
    complaint_detail,
    update_complaint_status,
    update_complaint_priority,
    assign_complaint,
    submit_feedback,
)
from .analytics import (
    analytics_overview,
    analytics_officer,
    analytics_citizen,
)

__all__ = [
    'login',
    'register',
    'get_me',
    'departments',
    'update_department',
    'update_me',
    'update_password',
    'users_list',
    'toggle_user_active',
    'create_officer',
    'update_officer',
    'complaints',
    'complaint_detail',
    'update_complaint_status',
    'update_complaint_priority',
    'assign_complaint',
    'submit_feedback',
    'analytics_overview',
    'analytics_officer',
    'analytics_citizen',
]
