from django.contrib import admin
from .models import Producto, Categoria, Galeria, Cupon, PerfilUsuario, Pedido, ItemPedido, CarritoItem

class ProductoAdmin(admin.ModelAdmin):
    list_display = ['nombre', 'precio', 'stock', 'categoria', 'created_at']
    list_filter = ['categoria', 'created_at']
    search_fields = ['nombre', 'descripcion']
    ordering = ['-created_at']

class CategoriaAdmin(admin.ModelAdmin):
    list_display = ['nombre', 'descripcion']
    search_fields = ['nombre']

class ItemPedidoInline(admin.TabularInline):
    model = ItemPedido
    extra = 0

class PedidoAdmin(admin.ModelAdmin):
    list_display = ['id', 'nombre_completo', 'email', 'total', 'cupon', 'estado', 'created_at']
    list_filter = ['estado', 'created_at']
    search_fields = ['nombre_completo', 'email', 'direccion']
    inlines = [ItemPedidoInline]

class CuponAdmin(admin.ModelAdmin):
    list_display = ['codigo', 'descuento_porcentaje', 'descuento_valor', 'activo']
    list_filter = ['activo']
    search_fields = ['codigo']

class PerfilUsuarioAdmin(admin.ModelAdmin):
    list_display = ['user', 'rut', 'telefono', 'ciudad']
    search_fields = ['user__email', 'user__username', 'rut']

admin.site.register(Producto, ProductoAdmin)
admin.site.register(Categoria, CategoriaAdmin)
admin.site.register(Galeria)
admin.site.register(Cupon, CuponAdmin)
admin.site.register(PerfilUsuario, PerfilUsuarioAdmin)
admin.site.register(Pedido, PedidoAdmin)
admin.site.register(CarritoItem)

 