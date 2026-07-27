import urllib.request
import urllib.error
import sys
import time

url = "http://localhost:8080/api/productos/"
print(f"Probando rate limit enviando peticiones rápidas a {url}...")

success_count = 0
throttled_count = 0

for i in range(1, 120):
    try:
        with urllib.request.urlopen(url) as response:
            if response.status == 200:
                success_count += 1
    except urllib.error.HTTPError as e:
        if e.code == 429:
            throttled_count += 1
            print(f"\n¡Rate limit alcanzado en la petición #{i}! Código HTTP: 429 Too Many Requests")
            break
        else:
            print(f"\nError inesperado en la petición #{i}: {e}")
            sys.exit(1)
    except Exception as e:
        print(f"\nError de conexión: {e}")
        sys.exit(1)
    
    # Imprimir progreso
    sys.stdout.write(f"\rPetición #{i}... OK")
    sys.stdout.flush()

print(f"\n\nResultados del test:")
print(f"- Peticiones exitosas (200 OK): {success_count}")
print(f"- Peticiones bloqueadas (429): {throttled_count}")

if throttled_count > 0:
    print("\n¡Verificación Exitosa! El rate limit está funcionando correctamente con Redis.")
else:
    print("\nAdvertencia: No se alcanzó el rate limit (límite de 100/min).")
