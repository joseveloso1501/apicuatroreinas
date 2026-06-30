# Imagen base
FROM python:3.11-slim

# Variables de entorno
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Crear carpeta y copiar archivos
WORKDIR /app
COPY . /app

# Instalar dependencias
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Exponer el puerto 8000
EXPOSE 8000

# Comando por defecto
CMD ["gunicorn", "--bind", "[IP_ADDRESS]", "backend.wsgi:application"]