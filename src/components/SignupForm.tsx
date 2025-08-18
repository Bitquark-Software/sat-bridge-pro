import React, { useState } from 'react';

interface SignupFormProps {
  onSwitchToLogin: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onSwitchToLogin }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [personType, setPersonType] = useState<'fisica' | 'moral'>('fisica');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí puedes agregar la lógica de registro
    console.log('Signup attempt:', { fullName, email, password, personType });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      {/* Logo */}
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center mb-2">
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
    <div className="flex flex-col items-start leading-none">
      <span className="text-5xl font-extrabold tracking-tight text-black">SAT</span>
      <span className="text-5xl font-extrabold tracking-tight text-black">BRIDGE</span>
    </div>
        </div>
      </div>

      {/* Formulario de registro */}
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-black mb-6">
          Crea una cuenta
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Campo de nombre completo */}
          <div>
            <label htmlFor="fullName" className="flex justify-between items-center text-sm font-medium text-black mb-2">
              Nombre completo
            </label>
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="Tu nombre completo"
              required
            />
          </div>

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
            <label htmlFor="password" className="flex justify-between items-center text-sm font-medium text-black mb-2">
              Contraseña
            </label>
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

                     {/* Selector de tipo de persona */}
           <div>
             <label className="flex justify-between items-center text-sm font-medium text-black mb-2">
               Tipo de persona
             </label>
                           <div className="relative bg-gray-200 rounded-lg p-1 h-8 w-34">
                <button
                  type="button"
                  onClick={() => setPersonType('fisica')}
                  className={`absolute top-0.5 left-0.5 w-1/2 h-7 bg-white rounded-md shadow-sm transition-all duration-200 ease-in-out ${
                    personType === 'fisica' ? 'translate-x-0' : 'translate-x-full'
                  }`}
                />
               <div className="relative flex h-full">
                 <button
                   type="button"
                   onClick={() => setPersonType('fisica')}
                   className={`flex-1 flex items-center justify-center text-sm font-medium transition-colors duration-200 z-10 ${
                     personType === 'fisica' ? 'text-black' : 'text-gray-600'
                   }`}
                 >
                   Física
                 </button>
                 <button
                   type="button"
                   onClick={() => setPersonType('moral')}
                   className={`flex-1 flex items-center justify-center text-sm font-medium transition-colors duration-200 z-10 ${
                     personType === 'moral' ? 'text-black' : 'text-gray-600'
                   }`}
                 >
                   Moral
                 </button>
               </div>
             </div>
           </div>

          {/* Botón de crear cuenta */}
          <button
            type="submit"
            className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors duration-200 font-medium mt-6"
          >
            Crear cuenta
          </button>
        </form>

        {/* Enlace de login */}
        <div className="text-center mt-6">
          <span className="text-gray-400 text-sm">¿Ya tienes una cuenta? </span>
          <button 
            onClick={onSwitchToLogin}
            className="text-sm text-gray-600 underline hover:text-gray-800 bg-transparent border-none cursor-pointer"
          >
            Inicia sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
