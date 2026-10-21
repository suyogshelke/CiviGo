from django.urls import path
from . import views

urlpatterns = [
    path('auth/login', views.login),
    path('auth/register', views.register),
    path('auth/me', views.get_me),
    
    path('departments', views.departments),
    path('departments/<int:pk>', views.update_department),
    
    path('users/me', views.update_me),
    path('users/me/password', views.update_password),
    path('users', views.users_list),
    path('users/<int:pk>/active', views.toggle_user_active),
    path('users/officers', views.create_officer),
    path('users/officers/<int:pk>', views.update_officer),
    
    path('complaints', views.complaints),
    path('complaints/<int:pk>', views.complaint_detail),
    path('complaints/<int:pk>/status', views.update_complaint_status),
    path('complaints/<int:pk>/priority', views.update_complaint_priority),
    path('complaints/<int:pk>/assign', views.assign_complaint),
    path('complaints/<int:pk>/feedback', views.submit_feedback),
    
    path('analytics/overview', views.analytics_overview),
    path('analytics/officer', views.analytics_officer),
    path('analytics/citizen', views.analytics_citizen),
]
