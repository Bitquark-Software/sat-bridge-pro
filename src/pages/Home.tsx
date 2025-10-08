import React from 'react'
import { useNavigate } from 'react-router-dom'

const Home: React.FC = () => {
  const navigate = useNavigate()

  const stats = [
    { title: 'Usuarios', value: '1,234', color: 'bg-blue-500' },
    { title: 'Ventas', value: '$45,678', color: 'bg-green-500' },
    { title: 'Pedidos', value: '89', color: 'bg-yellow-500' },
    { title: 'Crecimiento', value: '+12%', color: 'bg-purple-500' }
  ]

  const handleLogout = () => {
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Mi Dashboard</h1>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`${stat.color} text-white p-6 rounded-lg shadow`}
            >
              <h3 className="text-lg font-semibold">{stat.title}</h3>
              <p className="text-3xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Resumen</h2>
            <div className="bg-gray-50 p-4 rounded h-64 flex items-center justify-center">
              <p className="text-gray-500">📊 Gráfico aquí</p>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Actividades</h2>
            <div className="space-y-3">
              {['Usuario nuevo', 'Pedido completado', 'Pago procesado'].map((activity, i) => (
                <div key={i} className="p-3 bg-gray-50 rounded">
                  <p>{activity}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Home