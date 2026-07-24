#!/usr/bin/env python3
import os
import sys

# Instrucciones sobre dependencias
DEPENDENCY_ERROR_MSG = """
Error: Se requieren las librerías 'Pillow' y 'pillow-heif' para ejecutar este script.
Por favor, instálalas ejecutando el siguiente comando en tu terminal:

    pip install Pillow pillow-heif

Luego, vuelve a ejecutar el script.
"""

try:
    from PIL import Image
    import pillow_heif
    # Registrar soporte de imágenes HEIF/HEIC en Pillow
    pillow_heif.register_heif_opener()
except ImportError:
    print(DEPENDENCY_ERROR_MSG)
    sys.exit(1)

def convert_images_in_directory(source_dir):
    # Validar que el directorio de origen exista
    if not os.path.exists(source_dir):
        print(f"Error: El directorio '{source_dir}' no existe.")
        return
    
    # Crear el subdirectorio 'convert/' dentro del directorio origen si no existe
    target_dir = os.path.join(source_dir, "convert")
    os.makedirs(target_dir, exist_ok=True)
    
    # Extensiones que se procesan de forma insensible a mayúsculas/minúsculas
    supported_anycase = ('.heic', '.heif', '.jpeg', '.png')
    
    # Listar archivos: excluimos '.jpg' (minúsculas), pero permitimos '.JPG' (mayúsculas)
    # y los demás formatos de forma insensible a mayúsculas/minúsculas.
    files = []
    for f in os.listdir(source_dir):
        if f.endswith('.JPG'):
            files.append(f)
        elif f.lower().endswith(supported_anycase):
            files.append(f)
    
    if not files:
        print(f"No se encontraron imágenes en formato HEIC, JPG o PNG en el directorio '{source_dir}'.")
        return
    
    print(f"Se encontraron {len(files)} imágenes para procesar.")
    converted_count = 0
    failed_count = 0
    
    for filename in files:
        input_path = os.path.join(source_dir, filename)
        
        # Generar el nombre de salida conservando el original pero con extensión .jpg
        base_name, _ = os.path.splitext(filename)
        output_filename = f"{base_name}.jpg"
        output_path = os.path.join(target_dir, output_filename)
        
        try:
            print(f"Procesando: {filename} -> {output_filename}...", end="", flush=True)
            with Image.open(input_path) as img:
                # Si la imagen tiene canal de transparencia (RGBA) o paleta (P), se convierte a RGB
                if img.mode in ("RGBA", "P"):
                    img = img.convert("RGB")
                elif img.mode == "CMYK":
                    img = img.convert("RGB")
                
                # Guardar en formato JPEG con calidad del 90%
                img.save(output_path, "JPEG", quality=90)
            
            print(" ¡Completado!")
            converted_count += 1
        except Exception as e:
            print(f" Falló (Error: {e})")
            failed_count += 1
            
    print("\n--- Resumen de Procesamiento ---")
    print(f"Imágenes convertidas con éxito: {converted_count}")
    if failed_count > 0:
        print(f"Imágenes con fallas: {failed_count}")
    print(f"Las imágenes resultantes están en: {os.path.abspath(target_dir)}\n")

if __name__ == "__main__":
    # Permite pasar la ruta de una carpeta como argumento. Por defecto usa la carpeta actual ('.')
    directory = sys.argv[1] if len(sys.argv) > 1 else "."
    convert_images_in_directory(directory)
