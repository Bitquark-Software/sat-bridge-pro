import React, { useState } from 'react';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí puedes agregar la lógica de autenticación
    console.log('Login attempt:', { email, password });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      {/* Logo */}
      <div className="mb-8 text-center">
  <div className="flex items-center mb-2">
    {/* Ícono del puente */}
    <div className="w-28 h-4 mr-0">
      <svg
        viewBox="0 0 140 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-black"
      >
        {/* Pilar vertical */}
        <line x1="25" y1="0" x2="25" y2="80" stroke="currentColor" strokeWidth="5" />
       
        {/* Arco superior izquierdo */}
        <path d="M -60 10 Q 0 70, 25 15" stroke="currentColor" strokeWidth="5" fill="none" />

        {/* Arco superior derecho */}
        <path d="M 25 10 Q 25 70, 300 30" stroke="currentColor" strokeWidth="5" fill="none" />

        {/* Línea horizontal superior */}
        <line x1="0" y1="60" x2="140" y2="60" stroke="currentColor" strokeWidth="5" />

        {/* Línea horizontal inferior */}
        <line x1="35" y1="80" x2="15" y2="80" stroke="currentColor" strokeWidth="5" />
      </svg>
    </div>

    {/* Texto alineado a la derecha */}
    <div className="flex flex-col items-start leading-none">
      <span className="text-5xl font-extrabold tracking-tight text-black">SAT</span>
      <span className="text-5xl font-extrabold tracking-tight text-black">BRIDGE</span>
    </div>
  </div>
</div>



      {/* Formulario de login */}
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-black mb-2 text-center">
          Inicia sesión
        </h1>
        <p className="text-gray-400 text-sm text-center mb-6">
          Ingresa tu correo y contraseña
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Campo de correo */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="email" className="block text-sm font-medium text-black">
                Correo
              </label>
            </div>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="tu@correo.com"
              required
            />
          </div>

          {/* Campo de contraseña */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="password" className="block text-sm font-medium text-black">
                Contraseña
              </label>
              <a href="#" className="text-sm text-gray-400 hover:text-gray-600">
                Olvidé mi contraseña
              </a>
            </div>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="••••••••"
              required
            />
          </div>

          {/* Botón de inicio de sesión */}
          <button
            type="submit"
            className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors duration-200 font-medium"
          >
            Iniciar sesión
          </button>
        </form>

        {/* Enlace de registro */}
        <div className="text-center mt-6">
          <span className="text-gray-400 text-sm">¿No tienes una cuenta? </span>
          <a href="#" className="text-sm text-gray-600 underline hover:text-gray-800">
            Crea una
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
