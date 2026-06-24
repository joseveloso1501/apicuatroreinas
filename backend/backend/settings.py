import os
from pathlib import Path
# import google.oauth2

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = 'django-insecure-change-me'
DEBUG = True
ALLOWED_HOSTS = ['*']

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'productos',
    # Configuración de CORS
    "corsheaders",
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    # Configuración de CORS
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
]

ROOT_URLCONF = 'backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'backend.wsgi.application'

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": os.getenv("DB_NAME", "ecommerce"),
        "USER": os.getenv("DB_USER", "admin"),
        "PASSWORD": os.getenv("DB_PASSWORD", "admin123"),
        "HOST": os.getenv("DB_HOST", "db"),
        "PORT": os.getenv("DB_PORT", "5432"),
    }
}

AUTH_PASSWORD_VALIDATORS = []

LANGUAGE_CODE = 'es'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

STATIC_URL = 'static/'
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Configuración de MEDIA (imágenes)
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# Configuración de CORS
CORS_ALLOW_ALL_ORIGINS = True  # solo para desarrollo
CORS_ALLOW_CREDENTIALS = True

# Permitir CORS en media files
CORS_EXPOSE_HEADERS = ['Content-Type', 'X-CSRFToken']

# # Django Storages config
# DEFAULT_FILE_STORAGE = 'storages.backends.gcloud.GoogleCloudStorage'

# GS_BUCKET_NAME = 'el-nombre-de-tu-bucket-gcp'
# GS_PROJECT_ID = 'tu-proyecto-id-gcp'

# # Opcional: credenciales por archivo JSON en local/producción
# # (En Cloud Run se recomienda usar Service Accounts nativas de GCP sin archivo de claves)
# GS_CREDENTIALS = google.oauth2.service_account.Credentials.from_service_account_file(
#     os.path.join(BASE_DIR, 'ruta-a-tus-credenciales.json')
# )
