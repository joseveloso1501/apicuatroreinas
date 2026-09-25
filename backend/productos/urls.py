from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import (
    ProductoViewSet, CategoriaViewSet, GaleriaViewSet, ContactoView,
    RegisterView, LoginView, ProfileView, ChangePasswordView, DeleteAccountView, ExportUserDataView,
    CuponViewSet, PedidoViewSet, CarritoView, CarritoMergeView, InstagramPerfilViewSet
)

router = DefaultRouter()
router.register(r'categorias', CategoriaViewSet)
router.register(r'productos', ProductoViewSet)
router.register(r'galeria', GaleriaViewSet) # Nueva ruta
router.register(r'cupones', CuponViewSet)
router.register(r'pedidos', PedidoViewSet)
router.register(r'instagram-perfil', InstagramPerfilViewSet)

urlpatterns = [
    path('contacto/', ContactoView.as_view(), name='contacto'),
    path('auth/register/', RegisterView.as_view(), name='auth_register'),
    path('auth/login/', LoginView.as_view(), name='auth_login'),
    path('auth/profile/', ProfileView.as_view(), name='auth_profile'),
    path('auth/change-password/', ChangePasswordView.as_view(), name='auth_change_password'),
    path('auth/delete-account/', DeleteAccountView.as_view(), name='auth_delete_account'),
    path('auth/export-data/', ExportUserDataView.as_view(), name='auth_export_data'),
    path('carrito/', CarritoView.as_view(), name='carrito'),
    path('carrito/merge/', CarritoMergeView.as_view(), name='carrito_merge'),
] + router.urls


