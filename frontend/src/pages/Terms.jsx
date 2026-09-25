import React from 'react'
import { Link } from 'react-router-dom'
import { FaFileContract, FaShoppingBag, FaTruck, FaUndo, FaShieldAlt } from 'react-icons/fa'

export default function Terms() {
  return (
    <div className="bg-amber-50/30 min-h-screen py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl border border-amber-100 overflow-hidden">

        {/* Header Banner */}
        <div className="bg-gradient-to-r from-amber-700 via-amber-600 to-yellow-600 p-8 sm:p-10 text-white relative">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl">
              <FaFileContract className="text-white" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-100">Condiciones de Uso y Compra</span>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Términos y Condiciones</h1>
            </div>
          </div>
          <p className="text-sm text-amber-50 max-w-2xl mt-2 leading-relaxed">
            Las presentes condiciones regulan las compras realizadas en Apícola Cuatro Reinas a través del sitio web apicuatroreinas.cl, en conformidad con la legislación chilena (Ley N° 19.496 y Ley N° 21.683).
          </p>
          <div className="mt-4 text-xs bg-black/15 inline-block px-3.5 py-1.5 rounded-full font-medium">
            Vigente desde: Agosto de 2026
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-10 space-y-8 text-gray-700 text-sm leading-relaxed">

          {/* Sección 1 */}
          <section className="space-y-3">
            <div className="flex items-center gap-3 text-amber-800 font-bold text-base border-b border-amber-100 pb-2">
              <FaShoppingBag className="text-amber-600" />
              <h2>1. Precios, Stock y Moneda</h2>
            </div>
            <p>
              Todos los precios de los productos exhibidos en la plataforma están expresados en <strong>Pesos Chilenos (CLP)</strong> e incluyen el Impuesto al Valor Agregado (IVA del 19%) aplicable en la República de Chile. Las ofertas y cupones de descuento son válidos mientras permanezcan publicados o hasta agotar stock disponible.
            </p>
          </section>

          {/* Sección 2 */}
          <section className="space-y-3">
            <div className="flex items-center gap-3 text-amber-800 font-bold text-base border-b border-amber-100 pb-2">
              <FaTruck className="text-amber-600" />
              <h2>2. Despachos y Envíos</h2>
            </div>
            <p>
              Los productos adquiridos serán despachados a la dirección indicada por el usuario al momento de la compra. Los plazos de entrega varían según la región y comuna de destino en Chile. El cliente es responsable de ingresar los datos de envío de forma precisa y completa.
            </p>
          </section>

          {/* Sección 3 */}
          <section className="space-y-3">
            <div className="flex items-center gap-3 text-amber-800 font-bold text-base border-b border-amber-100 pb-2">
              <FaUndo className="text-amber-600" />
              <h2>3. Garantía Legal y Devoluciones (SERNAC)</h2>
            </div>
            <p>
              En conformidad con la Ley N° 19.496 de Protección de los Derechos de los Consumidores en Chile:
            </p>
            <ul className="list-disc list-inside space-y-1 bg-amber-50/50 p-4 rounded-xl border border-amber-100 text-gray-800 font-medium">
              <li><strong>Garantía Legal (6 Meses):</strong> Si el producto presenta fallas de fábrica o defectos de origen, el consumidor tiene derecho a elegir entre la reparación gratuita, el cambio del producto o la devolución del dinero.</li>
              <li><strong>Condiciones del Producto:</strong> Para hacer efectiva una devolución o cambio por satisfacción, el producto debe ser devuelto en su empaque original sellado, sin daños y sin uso por tratarse de alimentos/productos apícolas.</li>
            </ul>
          </section>

          {/* Sección 4 */}
          <section className="space-y-3">
            <div className="flex items-center gap-3 text-amber-800 font-bold text-base border-b border-amber-100 pb-2">
              <FaShieldAlt className="text-amber-600" />
              <h2>4. Protección de Datos y Privacidad</h2>
            </div>
            <p>
              Toda la información personal recopilada durante el proceso de registro y compra es tratada bajo estrictas medidas de seguridad y en plena conformidad con la <strong>Ley N° 21.683 de Protección de Datos Personales de Chile</strong>. Puedes revisar todos los detalles en nuestra <Link to="/privacidad" className="text-amber-700 font-bold underline">Política de Privacidad</Link>.
            </p>
          </section>

          {/* Sección 5 */}
          <section className="space-y-3">
            <div className="flex items-center gap-3 text-amber-800 font-bold text-base border-b border-amber-100 pb-2">
              <h2>5. Contacto y Atención al Cliente</h2>
            </div>
            <p>
              Para dudas, reclamos o consultas sobre tus compras, puedes ponerte en contacto con nuestro equipo a través de:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Correo Electrónico: <a href="mailto:apicuatroreinas@gmail.com" className="text-amber-700 font-bold underline">apicuatroreinas@gmail.com</a></li>
              <li>WhatsApp Directo: <a href="https://wa.me/56993788049" target="_blank" rel="noreferrer" className="text-amber-700 font-bold underline">+56 9 93788049</a></li>
              <li>Ubicación: Los Ángeles, Región del Biobío, Chile</li>
            </ul>
          </section>

        </div>

        {/* Footer of the page */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <span>© Apícola Cuatro Reinas — Todos los derechos reservados.</span>
          <Link to="/" className="text-amber-700 font-bold hover:underline">
            ← Volver a la Tienda
          </Link>
        </div>

      </div>
    </div>
  )
}
