from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('productos.urls')),
    path('', lambda request: HttpResponse("Bienvenido a la API de Apicultura")),
]
