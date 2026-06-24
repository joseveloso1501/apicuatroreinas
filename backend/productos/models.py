from django.db import models

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
    # ImageField guardará la ruta en la base de datos, y el archivo real se subirá a media/instagram/
    imagen = models.ImageField(upload_to='galeria/')
    caption = models.TextField(blank=True, null=True)
    likes = models.PositiveIntegerField(default=0)
    comments = models.PositiveIntegerField(default=0)
    link = models.URLField(default="https://www.instagram.com/api4reinas/")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Post - {self.caption[:30] if self.caption else self.id}"
