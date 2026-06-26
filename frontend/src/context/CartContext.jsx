import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from './AuthContext'

const CartContext = createContext()

export function CartProvider({ children }) {
  const { token, baseURL } = useAuth() || {}

  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem('apicola_cart')
      return savedCart ? JSON.parse(savedCart) : []
    } catch (error) {
      console.error('Error cargando el carrito desde localStorage', error)
      return []
    }
  })

  const [isCartOpen, setIsCartOpen] = useState(false)

  // Guardar en localStorage cada vez que cambie el carrito
  useEffect(() => {
    localStorage.setItem('apicola_cart', JSON.stringify(cart))
  }, [cart])

  // Sincronizar al iniciar o cerrar sesión
  useEffect(() => {
    const syncCartOnAuthChange = async () => {
      if (token) {
        try {
          // Combinar el carrito local con el del servidor
          const res = await axios.post(`${baseURL}/api/carrito/merge/`, { items: cart }, {
            headers: { Authorization: `Token ${token}` }
          })
          setCart(res.data)
        } catch (err) {
          console.error("Error combinando el carrito con el servidor:", err)
        }
      } else {
        // Al cerrar sesión, vaciar el carrito
        setCart([])
      }
    }
    
    syncCartOnAuthChange()
  }, [token])

  // Guardar en la base de datos (PUT)
  const saveCartToBackend = async (newCart) => {
    if (!token) return
    try {
      await axios.put(`${baseURL}/api/carrito/`, { items: newCart }, {
        headers: { Authorization: `Token ${token}` }
      })
    } catch (err) {
      console.error("Error al guardar el carrito en el backend:", err)
    }
  }

  // Agregar al carrito
  const addToCart = (product) => {
    const existingItem = cart.find((item) => item.id === product.id)
    let newCart
    
    if (existingItem) {
      newCart = cart.map((item) =>
        item.id === product.id ? { ...item, cantidad: item.cantidad + 1 } : item
      )
    } else {
      newCart = [...cart, { 
        id: product.id, 
        nombre: product.nombre, 
        precio: Number(product.precio), 
        imagen: product.imagen, 
        cantidad: 1 
      }]
    }

    setCart(newCart)
    saveCartToBackend(newCart)
    setIsCartOpen(true)
  }

  // Quitar del carrito
  const removeFromCart = (productId) => {
    const newCart = cart.filter((item) => item.id !== productId)
    setCart(newCart)
    saveCartToBackend(newCart)
  }

  // Actualizar cantidad
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId)
      return
    }
    const newCart = cart.map((item) =>
      item.id === productId ? { ...item, cantidad: newQuantity } : item
    )
    setCart(newCart)
    saveCartToBackend(newCart)
  }

  // Vaciar carrito
  const clearCart = () => {
    setCart([])
    saveCartToBackend([])
  }

  // Unidades totales en el carrito
  const cartCount = cart.reduce((total, item) => total + item.cantidad, 0)

  // Suma total
  const cartTotal = cart.reduce((total, item) => total + item.precio * item.cantidad, 0)

  return (
    <CartContext.Provider
      value={{
        cart,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

// Custom hook para consumir el carrito fácilmente
export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart debe ser utilizado dentro de un CartProvider')
  }
  return context
}
