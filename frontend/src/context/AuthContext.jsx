import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import { baseURL } from '../utils/baseURL'

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Configurar axios para incluir el Token si existe
  const getAuthHeaders = () => {
    return token ? { headers: { Authorization: `Token ${token}` } } : {}
  }

  // Cargar perfil del usuario si hay token
  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        setLoading(false)
        return
      }
      try {
        const res = await axios.get(`${baseURL}/api/auth/profile/`, {
          headers: { Authorization: `Token ${token}` }
        })
        setUser(res.data)
      } catch (err) {
        console.error('Error al cargar perfil con el token guardado:', err)
        logout() // Si el token es inválido, expirar sesión
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [token])

  // Login
  const login = async (email, password) => {
    setError(null)
    try {
      const res = await axios.post(`${baseURL}/api/auth/login/`, { email, password })
      const { token: userToken, user: userData } = res.data
      
      localStorage.setItem('token', userToken)
      setToken(userToken)
      setUser(userData)
      return { success: true }
    } catch (err) {
      const errMsg = err.response?.data?.error || 'Error al iniciar sesión. Verifica tus credenciales.'
      setError(errMsg)
      throw new Error(errMsg)
    }
  }

  // Registro
  const register = async (formData) => {
    setError(null)
    try {
      const res = await axios.post(`${baseURL}/api/auth/register/`, formData)
      const { token: userToken, user: userData } = res.data
      
      localStorage.setItem('token', userToken)
      setToken(userToken)
      setUser(userData)
      return { success: true }
    } catch (err) {
      const errMsg = err.response?.data?.error || 'Error al registrarse. Verifica tus datos.'
      setError(errMsg)
      throw new Error(errMsg)
    }
  }

  // Logout
  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
    setError(null)
  }

  // Actualizar Perfil
  const updateProfile = async (profileData) => {
    try {
      const res = await axios.put(`${baseURL}/api/auth/profile/`, profileData, getAuthHeaders())
      setUser(res.data)
      return { success: true }
    } catch (err) {
      const errMsg = err.response?.data?.error || 'Error al actualizar el perfil.'
      throw new Error(errMsg)
    }
  }

  // Cambiar Contraseña
  const changePassword = async (oldPassword, newPassword) => {
    try {
      await axios.post(
        `${baseURL}/api/auth/change-password/`,
        { old_password: oldPassword, new_password: newPassword },
        getAuthHeaders()
      )
      return { success: true }
    } catch (err) {
      const errMsg = err.response?.data?.error || 'Error al cambiar la contraseña.'
      throw new Error(errMsg)
    }
  }

  // Eliminar Cuenta
  const deleteAccount = async () => {
    try {
      await axios.delete(`${baseURL}/api/auth/delete-account/`, getAuthHeaders())
      logout()
      return { success: true }
    } catch (err) {
      const errMsg = err.response?.data?.error || 'Error al eliminar la cuenta.'
      throw new Error(errMsg)
    }
  }

  const value = {
    token,
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    deleteAccount,
    getAuthHeaders,
    baseURL
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
