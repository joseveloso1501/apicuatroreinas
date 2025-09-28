from rest_framework.routers import DefaultRouter
from .views import ProductoViewSet, CategoriaViewSet

router = DefaultRouter()
router.register(r'categorias', CategoriaViewSet)
router.register(r'productos', ProductoViewSet)

urlpatterns = router.urls
