import React from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { getMediaUrl } from '../utils/baseURL'

export default function CartDrawer() {
  // ESTADOS Y HOOKS
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    cartTotal
  } = useCart()

  // CLASES DE ESTILO ENCAPSULADAS
  const closeBtnClass = "w-8 h-8 rounded-full hover:bg-orange-100 bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
  const cartItemClass = "flex gap-4 p-3 bg-yellow-50/20 border border-yellow-100/50 rounded-2xl items-center shadow-sm"
  const itemImgClass = "w-16 h-16 rounded-xl bg-yellow-50 bg-cover bg-center flex-shrink-0"
  const qtyStepBtnClass = "w-7 h-7 flex items-center justify-center text-gray-500 hover:text-gray-800 text-sm font-semibold rounded-full cursor-pointer select-none"
  const checkoutBtnClass = "block w-full text-center py-3 bg-amber hover:bg-amber-600 text-white font-bold rounded-full shadow-md hover:shadow-lg transition-all text-sm active:scale-98"

  const drawerContainerClass = (open) =>
    `fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-white shadow-2xl flex flex-col border-l border-gray-100 transition-transform duration-300 ease-in-out transform ${open ? 'translate-x-0' : 'translate-x-full'
    }`

  // RENDERIZADO DEL COMPONENTE
  return (
    <>
      {/* Fondo oscuro semi-transparente (Overlay) */}
      <div
        onClick={() => setIsCartOpen(false)}
        className={`fixed inset-0 bg-black/45 z-40 transition-opacity duration-300 ${isCartOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
      />

      {/* Panel del Carrito deslizable */}
      <div className={drawerContainerClass(isCartOpen)}>
        {/* Cabecera */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl select-none">🛒</span>
            <h3 className="font-extrabold text-gray-900 text-lg tracking-tight">Tu carrito</h3>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className={closeBtnClass}
            aria-label="Cerrar carrito"
          >
            ✕
          </button>
        </div>

        {/* Lista de productos */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-3">
              <span className="text-4xl select-none">🍯</span>
              <p className="text-gray-500 font-medium text-sm">Tu carrito está vacío</p>
              <Link
                to="/productos"
                onClick={() => setIsCartOpen(false)}
                className={checkoutBtnClass}
              >
                Explorar productos
              </Link>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className={cartItemClass}
              >
                {/* Imagen del producto */}
                <div
                  className={itemImgClass}
                  style={item.imagen ? { backgroundImage: `url('${getMediaUrl(item.imagen)}')` } : {}}
                >
                  {!item.imagen && <span className="text-[10px] text-gray-400 flex items-center justify-center h-full">Sin imagen</span>}
                </div>

                {/* Detalles y cantidad */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm text-gray-900 truncate mb-0.5">{item.nombre}</h4>
                  <span className="text-xs font-semibold text-amber-600 block mb-2">
                    ${Math.round(item.precio).toLocaleString('es-CL')}
                  </span>

                  {/* Selector de cantidad */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center border border-gray-200 rounded-full bg-white shadow-xs">
                      <button
                        onClick={() => updateQuantity(item.id, item.cantidad - 1)}
                        className={qtyStepBtnClass}
                      >
                        -
                      </button>
                      <span className="w-6 text-center text-xs font-bold text-gray-800 select-none">
                        {item.cantidad}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.cantidad + 1)}
                        className={qtyStepBtnClass}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Eliminar producto */}
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="p-2 text-gray-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
                  aria-label="Eliminar producto"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer del Carrito */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-gray-100 bg-white space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-500 text-sm font-semibold">Total estimado</span>
              <strong className="text-gray-900 text-xl font-extrabold tracking-tight">
                ${Math.round(cartTotal).toLocaleString('es-CL')}
              </strong>
            </div>

            <p className="text-[11px] text-gray-400 leading-normal text-center">
              Costo de envío calculado al confirmar su dirección en el Checkout. Envío gratis sobre $30.000.
            </p>

            <div className="space-y-2">
              <Link
                to="/checkout"
                onClick={() => setIsCartOpen(false)}
                className={checkoutBtnClass}
              >
                Proceder al Checkout
              </Link>
              <button
                onClick={() => setIsCartOpen(false)}
                className="w-full text-center py-2 text-xs font-semibold text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
              >
                Seguir comprando
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
