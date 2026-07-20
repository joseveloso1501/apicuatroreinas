import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

// Helper para validar RUT chileno
const validateRUT = (rut) => {
  if (!rut) return true // Opcional
  const cleaned = rut.replace(/[^0-9kK]/g, '').toUpperCase()
  if (cleaned.length < 8) return false

  const cuerpo = cleaned.slice(0, -1)
  const dv = cleaned.slice(-1)

  let suma = 0
  let multiplo = 2
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo.charAt(i)) * multiplo
    multiplo = multiplo === 7 ? 2 : multiplo + 1
  }

  const dvEsperado = 11 - (suma % 11)
  let dvCalc = dvEsperado === 11 ? '0' : dvEsperado === 10 ? 'K' : dvEsperado.toString()

  return dv === dvCalc
}

// Helper para formatear RUT chileno
const formatRUT = (rut) => {
  if (!rut) return ''
  const cleaned = rut.replace(/[^0-9kK]/g, '').toUpperCase()
  if (cleaned.length === 0) return ''
  if (cleaned.length === 1) return cleaned

  const dv = cleaned.slice(-1)
  let cuerpo = cleaned.slice(0, -1)

  let formattedCuerpo = ''
  while (cuerpo.length > 3) {
    formattedCuerpo = '.' + cuerpo.slice(-3) + formattedCuerpo
    cuerpo = cuerpo.slice(0, -3)
  }
  formattedCuerpo = cuerpo + formattedCuerpo

  return `${formattedCuerpo}-${dv}`
}

// Helper para validar formato de correo electrónico
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export default function Profile() {
  //   ESTADOS Y HOOKS  
  const {
    user,
    token,
    loading: authLoading,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    deleteAccount,
    baseURL
  } = useAuth()

  // Estado del formulario de login/register
  const [isRegisterMode, setIsRegisterMode] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [rut, setRut] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [formError, setFormError] = useState(null)
  const [formSuccess, setFormSuccess] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const [searchParams, setSearchParams] = useSearchParams()

  // Estado del Dashboard
  const [activeTab, setActiveTab] = useState('profile') // profile, orders, coupons, security

  // Sincronizar activeTab con el parámetro "tab" de la URL
  useEffect(() => {
    const tabParam = searchParams.get('tab')
    if (tabParam && ['profile', 'orders', 'coupons', 'security'].includes(tabParam)) {
      setActiveTab(tabParam)
    }
  }, [searchParams])

  // Estados de datos (pedidos y cupones)
  const [pedidos, setPedidos] = useState([])
  const [loadingPedidos, setLoadingPedidos] = useState(false)
  const [cupones, setCupones] = useState([])
  const [loadingCupones, setLoadingCupones] = useState(false)
  const [expandedPedidoId, setExpandedPedidoId] = useState(null)

  // Estados de inputs del perfil (edición)
  const [editFirstName, setEditFirstName] = useState('')
  const [editLastName, setEditLastName] = useState('')
  const [editRut, setEditRut] = useState('')
  const [editPhone, setEditPhone] = useState('')
  const [editAddress, setEditAddress] = useState('')
  const [editCity, setEditCity] = useState('')

  // Estados de cambio de contraseña
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')

  // Estado de agregado de cupón
  const [couponCodeInput, setCouponCodeInput] = useState('')

  // Estado de eliminación de cuenta
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')

  //   CLASES DE ESTILO ENCAPSULADAS ===
  const labelClass = "text-[10px] font-bold text-gray-500 uppercase tracking-wider"
  const inputClass = "w-full p-2.5 bg-yellow-50/10 border border-gray-200 rounded-xl focus:border-amber focus:ring-2 focus:ring-amber/20 outline-none text-xs"
  const btnPrimaryClass = "px-5 py-2.5 bg-amber hover:bg-amber-600 text-white font-bold rounded-xl text-xs cursor-pointer active:scale-95 transition-all disabled:opacity-50"
  const authSubmitBtnClass = "w-full py-2.5 bg-amber hover:bg-amber-600 text-white font-bold rounded-xl text-xs cursor-pointer active:scale-95 transition-all shadow-md hover:shadow-lg disabled:opacity-50"

  const tabButtonClass = (active) =>
    `w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs transition-all text-left ${active
      ? 'bg-amber text-white shadow-md'
      : 'text-gray-650 hover:bg-yellow-50/50 hover:text-amber-600'
    }`

  // Sincronizar campos de edición cuando el usuario carga | efectos de control de sesion y de carga
  useEffect(() => {
    if (user) {
      setEditFirstName(user.first_name || '')
      setEditLastName(user.last_name || '')
      setEditRut(user.perfil?.rut || '')
      setEditPhone(user.perfil?.telefono || '')
      setEditAddress(user.perfil?.direccion || '')
      setEditCity(user.perfil?.ciudad || '')
    }
  }, [user])

  // Cargar pedidos y cupones al cambiar de pestaña
  useEffect(() => {
    if (!token) return

    if (activeTab === 'orders') {
      fetchPedidos()
    } else if (activeTab === 'coupons') {
      fetchCupones()
    }
    // Limpiar alertas al cambiar de tab
    setFormError(null)
    setFormSuccess(null)
  }, [activeTab, token])

  const fetchPedidos = async () => {
    setLoadingPedidos(true)
    try {
      const res = await axios.get(`${baseURL}/api/pedidos/`, {
        headers: { Authorization: `Token ${token}` }
      })
      setPedidos(res.data)
    } catch (err) {
      console.error('Error al obtener pedidos:', err)
      setFormError('No se pudieron cargar tus pedidos.')
    } finally {
      setLoadingPedidos(false)
    }
  }

  const fetchCupones = async () => {
    setLoadingCupones(true)
    try {
      const res = await axios.get(`${baseURL}/api/cupones/`, {
        headers: { Authorization: `Token ${token}` }
      })
      setCupones(res.data)
    } catch (err) {
      console.error('Error al obtener cupones:', err)
      setFormError('No se pudieron cargar tus cupones.')
    } finally {
      setLoadingCupones(false)
    }
  }

  // Manejar Login / Registro | acciones y de eventos
  const handleAuthSubmit = async (e) => {
    e.preventDefault()
    setFormError(null)
    setSubmitting(true)

    if (isRegisterMode) {
      if (!validateEmail(email)) {
        setFormError('El correo electrónico ingresado no es válido.')
        setSubmitting(false)
        return
      }

      if (password !== confirmPassword) {
        setFormError('Las contraseñas no coinciden.')
        setSubmitting(false)
        return
      }

      if (rut && !validateRUT(rut)) {
        setFormError('El RUT ingresado no es válido.')
        setSubmitting(false)
        return
      }

      const registerData = {
        email,
        password,
        first_name: firstName,
        last_name: lastName,
        rut: formatRUT(rut),
        telefono: phone,
        direccion: address,
        ciudad: city
      }

      try {
        await register(registerData)
      } catch (err) {
        setFormError(err.message)
      } finally {
        setSubmitting(false)
      }
    } else {
      try {
        await login(email, password)
      } catch (err) {
        setFormError(err.message)
      } finally {
        setSubmitting(false)
      }
    }
  }

  // Manejar edición de perfil
  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    setFormError(null)
    setFormSuccess(null)
    setSubmitting(true)

    if (editRut && !validateRUT(editRut)) {
      setFormError('El RUT ingresado no es válido.')
      setSubmitting(false)
      return
    }

    const profileData = {
      first_name: editFirstName,
      last_name: editLastName,
      perfil: {
        rut: formatRUT(editRut),
        telefono: editPhone,
        direccion: editAddress,
        ciudad: editCity
      }
    }

    try {
      await updateProfile(profileData)
      setFormSuccess('¡Perfil actualizado con éxito!')
    } catch (err) {
      setFormError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  // Manejar cambio de contraseña
  const handleChangePassword = async (e) => {
    e.preventDefault()
    setFormError(null)
    setFormSuccess(null)
    setSubmitting(true)

    if (newPassword !== confirmNewPassword) {
      setFormError('La nueva contraseña y su confirmación no coinciden.')
      setSubmitting(false)
      return
    }

    try {
      await changePassword(oldPassword, newPassword)
      setFormSuccess('¡Contraseña cambiada con éxito!')
      setOldPassword('')
      setNewPassword('')
      setConfirmNewPassword('')
    } catch (err) {
      setFormError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  // Manejar agregado de cupón
  const handleAddCoupon = async (e) => {
    e.preventDefault()
    setFormError(null)
    setFormSuccess(null)
    const code = couponCodeInput.trim().toUpperCase()
    if (!code) return

    setSubmitting(true)
    try {
      const res = await axios.post(
        `${baseURL}/api/cupones/agregar/`,
        { codigo: code },
        { headers: { Authorization: `Token ${token}` } }
      )
      setFormSuccess(res.data.success || '¡Cupón agregado con éxito!')
      setCouponCodeInput('')
      fetchCupones() // recargar cupones
    } catch (err) {
      setFormError(err.response?.data?.error || 'Error al agregar el cupón.')
    } finally {
      setSubmitting(false)
    }
  }

  // Manejar eliminación de cuenta
  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'ELIMINAR') {
      alert('Debes escribir "ELIMINAR" para confirmar.')
      return
    }

    try {
      await deleteAccount()
      setShowDeleteModal(false)
    } catch (err) {
      alert(err.message)
    }
  }

  // Vista de carga y transicion
  if (authLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-amber border-t-transparent rounded-full animate-spin"></div>
        <span className="text-gray-500 font-medium animate-pulse">Cargando tu sesión...</span>
      </div>
    )
  }

  // Vista No Autenticado (Formulario de Login/Register)
  if (!user) {
    return (
      <section className="py-16 bg-gradient-to-b from-yellow-50/50 to-white min-h-[80vh] flex items-center">
        <div className="max-w-md w-full mx-auto px-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden">
            {/* Cabecera Estética */}
            <div className="bg-gradient-to-r from-amber to-amber-600 p-8 text-center text-white space-y-2">
              <span className="text-5xl select-none">🐝✨</span>
              <h2 className="text-2xl font-black tracking-tight">Apícola Cuatro Reinas</h2>
              <p className="text-yellow-100 text-xs font-semibold">
                {isRegisterMode ? 'Regístrate para gestionar tus compras' : 'Inicia sesión en tu cuenta'}
              </p>
            </div>

            <div className="p-8">
              {formError && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg text-xs font-semibold text-red-700">
                  ⚠️ {formError}
                </div>
              )}

              <form onSubmit={handleAuthSubmit} className="space-y-4">
                {isRegisterMode && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className={labelClass}>Nombre</label>
                      <input
                        type="text"
                        required
                        className={inputClass}
                        placeholder="Rick"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className={labelClass}>Apellido</label>
                      <input
                        type="text"
                        required
                        className={inputClass}
                        placeholder="Sánchez"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  <label className={labelClass}>Correo Electrónico</label>
                  <input
                    type="email"
                    required
                    className={inputClass}
                    placeholder="rick@correo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                {isRegisterMode && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className={labelClass}>RUT (Opcional)</label>
                        <input
                          type="text"
                          className={inputClass}
                          placeholder="12.345.678-9"
                          value={rut}
                          onChange={(e) => setRut(formatRUT(e.target.value))}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className={labelClass}>Teléfono</label>
                        <input
                          type="tel"
                          className={inputClass}
                          placeholder="+56 9 1234 5678"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className={labelClass}>Dirección</label>
                        <input
                          type="text"
                          className={inputClass}
                          placeholder="Av. Providencia 1234"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className={labelClass}>Ciudad</label>
                        <input
                          type="text"
                          className={inputClass}
                          placeholder="Santiago"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                        />
                      </div>
                    </div>
                  </>
                )}

                <div className="space-y-1">
                  <label className={labelClass}>Contraseña</label>
                  <input
                    type="password"
                    required
                    className={inputClass}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                {isRegisterMode && (
                  <div className="space-y-1">
                    <label className={labelClass}>Confirmar Contraseña</label>
                    <input
                      type="password"
                      required
                      className={inputClass}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className={authSubmitBtnClass}
                >
                  {submitting ? 'Procesando...' : isRegisterMode ? 'Crear Cuenta' : 'Iniciar Sesión'}
                </button>
              </form>

              <div className="mt-6 text-center border-t border-gray-100 pt-6">
                <button
                  onClick={() => {
                    setIsRegisterMode(!isRegisterMode)
                    setFormError(null)
                  }}
                  className="text-xs text-amber-600 font-bold hover:underline bg-transparent border-none cursor-pointer"
                >
                  {isRegisterMode ? '¿Ya tienes cuenta? Inicia sesión aquí' : '¿No tienes cuenta? Regístrate aquí'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  // Vista Autenticado (Dashboard de Perfil)
  return (
    <section className="py-12 bg-gradient-to-b from-yellow-50/20 to-white min-h-screen">
      <div className="max-w-6xl mx-auto px-4">

        {/* Cabecera del Perfil */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-honey/80 flex items-center justify-center text-darkbee font-extrabold text-2xl shadow-inner select-none">
              {(user.first_name || user.email || 'U').charAt(0).toUpperCase()}
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-xl font-black text-gray-900 tracking-tight">
                {user.first_name ? `${user.first_name} ${user.last_name}` : 'Usuario Apicultor'}
              </h2>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="px-5 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            Cerrar Sesión
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Navegación Lateral (Sidebar) */}
          <div className="lg:col-span-3 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-1.5">
            <button
              onClick={() => setSearchParams({ tab: 'profile' })}
              className={tabButtonClass(activeTab === 'profile')}
            >
              <span>👤</span> Mi perfil
            </button>
            <button
              onClick={() => setSearchParams({ tab: 'orders' })}
              className={tabButtonClass(activeTab === 'orders')}
            >
              <span>📦</span> Mis pedidos
            </button>
            <button
              onClick={() => setSearchParams({ tab: 'coupons' })}
              className={tabButtonClass(activeTab === 'coupons')}
            >
              <span>🎟️</span> Mis cupones
            </button>
            <button
              onClick={() => setSearchParams({ tab: 'security' })}
              className={tabButtonClass(activeTab === 'security')}
            >
              <span>🔒</span> Seguridad
            </button>
          </div>

          {/* Contenido de la pestaña */}
          <div className="lg:col-span-9 bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm min-h-[50vh]">

            {formError && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg text-xs font-semibold text-red-700">
                ⚠️ {formError}
              </div>
            )}
            {formSuccess && (
              <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg text-xs font-semibold text-green-700">
                ✅ {formSuccess}
              </div>
            )}

            {/* TAB: MI PERFIL */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-black text-gray-900">Mis datos personales</h3>
                  <p className="text-xs text-gray-500">Mantén tu información actualizada para agilizar tus despachos.</p>
                </div>

                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className={labelClass}>Nombre</label>
                      <input
                        type="text"
                        required
                        className={inputClass}
                        value={editFirstName}
                        onChange={(e) => setEditFirstName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className={labelClass}>Apellido</label>
                      <input
                        type="text"
                        required
                        className={inputClass}
                        value={editLastName}
                        onChange={(e) => setEditLastName(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className={labelClass}>RUT (Opcional)</label>
                      <input
                        type="text"
                        className={inputClass}
                        placeholder="12.345.678-9"
                        value={editRut}
                        onChange={(e) => setEditRut(formatRUT(e.target.value))}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className={labelClass}>Teléfono de Contacto</label>
                      <input
                        type="tel"
                        className={inputClass}
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className={labelClass}>Dirección de Despacho</label>
                      <input
                        type="text"
                        className={inputClass}
                        value={editAddress}
                        onChange={(e) => setEditAddress(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className={labelClass}>Ciudad</label>
                      <input
                        type="text"
                        className={inputClass}
                        value={editCity}
                        onChange={(e) => setEditCity(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-1 bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Correo Electrónico (No modificable)</span>
                    <p className="text-xs text-gray-600 font-semibold mt-1">{user.email}</p>
                  </div>

                  <div className="text-right pt-4 border-t border-gray-100">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-6 py-3 bg-amber hover:bg-amber-600 text-white font-bold rounded-xl shadow-md transition-all text-xs cursor-pointer"
                    >
                      {submitting ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* TAB: MIS PEDIDOS */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-black text-gray-900">Historial de pedidos</h3>
                  <p className="text-xs text-gray-500">Monitorea tus pedidos actuales y revisa tus compras pasadas.</p>
                </div>

                {loadingPedidos ? (
                  <div className="flex justify-center py-8">
                    <div className="w-8 h-8 border-4 border-amber border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : pedidos.length === 0 ? (
                  <div className="text-center py-12 border border-dashed border-gray-200 rounded-2xl bg-gray-50/30">
                    <span className="text-4xl">📦</span>
                    <p className="text-xs text-gray-500 font-semibold mt-3">Aún no has realizado ningún pedido.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pedidos.map((pedido) => (
                      <div
                        key={pedido.id}
                        className="border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition-shadow bg-white"
                      >
                        {/* Cabecera del pedido */}
                        <div
                          onClick={() => setExpandedPedidoId(expandedPedidoId === pedido.id ? null : pedido.id)}
                          className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer select-none bg-yellow-50/10 hover:bg-yellow-50/30 transition-colors"
                        >
                          <div className="space-y-1">
                            <span className="text-[10px] font-extrabold text-amber-600 uppercase tracking-widest">
                              Orden #{pedido.id}
                            </span>
                            <div className="text-xs font-black text-gray-800">
                              Total: ${Math.round(pedido.total).toLocaleString('es-CL')}
                            </div>
                            <div className="text-[10px] text-gray-400">
                              Fecha: {new Date(pedido.created_at).toLocaleDateString('es-CL', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <span
                              className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${pedido.estado === 'pendiente'
                                ? 'bg-yellow-50 text-yellow-600 border-yellow-200'
                                : pedido.estado === 'pagado'
                                  ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                                  : pedido.estado === 'enviado'
                                    ? 'bg-blue-50 text-blue-600 border-blue-200'
                                    : pedido.estado === 'entregado'
                                      ? 'bg-gray-100 text-gray-600 border-gray-200'
                                      : 'bg-red-50 text-red-600 border-red-200'
                                }`}
                            >
                              {pedido.estado}
                            </span>
                            <span className="text-gray-400 text-sm">
                              {expandedPedidoId === pedido.id ? '▲' : '▼'}
                            </span>
                          </div>
                        </div>

                        {/* Detalles desplegados */}
                        {expandedPedidoId === pedido.id && (
                          <div className="p-5 border-t border-gray-100 space-y-6 bg-white">
                            {/* Dirección de despacho */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                              <div className="space-y-1">
                                <h4 className="font-bold text-gray-400 uppercase tracking-wider text-[9px]">Datos de Despacho</h4>
                                <p className="font-semibold text-gray-800">{pedido.nombre_completo}</p>
                                <p className="text-gray-600">Teléfono: {pedido.telefono}</p>
                                <p className="text-gray-600">Dirección: {pedido.direccion}, {pedido.ciudad}</p>
                              </div>
                              <div className="space-y-1">
                                <h4 className="font-bold text-gray-400 uppercase tracking-wider text-[9px]">Información Adicional</h4>
                                <p className="text-gray-600">Método de pago: <strong className="capitalize">{pedido.metodo_pago}</strong></p>
                                {pedido.metodo_pago?.toLowerCase() === 'transferencia' && (
                                  <div className="text-gray-600 space-y-0.5 mt-2 bg-amber-50/50 p-2.5 rounded-xl border border-amber-100/50">
                                    <p className="font-semibold text-gray-700">Datos para transferencia:</p>
                                    <p>Jose Veloso</p>
                                    <p>19.600.494-7</p>
                                    <p>Banco de Chile</p>
                                    <p>Cuenta Corriente</p>
                                    <p>00-225-52723-05</p>
                                    <p>apicuatroreinas@gmail.com</p>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Barra de progreso de envío visual */}
                            <div className="pt-2">
                              <h4 className="font-bold text-gray-400 uppercase tracking-wider text-[9px] mb-4">Estado del Envío</h4>
                              <div className="relative flex justify-between items-center text-[10px] font-bold text-gray-500 max-w-lg mx-auto">
                                <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 z-0"></div>
                                <div
                                  className="absolute top-1/2 left-0 h-1 bg-green-500 -translate-y-1/2 z-0 transition-all duration-500"
                                  style={{
                                    width:
                                      pedido.estado === 'pendiente' ? '0%' :
                                        pedido.estado === 'pagado' ? '33%' :
                                          pedido.estado === 'enviado' ? '66%' :
                                            pedido.estado === 'entregado' ? '100%' : '0%'
                                  }}
                                ></div>

                                {/* Paso 1 */}
                                <div className="z-10 flex flex-col items-center gap-1 bg-white px-2">
                                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs border-2 ${['pendiente', 'pagado', 'enviado', 'entregado'].includes(pedido.estado)
                                    ? 'border-green-500 bg-green-50 text-green-600'
                                    : 'border-gray-300 bg-white text-gray-400'
                                    }`}>✓</div>
                                  <span>Recibido</span>
                                </div>
                                {/* Paso 2 */}
                                <div className="z-10 flex flex-col items-center gap-1 bg-white px-2">
                                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs border-2 ${['pagado', 'enviado', 'entregado'].includes(pedido.estado)
                                    ? 'border-green-500 bg-green-50 text-green-600'
                                    : 'border-gray-300 bg-white text-gray-400'
                                    }`}>✓</div>
                                  <span>Pagado</span>
                                </div>
                                {/* Paso 3 */}
                                <div className="z-10 flex flex-col items-center gap-1 bg-white px-2">
                                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs border-2 ${['enviado', 'entregado'].includes(pedido.estado)
                                    ? 'border-green-500 bg-green-50 text-green-600'
                                    : 'border-gray-300 bg-white text-gray-400'
                                    }`}>✓</div>
                                  <span>En camino</span>
                                </div>
                                {/* Paso 4 */}
                                <div className="z-10 flex flex-col items-center gap-1 bg-white px-2">
                                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs border-2 ${pedido.estado === 'entregado'
                                    ? 'border-green-500 bg-green-50 text-green-600'
                                    : 'border-gray-300 bg-white text-gray-400'
                                    }`}>✓</div>
                                  <span>Entregado</span>
                                </div>
                              </div>
                            </div>

                            {/* Productos Comprados */}
                            <div className="border-t border-gray-100 pt-4 space-y-3">
                              <h4 className="font-bold text-gray-400 uppercase tracking-wider text-[9px]">Productos</h4>
                              <div className="divide-y divide-gray-50">
                                {pedido.items?.map((item) => (
                                  <div key={item.id} className="py-2.5 flex justify-between items-center text-xs">
                                    <span className="text-gray-700">
                                      {item.nombre_producto} <strong className="text-gray-400 font-semibold">x{item.cantidad}</strong>
                                    </span>
                                    <span className="font-bold text-gray-900">
                                      ${Math.round(item.precio * item.cantidad).toLocaleString('es-CL')}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>

                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB: MIS CUPONES */}
            {activeTab === 'coupons' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-black text-gray-900">Mis cupones</h3>
                  <p className="text-xs text-gray-500">Agrega nuevos códigos y visualiza tus cupones de descuento activos.</p>
                </div>

                {/* Formulario Agregar Cupón */}
                <form onSubmit={handleAddCoupon} className="flex gap-3 max-w-md">
                  <input
                    type="text"
                    required
                    placeholder="CÓDIGO DE CUPÓN (Ej: CUPON10)"
                    className={`flex-1 uppercase ${inputClass}`}
                    value={couponCodeInput}
                    onChange={(e) => setCouponCodeInput(e.target.value)}
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    className={btnPrimaryClass}
                  >
                    {submitting ? 'Validando...' : 'Agregar'}
                  </button>
                </form>

                {/* Cuadrícula de Cupones */}
                {loadingCupones ? (
                  <div className="flex justify-center py-8">
                    <div className="w-8 h-8 border-4 border-amber border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : cupones.length === 0 ? (
                  <div className="text-center py-12 border border-dashed border-gray-200 rounded-2xl bg-gray-50/30">
                    <span className="text-4xl">🎫</span>
                    <p className="text-xs text-gray-500 font-semibold mt-3">No tienes cupones guardados actualmente.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                    {cupones.map((cupon) => (
                      <div
                        key={cupon.id}
                        className="relative border-2 border-dashed border-amber-300 rounded-2xl p-5 bg-gradient-to-br from-amber-50/50 to-white shadow-sm overflow-hidden flex items-center justify-between"
                      >
                        {/* Círculos troquelados laterales simulados */}
                        <div className="absolute top-1/2 -left-3 w-6 h-6 bg-white rounded-full border border-amber-300 -translate-y-1/2"></div>
                        <div className="absolute top-1/2 -right-3 w-6 h-6 bg-white rounded-full border border-amber-300 -translate-y-1/2"></div>

                        <div className="space-y-1 pl-4">
                          <span className="text-[10px] font-bold text-amber-800 bg-amber-200/50 px-2 py-0.5 rounded-full uppercase tracking-wider">
                            Descuento Activo
                          </span>
                          <h4 className="text-lg font-black tracking-tight text-gray-900 uppercase pt-1">
                            {cupon.codigo}
                          </h4>
                          <p className="text-[10px] text-gray-500 font-medium">Listo para aplicar en tu checkout.</p>
                        </div>

                        <div className="text-right pr-4">
                          <strong className="text-2xl font-black text-amber-600 block">
                            {cupon.descuento_porcentaje > 0
                              ? `-${cupon.descuento_porcentaje}%`
                              : `-$${Math.round(cupon.descuento_valor).toLocaleString('es-CL')}`
                            }
                          </strong>
                          <span className="text-[9px] font-bold text-gray-400 uppercase">
                            {cupon.descuento_porcentaje > 0 ? 'Dcto. porcentual' : 'CLP de descuento'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB: SEGURIDAD */}
            {activeTab === 'security' && (
              <div className="space-y-8">
                {/* Cambiar Contraseña */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-black text-gray-900">Cambiar contraseña</h3>
                    <p className="text-xs text-gray-500">Actualiza tu contraseña para mantener tu cuenta segura.</p>
                  </div>

                  <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                    <div className="space-y-1">
                      <label className={labelClass}>Contraseña Actual</label>
                      <input
                        type="password"
                        required
                        className={inputClass}
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className={labelClass}>Nueva Contraseña</label>
                      <input
                        type="password"
                        required
                        className={inputClass}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className={labelClass}>Confirmar Nueva Contraseña</label>
                      <input
                        type="password"
                        required
                        className={inputClass}
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className={btnPrimaryClass}
                    >
                      {submitting ? 'Cambiando...' : 'Cambiar Contraseña'}
                    </button>
                  </form>
                </div>

                {/* Zona de Peligro */}
                <div className="border-t border-red-100 pt-8 space-y-4">
                  <div className="bg-red-50/50 rounded-2xl border border-red-200 p-5 space-y-3">
                    <h4 className="text-xs font-extrabold text-red-700 uppercase tracking-wider">
                      ⚠️ Eliminar cuenta (Acción irreversible)
                    </h4>
                    <p className="text-xs text-red-600 leading-relaxed">
                      Si eliminas tu cuenta, se perderá permanentemente toda tu información de perfil, historial de pedidos y cupones acumulados.
                    </p>
                    <button
                      onClick={() => setShowDeleteModal(true)}
                      className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs cursor-pointer transition-all active:scale-95"
                    >
                      Eliminar cuenta de forma permanente
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>

      {/* MODAL ELIMINAR CUENTA */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl border border-gray-100">
            <h4 className="text-sm font-black text-gray-900">¿Estás seguro de que quieres eliminar tu cuenta?</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Esta acción borrará de forma irreversible tus datos personales, tus cupones y tu historial de pedidos.
            </p>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-red-600 uppercase tracking-wider block">
                Escribe "ELIMINAR" para confirmar
              </label>
              <input
                type="text"
                className="w-full p-2.5 bg-red-50/20 border border-red-200 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none text-xs"
                placeholder="ELIMINAR"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  setShowDeleteModal(false)
                  setDeleteConfirmText('')
                }}
                className="px-4 py-2 border border-gray-200 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-50 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteConfirmText !== 'ELIMINAR'}
                className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700 cursor-pointer disabled:opacity-50"
              >
                Eliminar Cuenta
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
