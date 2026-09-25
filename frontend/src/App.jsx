import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Products from './pages/Products'
import About from './pages/About'
import Contact from './pages/Contact'
import Checkout from './pages/Checkout'
import Profile from './pages/Profile'
import PrivacyPolicy from './pages/PrivacyPolicy'
import Terms from './pages/Terms'
import FloatingChat from './components/FloatingChat'
import CookieBanner from './components/CookieBanner'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <div className="flex flex-col min-h-screen relative">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/productos" element={<Products />} />
              <Route path="/sobre" element={<About />} />
              <Route path="/contacto" element={<Contact />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/privacidad" element={<PrivacyPolicy />} />
              <Route path="/terminos" element={<Terms />} />
            </Routes>
          </main>
          <Footer />
          <FloatingChat />
          <CookieBanner />
        </div>
      </CartProvider>
    </AuthProvider>
  )
}

