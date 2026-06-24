from rest_framework import viewsets
from .models import Producto, Categoria, Galeria
from .serializers import ProductoSerializer, CategoriaSerializer, GaleriaSerializer

class CategoriaViewSet(viewsets.ModelViewSet):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer

class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer

class GaleriaViewSet(viewsets.ModelViewSet):
    queryset = Galeria.objects.all()
    serializer_class = GaleriaSerializer
