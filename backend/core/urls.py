from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.views.static import serve
from django.http import JsonResponse

def root_view(request):
    return JsonResponse({
        "project": "CiviGo Smart Civic Issue Resolution API",
        "status": "online",
        "version": "1.0.0",
        "endpoints": {
            "admin": "/admin/",
            "api": "/api/",
        }
    })

urlpatterns = [
    path('', root_view, name='root'),
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    re_path(r'^api/files/(?P<path>.*)$', serve, {'document_root': settings.MEDIA_ROOT}),
]
