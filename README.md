# Apícola Cuatro Reinas - E-Commerce de Apicultura

Este proyecto es una plataforma de comercio electrónico premium dedicada a la venta de productos apícolas, diseñada para ofrecer una experiencia fluida, moderna y atractiva para los usuarios.

La solución está estructurada con una arquitectura desacoplada utilizando un backend en **Django** (con Django REST Framework) y un frontend interactivo en **React** (utilizando Vite y Tailwind CSS).

---

## Stack Tecnológico

El proyecto está compuesto por los siguientes componentes y tecnologías:

### Frontend
- **Framework:** [React 18](https://react.dev/) + [Vite](https://vitejs.dev/) (para un desarrollo ultra rápido y optimizado)
- **Estilos:** [Tailwind CSS](https://tailwindcss.com/) (diseño responsivo y personalizado)
- **Enrutamiento:** [React Router DOM v6](https://reactrouter.com/)
- **Cliente HTTP:** [Axios](https://axios-http.com/)

### Backend
- **Framework:** [Django 5.x](https://www.djangoproject.com/) + [Django REST Framework (DRF)](https://www.django-rest-framework.org/)
- **Base de Datos:** [PostgreSQL 16](https://www.postgresql.org/) (en entorno de producción/docker) y soporte para SQLite en desarrollo local.
- **Manejo de Imágenes:** [Pillow](https://python-pillow.org/) y soporte opcional para almacenamiento en la nube con `django-storages` y Google Cloud Storage.

### Orquestación y DevOps
- **Docker & Docker Compose:** Contenerización de base de datos PostgreSQL, backend Django y frontend React.

---

## Características Principales

1. **Catálogo de Productos:**
   - Visualización dinámica con filtrado por categorías y ordenamiento por precios.
   - Control en tiempo real del stock e indicación visual de baja disponibilidad ("Últimas 5 unidades").

2. **Gestión del Carrito de Compras:**
   - Carrito interactivo (Drawer) con validación automática de stock antes de agregar o aumentar cantidades.
   - Sincronización automática con el backend para usuarios autenticados.

3. **Proceso de Pago (Checkout):**
   - Formulario de despacho y pasarela de pago simulada.
   - Deducción automática de stock en el backend tras el pago y restauración automática del stock en caso de pedidos cancelados/eliminados.
   - Sistema de cupones de descuento aplicables sobre el total del pedido.

4. **Perfiles de Usuario:**
   - Registro e inicio de sesión.
   - Validación robusta del **RUT Chileno** (con algoritmo de dígito verificador).
   - Gestión de direcciones, teléfonos e historial de pedidos.

5. **Galería Multimedia e Interacciones:**
   - Sección interactiva "Nosotros" con galería tipo Instagram y soporte para visualización en lightbox modal.
   - Formulario de contacto funcional.
   - Chat flotante interactivo en tiempo real para asistencia al cliente.

---

## Estructura del Proyecto

El repositorio está organizado de la siguiente manera:

```text
ecommerce_apicultura/
│
├── backend/                   # Código del servidor (Django)
│   ├── backend/               # Configuración del proyecto Django (settings, urls, etc.)
│   ├── productos/             # Aplicación principal (modelos, vistas, serializadores, tests)
│   ├── media/                 # Archivos multimedia locales (imágenes de productos/galería)
│   ├── Dockerfile             # Configuración de Docker para el backend
│   └── requirements.txt       # Dependencias de Python
│
├── frontend/                  # Código del cliente (React + Vite)
│   ├── src/
│   │   ├── components/        # Componentes reutilizables (Header, Footer, CartDrawer, etc.)
│   │   ├── pages/             # Páginas principales (Home, Products, Checkout, About, Profile, Contact)
│   │   ├── context/           # Contexto global (Carrito, autenticación)
│   │   └── index.css          # Estilos globales y Tailwind CSS
│   ├── Dockerfile             # Configuración de Docker para el frontend
│   └── package.json           # Dependencias y scripts de Node.js
│
├── docker-compose.yml         # Orquestación de servicios (db, backend, frontend)
└── README.md                  # Documentación del proyecto (este archivo)
```

---

## Instrucciones de Configuración y Ejecución

La manera recomendada de ejecutar este proyecto es utilizando Docker Compose para levantar todos los servicios automáticamente.

### Requisitos Previos
- Tener instalado [Docker](https://www.docker.com/) y [Docker Compose](https://docs.docker.com/compose/).

### Paso 1: Clonar el repositorio
```bash
git clone <url-del-repositorio>
cd ecommerce_apicultura
```

### Paso 2: Iniciar la aplicación con Docker Compose
Desde la raíz del proyecto, ejecuta:
```bash
docker compose up --build
```
Este comando construirá las imágenes de React y Django, descargará la imagen de PostgreSQL y levantará todos los servicios.

### Paso 3: Acceder a los servicios
Una vez levantados los contenedores, puedes acceder a:
- **Frontend (Aplicación React):** [http://localhost:5173](http://localhost:5173)
- **Backend (API de Django):** [http://localhost:8000](http://localhost:8000)
- **Administrador de Django:** [http://localhost:8000/admin](http://localhost:8000/admin) (requiere crear un superusuario)

### Paso 4: Crear un Superusuario (Opcional)
Para acceder al panel de administración de Django y gestionar productos, categorías y pedidos, ejecuta:
```bash
docker compose exec backend python manage.py createsuperuser
```
Sigue las instrucciones en consola para configurar el correo, usuario y contraseña.

---

## Ejecución de Pruebas Automatizadas

Para validar que el backend funcione correctamente, puedes ejecutar los tests unitarios con el siguiente comando:

```bash
docker compose exec backend python manage.py test productos
```
