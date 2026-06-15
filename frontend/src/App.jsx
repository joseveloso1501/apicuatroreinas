import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Products from './pages/Products'
import About from './pages/About'
import Contact from './pages/Contact'
import FloatingChat from './components/FloatingChat'

export default function App(){
  return (
    <div className="flex flex-col min-h-screen relative">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/productos" element={<Products />} />
          <Route path="/sobre" element={<About />} />
          <Route path="/contacto" element={<Contact />} />
        </Routes>
      </main>
      <Footer />
      <FloatingChat />
    </div>
  )
}
