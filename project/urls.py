
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from . import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('user.urls')),
    path('main.html', views.renderMain),
    path('login.html', views.renderLogin),
    path('', views.renderLogin),
]


urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
