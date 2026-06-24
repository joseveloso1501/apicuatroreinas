from rest_framework.routers import DefaultRouter
from .views import ProductoViewSet, CategoriaViewSet, GaleriaViewSet

router = DefaultRouter()
router.register(r'categorias', CategoriaViewSet)
router.register(r'productos', ProductoViewSet)
router.register(r'galeria', GaleriaViewSet) # Nueva ruta

urlpatterns = router.urls
