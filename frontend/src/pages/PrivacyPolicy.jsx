import React from 'react'
import { Link } from 'react-router-dom'
import { FaShieldAlt, FaUserCheck, FaFileContract, FaDatabase, FaLock, FaEnvelope } from 'react-icons/fa'

export default function PrivacyPolicy() {
  return (
    <div className="bg-amber-50/30 min-h-screen py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl border border-amber-100 overflow-hidden">
        
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 p-8 sm:p-10 text-white relative">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl">
              <FaShieldAlt className="text-white" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-100">Marco Legal de Chile</span>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Política de Privacidad y Protección de Datos</h1>
            </div>
          </div>
          <p className="text-sm text-amber-50 max-w-2xl mt-2 leading-relaxed">
            Conforme a la Ley N° 21.683 y la Ley N° 19.628 sobre Protección de la Vida Privada y Datos Personales en Chile, en Apícola Cuatro Reinas garantizamos la confidencialidad, seguridad y el ejercicio pleno de tus derechos sobre tu información personal.
          </p>
          <div className="mt-4 text-xs bg-black/15 inline-block px-3.5 py-1.5 rounded-full font-medium">
            Última actualización: Agosto de 2026
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-10 space-y-8 text-gray-700 text-sm leading-relaxed">

          {/* Sección 1 */}
          <section className="space-y-3">
            <div className="flex items-center gap-3 text-amber-800 font-bold text-base border-b border-amber-100 pb-2">
              <FaUserCheck className="text-amber-600" />
              <h2>1. Identificación del Responsable del Tratamiento</h2>
            </div>
            <p>
              El responsable del tratamiento de los datos personales recopilados a través de esta plataforma web es:
            </p>
            <ul className="list-disc list-inside bg-amber-50/50 p-4 rounded-xl space-y-1 font-medium text-gray-800 border border-amber-100">
              <li><strong>Razón Comercial:</strong> Apícola Cuatro Reinas</li>
              <li><strong>Ubicación:</strong> Los Ángeles, Región del Biobío, Chile</li>
              <li><strong>Correo Electrónico de Contacto / Privacidad:</strong> <a href="mailto:apicuatroreinas@gmail.com" className="text-amber-700 underline font-semibold">apicuatroreinas@gmail.com</a></li>
              <li><strong>Sitio Web Oficial:</strong> <a href="https://apicuatroreinas.cl" target="_blank" rel="noreferrer" className="text-amber-700 underline">apicuatroreinas.cl</a></li>
            </ul>
          </section>

          {/* Sección 2 */}
          <section className="space-y-3">
            <div className="flex items-center gap-3 text-amber-800 font-bold text-base border-b border-amber-100 pb-2">
              <FaDatabase className="text-amber-600" />
              <h2>2. Datos Personales Recopilados y Finalidad</h2>
            </div>
            <p>
              Recopilamos únicamente los datos necesarios para procesar tus compras, emitir la documentación tributaria correspondiente y brindarte atención al cliente eficiente.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-1 text-xs uppercase tracking-wider text-amber-700">Datos Recopilados</h3>
                <ul className="list-disc list-inside text-xs space-y-1 text-gray-600">
                  <li>Nombre completo</li>
                  <li>Rol Único Tributario (RUT / RUN)</li>
                  <li>Correo electrónico y Teléfono de contacto</li>
                  <li>Dirección de envío y Ciudad</li>
                  <li>Historial de compras y pedidos</li>
                </ul>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-1 text-xs uppercase tracking-wider text-amber-700">Finalidad del Tratamiento</h3>
                <ul className="list-disc list-inside text-xs space-y-1 text-gray-600">
                  <li>Gestionar el envío y entrega de productos apícolas.</li>
                  <li>Emisión de boletas/facturas según normativa del SII.</li>
                  <li>Notificaciones sobre el estado de tu pedido.</li>
                  <li>Atención a consultas de soporte al usuario.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Sección 3 */}
          <section className="space-y-3">
            <div className="flex items-center gap-3 text-amber-800 font-bold text-base border-b border-amber-100 pb-2">
              <FaFileContract className="text-amber-600" />
              <h2>3. Base Legal del Tratamiento</h2>
            </div>
            <p>
              El tratamiento de tus datos personales se fundamenta en la <strong>ejecución de una relación contractual</strong> (compraventa de productos) y en el <strong>cumplimiento de obligaciones legales y tributarias</strong> vigentes en la República de Chile (Servicio de Impuestos Internos). Para el envío de comunicaciones promocionales o el uso de cookies no esenciales, se requerirá tu consentimiento libre, explícito e informado.
            </p>
          </section>

          {/* Sección 4 */}
          <section className="space-y-3">
            <div className="flex items-center gap-3 text-amber-800 font-bold text-base border-b border-amber-100 pb-2">
              <FaLock className="text-amber-600" />
              <h2>4. Derechos ARCOP del Titular de los Datos</h2>
            </div>
            <p>
              En conformidad con la Ley N° 21.683 y N° 19.628, como usuario cuentas con los siguientes derechos exigibles:
            </p>
            <div className="space-y-2 text-xs">
              <div className="p-3 bg-amber-50/40 rounded-xl border border-amber-100/60">
                <strong>Acceso y Portabilidad:</strong> Puedes consultar qué datos tenemos registrados y descargar una copia en formato estructurado (JSON/PDF) desde tu panel de usuario.
              </div>
              <div className="p-3 bg-amber-50/40 rounded-xl border border-amber-100/60">
                <strong>Rectificación:</strong> Puedes modificar tus datos personales o de envío directamente en tu perfil.
              </div>
              <div className="p-3 bg-amber-50/40 rounded-xl border border-amber-100/60">
                <strong>Cancelación / Supresión (Derecho al Olvido):</strong> Puedes solicitar la eliminación de tu cuenta de usuario. Ten en cuenta que la información tributaria contenida en facturas y boletas emitidas debe conservarse por el plazo legal mínimo exigido por el Servicio de Impuestos Internos (SII) de Chile (6 años).
              </div>
              <div className="p-3 bg-amber-50/40 rounded-xl border border-amber-100/60">
                <strong>Oposición:</strong> Puedes solicitar no recibir mensajes promocionales o publicitarios en cualquier momento.
              </div>
            </div>
          </section>

          {/* Sección 5 */}
          <section className="space-y-3">
            <div className="flex items-center gap-3 text-amber-800 font-bold text-base border-b border-amber-100 pb-2">
              <FaEnvelope className="text-amber-600" />
              <h2>5. Transferencia a Terceros y Canales de Contacto</h2>
            </div>
            <p>
              Tus datos personales no serán vendidos ni comercializados a terceros. Únicamente se comparten con proveedores de servicios esenciales para cumplir el contrato:
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li><strong>Pasarelas de Pago:</strong> Procesadores seguros (Webpay / MercadoPago) para validar la transacción financiera.</li>
              <li><strong>Empresas de Transporte y Courier:</strong> Servicios de despacho para realizar la entrega de los pedidos en tu domicilio.</li>
            </ul>
            <p className="mt-4">
              Para ejercer cualquiera de tus derechos ARCOP o consultar sobre esta política, puedes escribir a <a href="mailto:apicuatroreinas@gmail.com" className="text-amber-700 font-bold underline">apicuatroreinas@gmail.com</a>.
            </p>
          </section>

        </div>

        {/* Footer of the modal/card */}
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
