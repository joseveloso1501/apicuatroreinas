from django.db import models
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.conf import settings
from django.db.models.signals import pre_delete
from django.dispatch import receiver
import re

def validate_chilean_rut(value):
    if not value:
        return
    # Clean the rut
    cleaned = re.sub(r'[^0-9kK-]', '', value).upper()
    match = re.match(r'^(\d{7,8})-([\dK])$', cleaned)
    if not match:
        # Try without dash
        match_no_dash = re.match(r'^(\d{7,8})([\dK])$', cleaned)
        if not match_no_dash:
            raise ValidationError("El RUT no tiene un formato chileno válido (debe ser XXXXXXXX-X o XX.XXX.XXX-X).")
        cuerpo, dv = match_no_dash.groups()
    else:
        cuerpo, dv = match.groups()
        
    suma = 0
    multiplo = 2
    for c in reversed(cuerpo):
        suma += int(c) * multiplo
        multiplo = 2 if multiplo == 7 else multiplo + 1
        
    dv_esperado = 11 - (suma % 11)
    if dv_esperado == 11:
        dv_esperado = '0'
    elif dv_esperado == 10:
        dv_esperado = 'K'
    else:
        dv_esperado = str(dv_esperado)
        
    if dv != dv_esperado:
        raise ValidationError("El RUT ingresado es inválido (dígito verificador incorrecto).")

class Categoria(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.nombre

class Producto(models.Model):
    nombre = models.CharField(max_length=200)
    descripcion = models.TextField()
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField(default=0)
    imagen = models.ImageField(upload_to='productos/', blank=True, null=True)
    categoria = models.ForeignKey(Categoria, on_delete=models.CASCADE, related_name='productos')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.nombre

class Galeria(models.Model):
    # ImageField guardará la ruta en la base de datos, y el archivo real se subirá a media/galeria/
    imagen = models.ImageField(upload_to='galeria/')
    caption = models.TextField(blank=True, null=True)
    likes = models.PositiveIntegerField(default=0)
    comments = models.PositiveIntegerField(default=0)
    link = models.URLField(blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.caption[:30] if self.caption else self.id}"

class Cupon(models.Model):
    codigo = models.CharField(max_length=50, unique=True)
    descuento_porcentaje = models.PositiveIntegerField(default=0)
    descuento_valor = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    activo = models.BooleanField(default=True)

    def __str__(self):
        if self.descuento_porcentaje > 0:
            return f"{self.codigo} (-{self.descuento_porcentaje}%)"
        return f"{self.codigo} (-${int(self.descuento_valor)} CLP)"

class PerfilUsuario(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='perfil')
    rut = models.CharField(max_length=15, blank=True, null=True, validators=[validate_chilean_rut])
    telefono = models.CharField(max_length=20, blank=True, null=True)
    direccion = models.CharField(max_length=255, blank=True, null=True)
    ciudad = models.CharField(max_length=100, blank=True, null=True)
    cupones = models.ManyToManyField(Cupon, blank=True, related_name='usuarios')

    def __str__(self):
        return f"Perfil de {self.user.email or self.user.username}"

class Pedido(models.Model):
    ESTADOS = [
        ('pendiente', 'Pendiente'),
        ('pagado', 'Pagado'),
        ('enviado', 'Enviado'),
        ('entregado', 'Entregado'),
        ('cancelado', 'Cancelado'),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='pedidos', null=True, blank=True)
    cupon = models.ForeignKey(Cupon, on_delete=models.SET_NULL, null=True, blank=True, related_name='pedidos')
    nombre_completo = models.CharField(max_length=255)
    email = models.EmailField()
    telefono = models.CharField(max_length=20)
    direccion = models.CharField(max_length=255)
    ciudad = models.CharField(max_length=100)
    metodo_pago = models.CharField(max_length=50)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    estado = models.CharField(max_length=20, choices=ESTADOS, default='pendiente')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Pedido {self.id} - {self.nombre_completo} ({self.estado})"

class ItemPedido(models.Model):
    pedido = models.ForeignKey(Pedido, on_delete=models.CASCADE, related_name='items')
    producto = models.ForeignKey(Producto, on_delete=models.SET_NULL, null=True, blank=True)
    nombre_producto = models.CharField(max_length=200)
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    cantidad = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.cantidad}x {self.nombre_producto} en Pedido {self.pedido.id}"

class CarritoItem(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='carrito_items')
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    cantidad = models.PositiveIntegerField(default=1)

    class Meta:
        unique_together = ('user', 'producto')

    def __str__(self):
        return f"{self.cantidad}x {self.producto.nombre} (User: {self.user.username})"

@receiver(pre_delete, sender=Pedido)
def restaurar_stock_pedido(sender, instance, **kwargs):
    for item in instance.items.all():
        if item.producto:
            item.producto.stock += item.cantidad
            item.producto.save()


