import { BrowserRouter, Routes, Route } from 'react-router-dom'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-yellow-50 text-gray-900">
        <h1 className="text-3xl font-bold text-center text-yellow-700 my-8">
          🐝 E-commerce Apícola
        </h1>
        <Routes>
          <Route path="/" element={<p className="text-center">Catálogo pronto...</p>} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}