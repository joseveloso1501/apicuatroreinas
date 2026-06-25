from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.core.mail import send_mail
from django.conf import settings
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

class ContactoView(APIView):
    def post(self, request):
        name = request.data.get('name')
        email = request.data.get('email')
        message = request.data.get('message')
        
        if not name or not email or not message:
            return Response(
                {"error": "Todos los campos (nombre, correo y mensaje) son requeridos."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        subject = f"Nuevo mensaje desde ApiStore de {name}"
        body = f"Nombre: {name}\nCorreo de contacto: {email}\n\nMensaje:\n{message}"
        
        try:
            send_mail(
                subject,
                body,
                settings.DEFAULT_FROM_EMAIL or 'no-reply@apicuatroreinas.cl',
                ['joseveloso2101@gmail.com'],
                fail_silently=False,
            )
            return Response({"success": "¡Mensaje enviado con éxito!"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {"error": f"Error al enviar el correo: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

