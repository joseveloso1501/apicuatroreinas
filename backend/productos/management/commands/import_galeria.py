import os
from django.core.management.base import BaseCommand
from django.conf import settings
from productos.models import Galeria

class Command(BaseCommand):
    help = 'Importa imágenes existentes de media/galeria/ a la base de datos'

    def handle(self, *args, **options):
        # La ruta a media/galeria/ en el contenedor
        galeria_dir = os.path.join(settings.MEDIA_ROOT, 'galeria')
        
        if not os.path.exists(galeria_dir):
            self.stdout.write(self.style.ERROR(f'El directorio {galeria_dir} no existe.'))
            return

        files = os.listdir(galeria_dir)
        imported_count = 0
        skipped_count = 0

        # Extensiones de imagen soportadas
        valid_extensions = ('.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.heic', '.tiff')

        for file_name in files:
            # Omitir archivos del sistema u ocultos
            if file_name.startswith('.'):
                continue
                
            ext = os.path.splitext(file_name)[1].lower()
            if ext not in valid_extensions:
                continue

            # Ruta relativa que Django guarda en la base de datos
            db_path = f'galeria/{file_name}'

            # Comprobar si ya existe en la base de datos
            if not Galeria.objects.filter(imagen=db_path).exists():
                # Crear registro
                caption = os.path.splitext(file_name)[0].replace('_', ' ').capitalize()
                Galeria.objects.create(
                    imagen=db_path,
                    caption=caption,
                )
                self.stdout.write(self.style.SUCCESS(f'Importado: {file_name}'))
                imported_count += 1
            else:
                skipped_count += 1

        self.stdout.write(self.style.SUCCESS(
            f'Proceso finalizado. Importados: {imported_count}, Omitidos (ya existían): {skipped_count}'
        ))
