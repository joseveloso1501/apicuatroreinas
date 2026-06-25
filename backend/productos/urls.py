from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import ProductoViewSet, CategoriaViewSet, GaleriaViewSet, ContactoView

router = DefaultRouter()
router.register(r'categorias', CategoriaViewSet)
router.register(r'productos', ProductoViewSet)
router.register(r'galeria', GaleriaViewSet) # Nueva ruta

urlpatterns = [
    path('contacto/', ContactoView.as_view(), name='contacto'),
] + router.urls

