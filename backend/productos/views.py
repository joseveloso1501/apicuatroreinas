from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.core.mail import send_mail
from django.conf import settings
from .models import Producto, Categoria, Galeria
from .serializers import ProductoSerializer, CategoriaSerializer, GaleriaSerializer

from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from .models import Cupon, PerfilUsuario, Pedido, CarritoItem
from .serializers import UserSerializer, CuponSerializer, PedidoSerializer, CarritoItemSerializer
from rest_framework.decorators import action

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
                [getattr(settings, 'CONTACT_RECIPIENT_EMAIL', 'apicuatroreinas@gmail.com')],
                fail_silently=False,
            )
            return Response({"success": "¡Mensaje enviado con éxito!"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {"error": f"Error al enviar el correo: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class RegisterView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        first_name = request.data.get('first_name', '')
        last_name = request.data.get('last_name', '')
        
        # Profile fields
        rut = request.data.get('rut', '')
        telefono = request.data.get('telefono', '')
        direccion = request.data.get('direccion', '')
        ciudad = request.data.get('ciudad', '')

        if not email or not password:
            return Response(
                {"error": "El correo electrónico y la contraseña son requeridos."}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        if User.objects.filter(email=email).exists():
            return Response(
                {"error": "Ya existe una cuenta con este correo electrónico."}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        user = None
        try:
            # Create user
            user = User.objects.create(
                username=email,
                email=email,
                first_name=first_name,
                last_name=last_name
            )
            user.set_password(password)
            user.save()

            # Create profile
            perfil = PerfilUsuario(
                user=user,
                rut=rut or None,
                telefono=telefono,
                direccion=direccion,
                ciudad=ciudad
            )
            perfil.full_clean()
            perfil.save()

            # Generate token
            token, _ = Token.objects.get_or_create(user=user)
            
            serializer = UserSerializer(user)
            return Response({
                "token": token.key,
                "user": serializer.data
            }, status=status.HTTP_201_CREATED)
            
        except ValidationError as e:
            if user:
                user.delete()
            # Formatear el error para que sea amigable en el frontend
            error_msg = e.message_dict if hasattr(e, 'message_dict') else str(e)
            if isinstance(error_msg, dict) and 'rut' in error_msg:
                error_msg = error_msg['rut'][0]
            elif isinstance(error_msg, list):
                error_msg = error_msg[0]
            return Response({"error": error_msg}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            if user:
                user.delete()
            return Response({"error": f"Error al registrar usuario: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class LoginView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        if not email or not password:
            return Response(
                {"error": "El correo electrónico y la contraseña son requeridos."}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        user = authenticate(username=email, password=password)
        if not user:
            return Response(
                {"error": "Credenciales inválidas. Por favor intenta de nuevo."}, 
                status=status.HTTP_401_UNAUTHORIZED
            )

        token, _ = Token.objects.get_or_create(user=user)
        serializer = UserSerializer(user)
        return Response({
            "token": token.key,
            "user": serializer.data
        }, status=status.HTTP_200_OK)

class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    def put(self, request):
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            try:
                serializer.save()
                return Response(serializer.data)
            except ValidationError as e:
                error_msg = e.message_dict if hasattr(e, 'message_dict') else str(e)
                if isinstance(error_msg, dict) and 'rut' in error_msg:
                    error_msg = error_msg['rut'][0]
                return Response({"error": error_msg}, status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')

        if not old_password or not new_password:
            return Response(
                {"error": "Ambas contraseñas son requeridas."}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        if not request.user.check_password(old_password):
            return Response(
                {"error": "La contraseña actual es incorrecta."}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        request.user.set_password(new_password)
        request.user.save()
        return Response({"success": "Contraseña actualizada correctamente."}, status=status.HTTP_200_OK)

class DeleteAccountView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        user = request.user
        user.delete()
        return Response({"success": "Cuenta eliminada correctamente."}, status=status.HTTP_200_OK)

class CuponViewSet(viewsets.ModelViewSet):
    queryset = Cupon.objects.all()
    serializer_class = CuponSerializer

    def get_permissions(self):
        if self.action in ['validar']:
            return []
        return [IsAuthenticated()]

    def list(self, request):
        perfil, _ = PerfilUsuario.objects.get_or_create(user=request.user)
        # Excluir cupones que el usuario ya usó en compras anteriores
        used_cupon_ids = Pedido.objects.filter(user=request.user, cupon__isnull=False).values_list('cupon_id', flat=True)
        if request.user.email:
            used_by_email = Pedido.objects.filter(email=request.user.email, cupon__isnull=False).values_list('cupon_id', flat=True)
            used_cupon_ids = list(set(list(used_cupon_ids) + list(used_by_email)))
        
        cupones = perfil.cupones.filter(activo=True).exclude(id__in=used_cupon_ids)
        serializer = self.get_serializer(cupones, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def agregar(self, request):
        codigo = request.data.get('codigo', '').strip().upper()
        if not codigo:
            return Response({"error": "Debe proveer un código de cupón."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            cupon = Cupon.objects.get(codigo=codigo, activo=True)
        except Cupon.DoesNotExist:
            return Response({"error": "El cupón no existe o no está activo."}, status=status.HTTP_404_NOT_FOUND)

        perfil, _ = PerfilUsuario.objects.get_or_create(user=request.user)
        if perfil.cupones.filter(id=cupon.id).exists():
            return Response({"error": "Ya tienes este cupón guardado en tu perfil."}, status=status.HTTP_400_BAD_REQUEST)

        perfil.cupones.add(cupon)
        return Response({
            "success": "Cupón agregado correctamente a tu perfil.",
            "cupon": self.get_serializer(cupon).data
        }, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'], permission_classes=[])
    def validar(self, request):
        codigo = request.data.get('codigo', '').strip().upper()
        email = request.data.get('email', '').strip()
        if not codigo:
            return Response({"error": "Debe ingresar un código."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            cupon = Cupon.objects.get(codigo=codigo, activo=True)
        except Cupon.DoesNotExist:
            return Response({"error": "Cupón no válido o expirado."}, status=status.HTTP_404_NOT_FOUND)

        # Control: Un solo uso por usuario
        if request.user and request.user.is_authenticated:
            if Pedido.objects.filter(user=request.user, cupon=cupon).exists():
                return Response({"error": f"Ya has utilizado el cupón '{codigo}' en una compra anterior."}, status=status.HTTP_400_BAD_REQUEST)
            if request.user.email and Pedido.objects.filter(email=request.user.email, cupon=cupon).exists():
                return Response({"error": f"Ya has utilizado el cupón '{codigo}' en una compra anterior."}, status=status.HTTP_400_BAD_REQUEST)

        # Control: Un solo uso por email (para invitados o usuarios)
        if email:
            if Pedido.objects.filter(email=email, cupon=cupon).exists():
                return Response({"error": f"El cupón '{codigo}' ya ha sido utilizado previamente."}, status=status.HTTP_400_BAD_REQUEST)

        return Response(self.get_serializer(cupon).data, status=status.HTTP_200_OK)

class PedidoViewSet(viewsets.ModelViewSet):
    queryset = Pedido.objects.all()
    serializer_class = PedidoSerializer

    def get_queryset(self):
        if self.request.user.is_authenticated:
            from django.db.models import Q
            return Pedido.objects.filter(
                Q(user=self.request.user) | Q(email=self.request.user.email)
            ).order_by('-created_at')
        return Pedido.objects.none()

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

class CarritoView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        items = CarritoItem.objects.filter(user=request.user)
        serializer = CarritoItemSerializer(items, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request):
        items_data = request.data.get('items', [])
        
        # Eliminar items actuales
        CarritoItem.objects.filter(user=request.user).delete()
        
        created_items = []
        for item in items_data:
            prod_id = item.get('id')
            cantidad = item.get('cantidad', 1)
            try:
                producto = Producto.objects.get(id=prod_id)
                cart_item = CarritoItem.objects.create(
                    user=request.user,
                    producto=producto,
                    cantidad=max(1, int(cantidad))
                )
                created_items.append(cart_item)
            except Producto.DoesNotExist:
                continue
                
        serializer = CarritoItemSerializer(created_items, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

class CarritoMergeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        items_data = request.data.get('items', [])
        
        for item in items_data:
            prod_id = item.get('id')
            cantidad = item.get('cantidad', 1)
            try:
                producto = Producto.objects.get(id=prod_id)
                cart_item, created = CarritoItem.objects.get_or_create(
                    user=request.user,
                    producto=producto,
                    defaults={'cantidad': cantidad}
                )
                if not created:
                    cart_item.cantidad += cantidad
                    cart_item.save()
            except Producto.DoesNotExist:
                continue
                
        # Retornar el carrito final combinado
        items = CarritoItem.objects.filter(user=request.user)
        serializer = CarritoItemSerializer(items, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)


from .models import InstagramPerfil
from .serializers import InstagramPerfilSerializer

class InstagramPerfilViewSet(viewsets.ModelViewSet):
    queryset = InstagramPerfil.objects.all()
    serializer_class = InstagramPerfilSerializer

