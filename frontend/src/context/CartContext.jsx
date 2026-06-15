import React, { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
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

  // Agregar al carrito
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id)
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, cantidad: item.cantidad + 1 } : item
        )
      }
      return [...prevCart, { 
        id: product.id, 
        nombre: product.nombre, 
        precio: Number(product.precio), 
        imagen: product.imagen, 
        cantidad: 1 
      }]
    })
    
    // Auto-abrir el Drawer al agregar un producto (requerimiento aprobado)
    setIsCartOpen(true)
  }

  // Quitar del carrito
  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId))
  }

  // Actualizar cantidad
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId)
      return
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, cantidad: newQuantity } : item
      )
    )
  }

  // Vaciar carrito
  const clearCart = () => {
    setCart([])
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
