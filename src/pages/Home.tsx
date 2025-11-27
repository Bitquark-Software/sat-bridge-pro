import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChevronDown, ChevronRight, User, FileText, Download, BarChart3, UserCircle, LogOut } from 'lucide-react';

const Home = () => {


  const [userData, setUserData] = useState({
    name: 'Usuario',
    tipo: 'P. Física',
    initial: 'U'
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserData({
        name: user.name || user.username || 'Usuario',
        tipo: user.tipo || user.userType || 'P. Física',
        initial: (user.name || user.username || 'U')[0].toUpperCase()
      });
    }
  }, []);

  const navigate = useNavigate()

  const handleLogout = () => {
  navigate('/login')
  }

  const [expandedMenus, setExpandedMenus] = useState({
    miFiel: true,
    cfdis: false,
    reportes: false,
    miCuenta: false
  });

  // Datos para el gráfico de Ingresos
  const ingresosData = [
    { month: 'Jan', value: 3000 },
    { month: 'Feb', value: 4500 },
    { month: 'Mar', value: 3200 },
    { month: 'Apr', value: 5000 },
    { month: 'May', value: 2800 },
    { month: 'Jun', value: 4200 }
  ];

  // Datos para el gráfico de Egresos
  const egresosData = [
    { month: 'Jan', value: 2800 },
    { month: 'Feb', value: 4200 },
    { month: 'Mar', value: 2900 },
    { month: 'Apr', value: 4800 },
    { month: 'May', value: 2500 },
    { month: 'Jun', value: 3900 }
  ];

  const toggleMenu = (menu) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menu]: !prev[menu]
    }));
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex-shrink-0">
        <div className="p-6">
          <div className="text-xs text-gray-500 mb-2">Dashboard</div>
          
          {/* User Profile */}
          <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-200">
            <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-white font-semibold">
              {userData.initial}
            </div>
            <div>
              <div className="font-semibold text-gray-900">{userData.name}</div>
              <div className="text-sm text-gray-500">{userData.tipo}</div>
            </div>
          </div>

          {/* Menu */}
          <nav className="space-y-1">
            <div className="text-sm font-medium text-gray-500 mb-4">Mi contabilidad</div>
            
            {/* Mi FIEL */}
            <div>
              <button
                onClick={() => toggleMenu('miFiel')}
                className="flex items-center justify-between w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded"
              >
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>Mi FIEL</span>
                </div>
                {expandedMenus.miFiel ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
             {expandedMenus.miFiel && (
              <div className="ml-6 mt-1 space-y-1">
                <div
                  onClick={() => navigate('/fiel')}
                  className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded cursor-pointer"
                >
                  Administrar
                </div>
              </div>
          )}

            </div>

            {/* CFDIs */}
            <div>
              <button
                onClick={() => toggleMenu('cfdis')}
                className="flex items-center justify-between w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded"
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span>CFDIs</span>
                </div>
                {expandedMenus.cfdis ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
              {expandedMenus.cfdis && (
                <div className="ml-6 mt-1 space-y-1">
                  <div className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded cursor-pointer">
                    Visualizador
                  </div>
                  <div className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded cursor-pointer">
                    Descarga masiva
                  </div>
                </div>
              )}
            </div>

            {/* Reportes */}
            <button
              onClick={() => toggleMenu('reportes')}
              className="flex items-center justify-between w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded"
            >
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                <span>Reportes</span>
              </div>
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Mi Cuenta */}
            <button
              onClick={() => toggleMenu('miCuenta')}
              className="flex items-center justify-between w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded"
            >
              <div className="flex items-center gap-2">
                <UserCircle className="w-4 h-4" />
                <span>Mi Cuenta</span>
              </div>
              <ChevronRight className="w-4 h-4" />
            </button>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header with Logout */}
          <div className="flex justify-end mb-6">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Cerrar Sesión
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Ingresos Chart */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-1">Ingresos</h2>
                <p className="text-sm text-gray-500">Enero 1 - Agosto 13, 2025</p>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={ingresosData}>
                  <defs>
                    <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f9a195" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#f9a195" stopOpacity={0.3}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#999', fontSize: 12 }}
                  />
                  <YAxis hide />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#f9a195" 
                    strokeWidth={2}
                    fill="url(#colorIngresos)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Egresos Chart */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-1">Egresos</h2>
                <p className="text-sm text-gray-500">Enero 1 - Agosto 13, 2025</p>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={egresosData}>
                  <defs>
                    <linearGradient id="colorEgresos" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f9a195" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#f9a195" stopOpacity={0.3}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#999', fontSize: 12 }}
                  />
                  <YAxis hide />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#f9a195" 
                    strokeWidth={2}
                    fill="url(#colorEgresos)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
