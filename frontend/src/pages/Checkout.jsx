import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart()
  const { user, token, baseURL } = useAuth()
  
  // Estados para el formulario
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [telefono, setTelefono] = useState('')
  const [direccion, setDireccion] = useState('')
  const [ciudad, setCiudad] = useState('')
  const [metodoPago, setMetodoPago] = useState('webpay') // webpay, mercadopago
  
  // Estados para cupones
  const [userCoupons, setUserCoupons] = useState([])
  const [manualCouponCode, setManualCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [couponError, setCouponError] = useState(null)
  const [couponSuccess, setCouponSuccess] = useState(null)

  // Estado de éxito y carga
  const [submitting, setSubmitting] = useState(false)
  const [errorPay, setErrorPay] = useState(null)
  const [isSuccess, setIsSuccess] = useState(false)
  const [orderId, setOrderId] = useState('')
  const [orderSummary, setOrderSummary] = useState({ items: [], total: 0, descuento: 0 })

  // Precargar datos del perfil de usuario autenticado
  useEffect(() => {
    if (user) {
      setNombre(user.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : '')
      setEmail(user.email || '')
      setTelefono(user.perfil?.telefono || '')
      setDireccion(user.perfil?.direccion || '')
      setCiudad(user.perfil?.ciudad || '')
    }
  }, [user])

  // Obtener cupones del usuario si está logueado
  useEffect(() => {
    if (token) {
      axios.get(`${baseURL}/api/cupones/`, { headers: { Authorization: `Token ${token}` } })
        .then(res => {
          setUserCoupons(res.data)
        })
        .catch(err => console.error("Error al cargar cupones del usuario en checkout:", err))
    }
  }, [token])

  // Validar y aplicar cupón
  const handleApplyCoupon = async (codeToApply) => {
    setCouponError(null)
    setCouponSuccess(null)
    const code = codeToApply.trim().toUpperCase()
    if (!code) return

    try {
      const config = token ? { headers: { Authorization: `Token ${token}` } } : {}
      const res = await axios.post(`${baseURL}/api/cupones/validar/`, { codigo: code, email: email }, config)
      setAppliedCoupon(res.data)
      setCouponSuccess(`Cupón "${code}" aplicado con éxito.`)
      setManualCouponCode('')
    } catch (err) {
      setCouponError(err.response?.data?.error || 'Cupón inválido o expirado.')
      setAppliedCoupon(null)
    }
  }

  // Cálculos de Totales y Descuentos
  let descuento = 0
  if (appliedCoupon) {
    if (appliedCoupon.descuento_porcentaje > 0) {
      descuento = cartTotal * (appliedCoupon.descuento_porcentaje / 100)
    } else if (appliedCoupon.descuento_valor > 0) {
      descuento = Math.min(Number(appliedCoupon.descuento_valor), cartTotal)
    }
  }
  const totalConDescuento = Math.max(0, cartTotal - descuento)
  const costoDespacho = totalConDescuento > 30000 ? 0 : 3500
  const granTotal = totalConDescuento + costoDespacho

  // Enviar pedido a la base de datos
  const handlePay = async (e) => {
    e.preventDefault()
    if (cart.length === 0) return
    setSubmitting(true)
    setErrorPay(null)

    const payload = {
      nombre_completo: nombre,
      email: email,
      telefono: telefono,
      direccion: direccion,
      ciudad: ciudad,
      metodo_pago: metodoPago,
      total: granTotal,
      cupon_codigo: appliedCoupon ? appliedCoupon.codigo : null,
      items: cart.map(item => ({
        producto: item.id,
        nombre_producto: item.nombre,
        precio: item.precio,
        cantidad: item.cantidad
      }))
    }

    try {
      const headers = token ? { headers: { Authorization: `Token ${token}` } } : {}
      const res = await axios.post(`${baseURL}/api/pedidos/`, payload, headers)
      const createdOrder = res.data

      setOrderId(`AQ-${createdOrder.id}`)
      setOrderSummary({
        items: [...cart],
        total: granTotal,
        descuento,
        nombre,
        email,
        direccion,
        ciudad,
        metodoPago,
        telefono
      })

      setIsSuccess(true)
      clearCart()
    } catch (err) {
      console.error(err)
      setErrorPay(err.response?.data?.error || 'Ocurrió un error al procesar tu pedido. Por favor intenta nuevamente.')
    } finally {
      setSubmitting(false)
    }
  }

  // Si la compra fue exitosa, mostrar el recibo detallado
  if (isSuccess) {
    return (
      <section className="py-16 bg-gradient-to-b from-yellow-50/50 to-white">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-white rounded-2xl border border-green-100 shadow-xl overflow-hidden">
            {/* Header del recibo */}
            <div className="bg-green-600 text-white p-8 text-center space-y-2">
              <span className="text-5xl select-none">🐝✨</span>
              <h2 className="text-3xl font-black tracking-tight">¡Pedido Procesado con Éxito!</h2>
              <p className="text-green-100 text-sm font-medium">Tu orden ha sido registrada en el sistema y está lista para envío.</p>
              <div className="inline-block px-4 py-1 bg-green-700/40 rounded-full text-xs font-bold mt-2">
                Código de Orden: {orderId}
              </div>
            </div>

            {/* Detalles de la orden */}
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-gray-100 text-sm">
                <div>
                  <h4 className="font-bold text-gray-400 uppercase tracking-wider text-xs mb-2">Datos de Despacho</h4>
                  <p className="font-semibold text-gray-800">{orderSummary.nombre}</p>
                  <p className="text-gray-600">{orderSummary.direccion}</p>
                  <p className="text-gray-600">{orderSummary.ciudad}, Chile</p>
                  <p className="text-gray-600">{orderSummary.telefono}</p>
                  <p className="text-gray-600">{orderSummary.email}</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-400 uppercase tracking-wider text-xs mb-2">Información del Pago</h4>
                  <p className="font-semibold text-gray-800">Pasarela Utilizada:</p>
                  <p className="text-gray-600 capitalize font-medium text-amber-600">
                    {orderSummary.metodoPago === 'webpay' && 'Webpay Plus (Transbank)'}
                    {orderSummary.metodoPago === 'mercadopago' && 'Mercado Pago'}
                  </p>
                  <p className="font-semibold text-gray-800 mt-3">Estado de la transacción:</p>
                  <p className="text-green-600 font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>
                    APROBADO (Guardado en base de datos)
                  </p>
                </div>
              </div>

              {/* Resumen de productos comprados */}
              <div>
                <h4 className="font-bold text-gray-400 uppercase tracking-wider text-xs mb-4">Resumen del Pedido</h4>
                <div className="space-y-3">
                  {orderSummary.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center text-sm">
                      <span className="text-gray-700">
                        {item.nombre} <strong className="text-gray-400 font-medium">x {item.cantidad}</strong>
                      </span>
                      <strong className="text-gray-900">
                        ${Math.round(item.precio * item.cantidad).toLocaleString('es-CL')}
                      </strong>
                    </div>
                  ))}
                  {orderSummary.descuento > 0 && (
                    <div className="flex justify-between items-center text-sm text-green-600 font-semibold border-t border-gray-50 pt-2">
                      <span>Descuento Aplicado:</span>
                      <strong>-${Math.round(orderSummary.descuento).toLocaleString('es-CL')}</strong>
                    </div>
                  )}
                  <div className="border-t border-gray-100 pt-3 mt-3 flex justify-between items-center">
                    <span className="font-bold text-gray-900">Total Pagado:</span>
                    <strong className="text-2xl font-black text-amber-600">
                      ${Math.round(orderSummary.total).toLocaleString('es-CL')}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50/50 border border-amber-200/50 rounded-xl p-5 space-y-2 text-xs text-amber-800">
                <h4 className="font-bold uppercase tracking-wider flex items-center gap-1.5 select-none">
                  🐝 ¡Gracias por tu compra!
                </h4>
                <p>Puedes hacer seguimiento de este pedido y revisar su estado en la pestaña <strong>Mis pedidos</strong> en tu perfil.</p>
              </div>

              {/* Botón de retorno */}
              <div className="text-center pt-4">
                <Link
                  to="/profile"
                  className="inline-block px-8 py-3 bg-amber hover:bg-amber-600 text-white font-bold rounded-full shadow-md hover:shadow-lg transition-all text-sm cursor-pointer"
                >
                  Ir a mi perfil
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  // Pantalla principal de Checkout
  return (
    <section className="py-16 bg-gradient-to-b from-yellow-50/50 to-white">
      <div className="max-w-6xl mx-auto px-4">
        
        {cart.length === 0 ? (
          <div className="text-center py-16 space-y-4">
            <span className="text-5xl select-none">🛒</span>
            <h2 className="text-2xl font-bold text-gray-800">No hay productos en tu carrito</h2>
            <p className="text-gray-500 max-w-md mx-auto text-sm">
              Agrega productos desde la tienda para proceder con el pago y despacho de tu pedido.
            </p>
            <Link
              to="/productos"
              className="inline-block px-8 py-3 bg-amber text-white font-bold rounded-full hover:bg-amber-600 transition-all text-sm"
            >
              Ver Productos
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Columna Izquierda: Datos del Despacho y Pago */}
            <div className="lg:col-span-7 bg-white p-8 md:p-10 rounded-2xl border border-gray-100 shadow-sm space-y-8">
              <div>
                <h2 className="text-3xl font-extrabold text-darkbee tracking-tight mb-2">Checkout</h2>
                <p className="text-gray-600">Completa tus datos de despacho para registrar tu pedido.</p>
              </div>

              {errorPay && (
                <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg text-xs font-semibold text-red-700">
                  ⚠️ {errorPay}
                </div>
              )}

              <form onSubmit={handlePay} className="space-y-6">
                {/* Datos de Despacho */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-2">
                    1. Información del Despacho
                  </h3>
                  
                  <div className="space-y-1.5">
                    <label htmlFor="fullname" className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Nombre Completo
                    </label>
                    <input 
                      id="fullname"
                      type="text"
                      required
                      className="w-full p-3 bg-yellow-50/20 border border-gray-200 rounded-xl focus:border-amber focus:ring-2 focus:ring-amber/20 outline-none transition-all text-sm text-gray-800"
                      placeholder="Juan Pérez"
                      value={nombre}
                      onChange={e => setNombre(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="email" className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Correo Electrónico
                      </label>
                      <input 
                        id="email"
                        type="email"
                        required
                        className="w-full p-3 bg-yellow-50/20 border border-gray-200 rounded-xl focus:border-amber focus:ring-2 focus:ring-amber/20 outline-none transition-all text-sm text-gray-800"
                        placeholder="juan@correo.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-1.5">
                      <label htmlFor="phone" className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Teléfono
                      </label>
                      <input 
                        id="phone"
                        type="tel"
                        required
                        className="w-full p-3 bg-yellow-50/20 border border-gray-200 rounded-xl focus:border-amber focus:ring-2 focus:ring-amber/20 outline-none transition-all text-sm text-gray-800"
                        placeholder="+56 9 1234 5678"
                        value={telefono}
                        onChange={e => setTelefono(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="address" className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Dirección
                      </label>
                      <input 
                        id="address"
                        type="text"
                        required
                        className="w-full p-3 bg-yellow-50/20 border border-gray-200 rounded-xl focus:border-amber focus:ring-2 focus:ring-amber/20 outline-none transition-all text-sm text-gray-800"
                        placeholder="Av. Providencia 1234, Depto 402"
                        value={direccion}
                        onChange={e => setDireccion(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-1.5">
                      <label htmlFor="city" className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Ciudad
                      </label>
                      <input 
                        id="city"
                        type="text"
                        required
                        className="w-full p-3 bg-yellow-50/20 border border-gray-200 rounded-xl focus:border-amber focus:ring-2 focus:ring-amber/20 outline-none transition-all text-sm text-gray-800"
                        placeholder="Santiago"
                        value={ciudad}
                        onChange={e => setCiudad(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Métodos de Pago */}
                <div className="space-y-4 pt-4">
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-2">
                    2. Selecciona método de pago
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Webpay */}
                    <div 
                      onClick={() => setMetodoPago('webpay')}
                      className={`p-4 border rounded-xl cursor-pointer flex flex-col justify-between transition-all ${
                        metodoPago === 'webpay' 
                          ? 'border-amber bg-amber/5 ring-1 ring-amber shadow-sm' 
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className="font-bold text-sm text-gray-900 mb-1">Webpay Plus</div>
                      <span className="text-[10px] text-gray-500 leading-normal">
                        Tarjetas de crédito/débito en Chile.
                      </span>
                      <div className="mt-3 text-[10px] font-bold text-red-600 bg-red-50 py-0.5 px-2 rounded-md w-max">
                        Transbank
                      </div>
                    </div>

                    {/* Mercado Pago */}
                    <div 
                      onClick={() => setMetodoPago('mercadopago')}
                      className={`p-4 border rounded-xl cursor-pointer flex flex-col justify-between transition-all ${
                        metodoPago === 'mercadopago' 
                          ? 'border-amber bg-amber/5 ring-1 ring-amber shadow-sm' 
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className="font-bold text-sm text-gray-900 mb-1">Mercado Pago</div>
                      <span className="text-[10px] text-gray-500 leading-normal">
                        Dinero en cuenta o cuotas.
                      </span>
                      <div className="mt-3 text-[10px] font-bold text-sky-600 bg-sky-50 py-0.5 px-2 rounded-md w-max">
                        MercadoLibre
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <p className="text-[10px] text-gray-400 max-w-sm text-center sm:text-left">
                    Al confirmar el pago, la orden se registrará en el sistema para proceder a la preparación y despacho.
                  </p>
                  <button 
                    type="submit"
                    disabled={submitting}
                    className="w-full sm:w-auto px-8 py-3.5 bg-amber hover:bg-amber-600 text-white font-bold rounded-full shadow-md hover:shadow-lg transition-all text-sm cursor-pointer active:scale-95 text-center disabled:opacity-50"
                  >
                    {submitting ? 'Procesando Pedido...' : 'Simular Pago y Finalizar'}
                  </button>
                </div>
              </form>
            </div>

            {/* Columna Derecha: Resumen del Pedido y Cupones */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Cupones de Descuento */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                <h3 className="font-extrabold text-gray-900 text-sm tracking-tight border-b border-gray-100 pb-2">
                  Cupones de Descuento
                </h3>

                {/* Dropdown de Cupones guardados */}
                {userCoupons.length > 0 && (
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Tus Cupones Guardados</label>
                    <select
                      onChange={(e) => handleApplyCoupon(e.target.value)}
                      className="w-full p-2.5 bg-yellow-50/10 border border-gray-200 rounded-xl outline-none text-xs text-gray-700 cursor-pointer"
                      defaultValue=""
                    >
                      <option value="" disabled>Selecciona un cupón guardado</option>
                      {userCoupons.map(cupon => (
                        <option key={cupon.id} value={cupon.codigo}>
                          {cupon.codigo} ({cupon.descuento_porcentaje > 0 ? `-${cupon.descuento_porcentaje}%` : `-$${Math.round(cupon.descuento_valor)} CLP`})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Formulario Manual de Cupón */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Ingresar Código Manual</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Código (Ej: CUPON10)"
                      value={manualCouponCode}
                      onChange={(e) => setManualCouponCode(e.target.value)}
                      className="flex-1 p-2 bg-yellow-50/10 border border-gray-200 rounded-xl outline-none text-xs uppercase"
                    />
                    <button
                      type="button"
                      onClick={() => handleApplyCoupon(manualCouponCode)}
                      className="px-4 py-2 bg-amber hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                    >
                      Aplicar
                    </button>
                  </div>
                </div>

                {couponError && (
                  <p className="text-[10px] font-semibold text-red-600">❌ {couponError}</p>
                )}
                {couponSuccess && (
                  <p className="text-[10px] font-semibold text-green-600">✅ {couponSuccess}</p>
                )}
                {appliedCoupon && (
                  <div className="flex items-center justify-between p-2.5 bg-green-50 border border-green-100 rounded-xl text-xs text-green-800">
                    <div>
                      <span>Cupón activo: <strong>{appliedCoupon.codigo}</strong></span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setAppliedCoupon(null)
                        setCouponSuccess(null)
                      }}
                      className="text-red-500 font-bold hover:underline bg-transparent border-none cursor-pointer"
                    >
                      Remover
                    </button>
                  </div>
                )}
              </div>

              {/* Resumen de la Compra */}
              <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
                <h3 className="font-extrabold text-gray-900 text-sm tracking-tight border-b border-gray-100 pb-3">
                  Resumen de la Compra
                </h3>

                <div className="divide-y divide-gray-50 max-h-80 overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div key={item.id} className="py-3 flex gap-3 items-center">
                      <div 
                        className="w-12 h-12 rounded-lg bg-yellow-50 bg-cover bg-center flex-shrink-0"
                        style={item.imagen ? { backgroundImage: `url('${item.imagen}')` } : {}}
                      >
                        {!item.imagen && <span className="text-[8px] text-gray-400 flex items-center justify-center h-full">N/A</span>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-xs text-gray-900 truncate">{item.nombre}</h4>
                        <span className="text-[10px] text-gray-500">
                          {item.cantidad} x ${Math.round(item.precio).toLocaleString('es-CL')}
                        </span>
                      </div>
                      <strong className="text-xs text-gray-950 ml-auto flex-shrink-0">
                        ${Math.round(item.precio * item.cantidad).toLocaleString('es-CL')}
                      </strong>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
                  <div className="flex justify-between text-gray-500">
                    <span>Subtotal</span>
                    <span className="font-semibold text-gray-700">
                      ${Math.round(cartTotal).toLocaleString('es-CL')}
                    </span>
                  </div>
                  {descuento > 0 && (
                    <div className="flex justify-between text-green-600 font-semibold">
                      <span>Descuento</span>
                      <span>-${Math.round(descuento).toLocaleString('es-CL')}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-500">
                    <span>Despacho</span>
                    <span className="font-semibold text-gray-700">
                      {costoDespacho === 0 ? 'Gratis' : `$${costoDespacho.toLocaleString('es-CL')}`}
                    </span>
                  </div>
                  <div className="border-t border-gray-100 pt-3 flex justify-between items-center text-base">
                    <span className="font-bold text-gray-900">Total</span>
                    <strong className="text-xl font-extrabold text-amber-600">
                      ${Math.round(granTotal).toLocaleString('es-CL')}
                    </strong>
                  </div>
                </div>

                {costoDespacho > 0 && (
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 text-[10px] text-amber-800 leading-normal">
                    💡 <strong>¡Tip apícola!</strong> Agrega ${Math.round(30000 - totalConDescuento).toLocaleString('es-CL')} más en productos y obtén <strong>Despacho Gratis</strong> en tu compra.
                  </div>
                )}
              </div>

            </div>

          </div>
        )}
      </div>
    </section>
  )
}
