from rest_framework import serializers
from .models import Producto, Categoria, Galeria

from django.contrib.auth.models import User
from .models import Cupon, PerfilUsuario, Pedido, ItemPedido, CarritoItem

class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = '__all__'

class ProductoSerializer(serializers.ModelSerializer):
    categoria = CategoriaSerializer(read_only=True)
    categoria_id = serializers.PrimaryKeyRelatedField(
        queryset=Categoria.objects.all(),
        write_only=True,
        source='categoria'
    )
    imagen = serializers.ImageField(required=False, allow_null=True)
    
    class Meta:
        model = Producto
        fields = ['id', 'nombre', 'descripcion', 'precio', 'stock', 'imagen', 'categoria', 'categoria_id', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

class GaleriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Galeria
        fields = '__all__'

class CuponSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cupon
        fields = ['id', 'codigo', 'descuento_porcentaje', 'descuento_valor', 'activo']

class PerfilUsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = PerfilUsuario
        fields = ['rut', 'telefono', 'direccion', 'ciudad']

class UserSerializer(serializers.ModelSerializer):
    perfil = PerfilUsuarioSerializer(required=False)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'perfil']
        read_only_fields = ['id', 'username', 'email']

    def update(self, instance, validated_data):
        perfil_data = validated_data.pop('perfil', {})
        
        # Actualizar campos del User
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.save()
        
        # Actualizar campos del Perfil
        perfil = getattr(instance, 'perfil', None)
        if not perfil:
            perfil = PerfilUsuario.objects.create(user=instance)
        
        perfil.rut = perfil_data.get('rut', perfil.rut)
        perfil.telefono = perfil_data.get('telefono', perfil.telefono)
        perfil.direccion = perfil_data.get('direccion', perfil.direccion)
        perfil.ciudad = perfil_data.get('ciudad', perfil.ciudad)
        perfil.save()
        
        return instance

class ItemPedidoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemPedido
        fields = ['id', 'producto', 'nombre_producto', 'precio', 'cantidad']

class PedidoSerializer(serializers.ModelSerializer):
    items = ItemPedidoSerializer(many=True)
    cupon_codigo = serializers.CharField(write_only=True, required=False, allow_null=True, allow_blank=True)
    cupon_detalle = CuponSerializer(source='cupon', read_only=True)

    class Meta:
        model = Pedido
        fields = [
            'id', 'user', 'nombre_completo', 'email', 'telefono', 
            'direccion', 'ciudad', 'metodo_pago', 'total', 'estado', 
            'created_at', 'updated_at', 'items', 'cupon_codigo', 'cupon_detalle'
        ]
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']

    def create(self, validated_data):
        cupon_codigo = validated_data.pop('cupon_codigo', None)
        items_data = validated_data.pop('items')
        
        request = self.context.get('request')
        user = request.user if request and request.user.is_authenticated else None
        email = validated_data.get('email')
        
        cupon = None
        if cupon_codigo:
            cupon_codigo = cupon_codigo.strip().upper()
            if cupon_codigo:
                try:
                    cupon = Cupon.objects.get(codigo=cupon_codigo, activo=True)
                except Cupon.DoesNotExist:
                    raise serializers.ValidationError(
                        {"error": f"El cupón '{cupon_codigo}' no existe o no está activo."}
                    )
                
                # Control: Un solo uso por usuario
                if user:
                    if Pedido.objects.filter(user=user, cupon=cupon).exists():
                        raise serializers.ValidationError(
                            {"error": f"Ya has utilizado el cupón '{cupon_codigo}' en una compra anterior."}
                        )
                    if user.email and Pedido.objects.filter(email=user.email, cupon=cupon).exists():
                        raise serializers.ValidationError(
                            {"error": f"Ya has utilizado el cupón '{cupon_codigo}' en una compra anterior."}
                        )
                
                # Control: Un solo uso por email (para invitados o usuarios)
                if email and Pedido.objects.filter(email=email, cupon=cupon).exists():
                    raise serializers.ValidationError(
                        {"error": f"El cupón '{cupon_codigo}' ya ha sido utilizado previamente."}
                    )
        
        from django.db import transaction
        
        with transaction.atomic():
            pedido = Pedido.objects.create(user=user, cupon=cupon, **validated_data)
            
            for item_data in items_data:
                producto = item_data.get('producto')
                cantidad = item_data.get('cantidad', 1)
                
                if producto:
                    if producto.stock < cantidad:
                        raise serializers.ValidationError(
                            f"No hay suficiente stock para {producto.nombre}. Disponible: {producto.stock}"
                        )
                    producto.stock -= cantidad
                    producto.save()
                
                ItemPedido.objects.create(pedido=pedido, **item_data)
                
        return pedido

class CarritoItemSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source='producto.id')
    nombre = serializers.CharField(source='producto.nombre', read_only=True)
    precio = serializers.DecimalField(source='producto.precio', max_digits=10, decimal_places=2, read_only=True)
    imagen = serializers.SerializerMethodField()
    stock = serializers.IntegerField(source='producto.stock', read_only=True)

    class Meta:
        model = CarritoItem
        fields = ['id', 'nombre', 'precio', 'imagen', 'cantidad', 'stock']

    def get_imagen(self, obj):
        if obj.producto.imagen:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.producto.imagen.url)
            return obj.producto.imagen.url
        return None


from .models import InstagramPerfil, InstagramPerfilPublicacion

class InstagramPerfilPublicacionSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source='galeria.id', read_only=True)
    imagen = serializers.SerializerMethodField()
    likes = serializers.IntegerField(source='galeria.likes', read_only=True)
    comments = serializers.IntegerField(source='galeria.comments', read_only=True)
    link = serializers.URLField(source='galeria.link', read_only=True)
    caption = serializers.CharField(source='galeria.caption', read_only=True)

    class Meta:
        model = InstagramPerfilPublicacion
        fields = ['id', 'imagen', 'likes', 'comments', 'link', 'caption', 'indice']

    def get_imagen(self, obj):
        if obj.galeria.imagen:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.galeria.imagen.url)
            return obj.galeria.imagen.url
        return None

class InstagramPerfilSerializer(serializers.ModelSerializer):
    imagen_perfil_url = serializers.SerializerMethodField()
    posts = serializers.SerializerMethodField()

    class Meta:
        model = InstagramPerfil
        fields = [
            'id', 'username', 'nombre', 'biografia', 
            'cantidad_posts', 'cantidad_seguidores', 'cantidad_seguidos', 
            'imagen_perfil', 'imagen_perfil_url', 'posts'
        ]

    def get_imagen_perfil_url(self, obj):
        if obj.imagen_perfil and obj.imagen_perfil.imagen:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.imagen_perfil.imagen.url)
            return obj.imagen_perfil.imagen.url
        return None

    def get_posts(self, obj):
        queryset = obj.publicaciones.all().order_by('-indice')[:9]
        return InstagramPerfilPublicacionSerializer(queryset, many=True, context=self.context).data