import React, { useState } from 'react'

export default function Contact(){
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)

  const submit = (e) => {
    e.preventDefault()
    // Aquí se podría conectar con la API de backend para enviar mensajes
    setSent(true)
  }

  return (
    <section className="py-12 bg-yellow-50">
      <div className="max-w-3xl mx-auto px-4">
        <h2 className="text-2xl font-bold mb-4">Contacto</h2>
        {sent ? <p className="text-green-700">Mensaje enviado. ¡Gracias!</p> : (
          <form onSubmit={submit} className="grid gap-4">
            <input className="p-3 rounded border" placeholder="Nombre" value={name} onChange={e=>setName(e.target.value)} />
            <input className="p-3 rounded border" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
            <textarea className="p-3 rounded border" placeholder="Mensaje" value={message} onChange={e=>setMessage(e.target.value)} />
            <button className="btn-primary w-max">Enviar</button>
          </form>
        )}
      </div>
    </section>
  )
}
