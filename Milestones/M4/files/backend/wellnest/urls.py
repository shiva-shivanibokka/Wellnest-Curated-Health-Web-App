from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("core.urls")),  # For API endpoints
    path("", include("core.urls")),      # For HTML pages like /progress/, /signup/
]
