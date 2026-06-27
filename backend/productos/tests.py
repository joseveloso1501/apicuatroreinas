from django.test import TestCase
from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import PerfilUsuario, Cupon, Pedido, Categoria, Producto, CarritoItem, Galeria

class PerfilYAutenticacionTests(APITestCase):

    def setUp(self):
        # Crear cupones de prueba
        self.cupon_10 = Cupon.objects.create(codigo="MIEL10", descuento_porcentaje=10)
        self.cupon_5000 = Cupon.objects.create(codigo="MIEL5000", descuento_valor=5000)
        
        # Crear categoría y producto para pedidos
        self.cat = Categoria.objects.create(nombre="Mieles")
        self.prod = Producto.objects.create(
            nombre="Miel de Ulmo",
            descripcion="Miel premium 500g",
            precio=6500.00,
            stock=10,
            categoria=self.cat
        )

        # Datos de registro correctos
        self.register_url = reverse('auth_register')
        self.login_url = reverse('auth_login')
        self.profile_url = reverse('auth_profile')
        self.change_password_url = reverse('auth_change_password')
        self.delete_account_url = reverse('auth_delete_account')

    def test_registro_exitoso_y_rut_valido(self):
        data = {
            "email": "test@apicola.cl",
            "password": "password123",
            "first_name": "Pedro",
            "last_name": "López",
            "rut": "19.345.678-2",  # RUT válido
            "telefono": "+56912345678",
            "direccion": "Av. Vitacura 5000",
            "ciudad": "Santiago"
        }
        res = self.client.post(self.register_url, data, format='json')
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertIn('token', res.data)
        self.assertEqual(res.data['user']['first_name'], 'Pedro')
        self.assertEqual(res.data['user']['perfil']['rut'], '19.345.678-2')

    def test_registro_rut_invalido_falla(self):
        data = {
            "email": "test_failed@apicola.cl",
            "password": "password123",
            "first_name": "Pedro",
            "last_name": "López",
            "rut": "19.345.678-0",  # RUT con dígito verificador inválido
            "telefono": "+56912345678",
            "direccion": "Av. Vitacura 5000",
            "ciudad": "Santiago"
        }
        res = self.client.post(self.register_url, data, format='json')
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        # El usuario no debe haberse guardado debido al error de validación
        self.assertFalse(User.objects.filter(email="test_failed@apicola.cl").exists())

    def test_login_y_obtencion_perfil(self):
        # Primero registrar
        user = User.objects.create_user(username="login@test.cl", email="login@test.cl", password="password123")
        PerfilUsuario.objects.create(user=user, rut="19.345.678-0", telefono="123")
        
        # Iniciar sesión
        res = self.client.post(self.login_url, {"email": "login@test.cl", "password": "password123"}, format='json')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        token = res.data['token']
        
        # Consultar perfil usando token
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token)
        res_profile = self.client.get(self.profile_url)
        self.assertEqual(res_profile.status_code, status.HTTP_200_OK)
        self.assertEqual(res_profile.data['email'], 'login@test.cl')
        self.assertEqual(res_profile.data['perfil']['rut'], '19.345.678-0')

    def test_agregar_cupon_a_perfil(self):
        user = User.objects.create_user(username="cupon@test.cl", email="cupon@test.cl", password="password123")
        PerfilUsuario.objects.create(user=user)
        
        res = self.client.post(self.login_url, {"email": "cupon@test.cl", "password": "password123"}, format='json')
        token = res.data['token']
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token)
        
        # Intentar agregar el cupón
        agregar_url = reverse('cupon-agregar')
        res_cupon = self.client.post(agregar_url, {"codigo": "MIEL10"}, format='json')
        self.assertEqual(res_cupon.status_code, status.HTTP_200_OK)
        self.assertIn("success", res_cupon.data)
        
        # Validar que está en el listado del perfil
        res_list = self.client.get(reverse('cupon-list'))
        self.assertEqual(len(res_list.data), 1)
        self.assertEqual(res_list.data[0]['codigo'], 'MIEL10')

    def test_creacion_pedido_autenticado(self):
        user = User.objects.create_user(username="pedido@test.cl", email="pedido@test.cl", password="password123")
        PerfilUsuario.objects.create(user=user, telefono="999", direccion="Casa 1", ciudad="Rancagua")
        
        res = self.client.post(self.login_url, {"email": "pedido@test.cl", "password": "password123"}, format='json')
        token = res.data['token']
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token)
        
        # Enviar pedido
        pedido_data = {
            "nombre_completo": "Pedro Pedido",
            "email": "pedido@test.cl",
            "telefono": "999",
            "direccion": "Casa 1",
            "ciudad": "Rancagua",
            "metodo_pago": "webpay",
            "total": 6500.00,
            "items": [
                {
                    "producto": self.prod.id,
                    "nombre_producto": self.prod.nombre,
                    "precio": self.prod.precio,
                    "cantidad": 1
                }
            ]
        }
        
        res_order = self.client.post(reverse('pedido-list'), pedido_data, format='json')
        self.assertEqual(res_order.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Pedido.objects.filter(user=user).count(), 1)
        
        # Verificar que el stock disminuyó de 10 a 9
        self.prod.refresh_from_db()
        self.assertEqual(self.prod.stock, 9)
        
        # Listar pedidos del perfil
        res_my_orders = self.client.get(reverse('pedido-list'))
        self.assertEqual(len(res_my_orders.data), 1)
        self.assertEqual(res_my_orders.data[0]['total'], '6500.00')

    def test_creacion_pedido_stock_insuficiente(self):
        user = User.objects.create_user(username="insuficiente@test.cl", email="insuficiente@test.cl", password="password123")
        PerfilUsuario.objects.create(user=user, telefono="999", direccion="Casa 1", ciudad="Rancagua")
        
        res = self.client.post(self.login_url, {"email": "insuficiente@test.cl", "password": "password123"}, format='json')
        token = res.data['token']
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token)
        
        # Intentar comprar 11 unidades (el stock es 10)
        pedido_data = {
            "nombre_completo": "Pedro Pedido",
            "email": "insuficiente@test.cl",
            "telefono": "999",
            "direccion": "Casa 1",
            "ciudad": "Rancagua",
            "metodo_pago": "webpay",
            "total": 71500.00,
            "items": [
                {
                    "producto": self.prod.id,
                    "nombre_producto": self.prod.nombre,
                    "precio": self.prod.precio,
                    "cantidad": 11
                }
            ]
        }
        
        res_order = self.client.post(reverse('pedido-list'), pedido_data, format='json')
        self.assertEqual(res_order.status_code, status.HTTP_400_BAD_REQUEST)
        # Asegurar que no se guardó el pedido en la BD
        self.assertEqual(Pedido.objects.filter(user=user).count(), 0)
        # Asegurar que el stock se mantiene en 10
        self.prod.refresh_from_db()
        self.assertEqual(self.prod.stock, 10)

    def test_vinculacion_pedido_invitado_por_email(self):
        # 1. Crear un pedido como invitado (sin autenticar, user=None)
        pedido_data = {
            "nombre_completo": "Juan Invitado",
            "email": "guest@apicola.cl",
            "telefono": "999888777",
            "direccion": "Providencia 123",
            "ciudad": "Santiago",
            "metodo_pago": "webpay",
            "total": 6500.00,
            "items": [
                {
                    "producto": self.prod.id,
                    "nombre_producto": self.prod.nombre,
                    "precio": self.prod.precio,
                    "cantidad": 1
                }
            ]
        }
        res_order = self.client.post(reverse('pedido-list'), pedido_data, format='json')
        self.assertEqual(res_order.status_code, status.HTTP_201_CREATED)

        # 2. Registrar un usuario con el mismo email
        user = User.objects.create_user(username="guest@apicola.cl", email="guest@apicola.cl", password="password123")
        PerfilUsuario.objects.create(user=user)

        # 3. Iniciar sesión con el nuevo usuario
        res_login = self.client.post(self.login_url, {"email": "guest@apicola.cl", "password": "password123"}, format='json')
        token = res_login.data['token']
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token)

        # 4. Consultar "Mis Pedidos" y validar que aparezca el pedido realizado como invitado
        res_my_orders = self.client.get(reverse('pedido-list'))
        self.assertEqual(len(res_my_orders.data), 1)
        self.assertEqual(res_my_orders.data[0]['email'], 'guest@apicola.cl')
        self.assertEqual(res_my_orders.data[0]['nombre_completo'], 'Juan Invitado')

    def test_sincronizacion_y_combinacion_carrito(self):
        user = User.objects.create_user(username="carrito@test.cl", email="carrito@test.cl", password="password123")
        PerfilUsuario.objects.create(user=user)
        
        # 1. Iniciar sesión para obtener Token
        res_login = self.client.post(self.login_url, {"email": "carrito@test.cl", "password": "password123"}, format='json')
        token = res_login.data['token']
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token)

        # 2. Agregar un ítem en base de datos al carrito del usuario
        CarritoItem.objects.create(user=user, producto=self.prod, cantidad=2)

        # 3. Simular que el usuario tiene un carrito local con 3 unidades del mismo producto
        # y llama a la API de combinación (merge)
        res_merge = self.client.post(
            reverse('carrito_merge'),
            {"items": [{"id": self.prod.id, "cantidad": 3}]},
            format='json'
        )
        self.assertEqual(res_merge.status_code, status.HTTP_200_OK)
        # Se suman las cantidades (2 anteriores + 3 nuevas = 5)
        self.assertEqual(res_merge.data[0]['cantidad'], 5)

        # 4. Simular que el usuario actualiza su carrito de forma total (PUT /api/carrito/)
        res_put = self.client.put(
            reverse('carrito'),
            {"items": [{"id": self.prod.id, "cantidad": 1}]},
            format='json'
        )
        self.assertEqual(res_put.status_code, status.HTTP_200_OK)
        self.assertEqual(res_put.data[0]['cantidad'], 1)
        self.assertEqual(CarritoItem.objects.filter(user=user).count(), 1)
        self.assertEqual(CarritoItem.objects.get(user=user).cantidad, 1)

class GaleriaTests(APITestCase):

    def test_crear_galeria_sin_link(self):
        # Verificar que el link no es obligatorio a nivel de modelo
        galeria = Galeria.objects.create(
            imagen="galeria/test.jpg",
            caption="Test Caption sin link",
            likes=10,
            comments=2
        )
        self.assertEqual(galeria.link, "")
        self.assertEqual(galeria.caption, "Test Caption sin link")


