import React, { useState } from 'react';
import "../style/login.css"
import { Building2, Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = "http://localhost:3000/v1/auth";

const SATAuthComponent = () => {
  // Estados para Login
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  // Estados para Registro
  const [registerData, setRegisterData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  // Estados de control
  const [showPassword, setShowPassword] = useState({ login: false, register: false, confirm: false });
  const [errors, setErrors] = useState<any>({});
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);

  // Modal para recuperar/restablecer contraseña
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotStep, setForgotStep] = useState<'email' | 'reset'>('email');
  const [resetToken, setResetToken] = useState('');
  const [resetPassword, setResetPassword] = useState('');
  const [resetPassword2, setResetPassword2] = useState('');
  const [forgotAlert, setForgotAlert] = useState({ show: false, type: '', message: '' });

  const navigate = useNavigate();

  // Validaciones
  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Manejo de cambios en formularios
  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData(prev => ({ ...prev, [name]: value }));
    if (name === 'email' && value && !validateEmail(value)) {
      setErrors((prev: any) => ({ ...prev, loginEmail: 'Formato de email inválido' }));
    } else {
      setErrors((prev: any) => ({ ...prev, loginEmail: '' }));
    }
  };

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterData(prev => ({ ...prev, [name]: value }));
    // Validaciones en tiempo real
    const newErrors: any = { ...errors };
    if (name === 'email' && value && !validateEmail(value)) {
      newErrors.registerEmail = 'Formato de email inválido';
    } else if (name === 'email') {
      newErrors.registerEmail = '';
    }
    if (name === 'confirmPassword' && value !== registerData.password) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    } else if (name === 'confirmPassword') {
      newErrors.confirmPassword = '';
    }
    if (name === 'password' && registerData.confirmPassword && value !== registerData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    } else if (name === 'password' && registerData.confirmPassword && value === registerData.confirmPassword) {
      newErrors.confirmPassword = '';
    }
    setErrors(newErrors);
  };

  // LOGIN
const handleLogin = async () => {
  setIsLoading(true);
  setAlert({ show: false, type: '', message: '' });

  const newErrors: any = {};
  if (!loginData.email) newErrors.loginEmail = 'Email requerido';
  else if (!validateEmail(loginData.email)) newErrors.loginEmail = 'Formato de email inválido';
  if (!loginData.password) newErrors.loginPassword = 'Contraseña requerida';
  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    setIsLoading(false);
    return;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: loginData.email,
        password: loginData.password,
        name: loginData.email.split('@')[0]
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setAlert({ show: true, type: 'error', message: data.message || 'Error al iniciar sesión' });
    } else {
      setAlert({ show: true, type: 'success', message: '¡Inicio de sesión exitoso!' });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setTimeout(() => navigate('/dashboard', { state: { user: data.user } }), 1000);
    }
  } catch {
    setAlert({ show: true, type: 'error', message: 'Error de conexión al servidor' });
  }
  setIsLoading(false);
};


  // REGISTRO
  const handleRegister = async () => {
    setIsLoading(true);
    setAlert({ show: false, type: '', message: '' });
    const newErrors: any = {};
    if (!registerData.firstName) newErrors.firstName = 'Nombre requerido';
    if (!registerData.lastName) newErrors.lastName = 'Apellidos requeridos';
    if (!registerData.email) newErrors.registerEmail = 'Email requerido';
    else if (!validateEmail(registerData.email)) newErrors.registerEmail = 'Formato de email inválido';
    if (!registerData.password) newErrors.password = 'Contraseña requerida';
    if (registerData.password.length < 6) newErrors.password = 'Contraseña debe tener al menos 6 caracteres';
    if (!registerData.confirmPassword) newErrors.confirmPassword = 'Confirmación requerida';
    if (registerData.password !== registerData.confirmPassword) newErrors.confirmPassword = 'Las contraseñas no coinciden';
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: registerData.email,
          name: `${registerData.firstName} ${registerData.lastName}`,
          password: registerData.password,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAlert({ show: true, type: 'error', message: data.message || 'Error al registrar' });
      } else {
        setAlert({ show: true, type: 'success', message: '¡Registro exitoso! Ahora puedes iniciar sesión.' });
      }
    } catch {
      setAlert({ show: true, type: 'error', message: 'Error de conexión al servidor' });
    }
    setIsLoading(false);
  };

  // MODAL: Recuperar/Restablecer contraseña
  const handleForgotPassword = async () => {
    setForgotAlert({ show: false, type: '', message: '' });
    if (!validateEmail(forgotEmail)) {
      setForgotAlert({ show: true, type: 'error', message: 'Email inválido' });
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail }),
      });
      const data = await res.json();
      if (!res.ok) {
        setForgotAlert({ show: true, type: 'error', message: data.message || 'Error al enviar email' });
      } else {
        setForgotAlert({ show: true, type: 'success', message: '¡Revisa tu correo para el enlace de recuperación!' });
        setForgotStep('reset');
      }
    } catch {
      setForgotAlert({ show: true, type: 'error', message: 'Error de conexión al servidor' });
    }
  };

  const handleResetPassword = async () => {
    setForgotAlert({ show: false, type: '', message: '' });
    if (!resetToken) {
      setForgotAlert({ show: true, type: 'error', message: 'Token requerido' });
      return;
    }
    if (!resetPassword || resetPassword.length < 6) {
      setForgotAlert({ show: true, type: 'error', message: 'Contraseña mínima 6 caracteres' });
      return;
    }
    if (resetPassword !== resetPassword2) {
      setForgotAlert({ show: true, type: 'error', message: 'Las contraseñas no coinciden' });
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/reset-password?token=${resetToken}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: resetPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setForgotAlert({ show: true, type: 'error', message: data.message || 'Error al restablecer' });
      } else {
        setForgotAlert({ show: true, type: 'success', message: '¡Contraseña restablecida! Ya puedes iniciar sesión.' });
        setTimeout(() => setShowForgotModal(false), 1500);
      }
    } catch {
      setForgotAlert({ show: true, type: 'error', message: 'Error de conexión al servidor' });
    }
  };

  const togglePasswordVisibility = (field: string) => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 overflow-auto bg-gradient-to-br from-[#1e3c72] via-[#2a5298] to-[#4c1d95]">
      <div className="w-full max-w-md">
        {/* Header con logo */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg mb-4">
            <Building2 className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Portal SAT</h1>
          <p className="text-blue-200">Sistema de Administración Tributaria</p>
        </div>
        {/* Alert */}
        {alert.show && (
          <Alert className={`mb-4 ${alert.type === 'success' ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
            <AlertDescription className={alert.type === 'success' ? 'text-green-800' : 'text-red-800'}>
              {alert.message}
            </AlertDescription>
          </Alert>
        )}
        {/* Card principal */}
        <Card className="shadow-2xl">
          <CardHeader className="pb-4">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login" className="font-medium">Iniciar Sesión</TabsTrigger>
                <TabsTrigger value="register" className="font-medium">Registrarse</TabsTrigger>
              </TabsList>
              {/* Tab de Login */}
              <TabsContent value="login">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="login-email"
                        name="email"
                        type="text"
                        placeholder="usuario@correo.com"
                        value={loginData.email}
                        onChange={handleLoginChange}
                        className={`pl-10 ${errors.loginEmail ? 'border-red-500' : ''}`}
                      />
                    </div>
                    {errors.loginEmail && <p className="text-sm text-red-500">{errors.loginEmail}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Contraseña</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="login-password"
                        name="password"
                        type={showPassword.login ? "text" : "password"}
                        placeholder="••••••••"
                        value={loginData.password}
                        onChange={handleLoginChange}
                        className={`pl-10 pr-10 ${errors.loginPassword ? 'border-red-500' : ''}`}
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('login')}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword.login ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.loginPassword && <p className="text-sm text-red-500">{errors.loginPassword}</p>}
                    <p className="text-xs text-gray-500">
                        contraseña incorrecta
                    </p>
                  </div>
                  <Button 
                    onClick={handleLogin}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                  </Button>
                  <Button
                    onClick={() => window.location.href = 'http://localhost:3000/v1/auth/google'}
                    className="w-full bg-white hover:bg-gray-100 text-gray-800 font-medium py-2 flex items-center justify-center gap-2 border border-gray-300 mt-2"
                  >
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="h-5 w-5" />
                    Iniciar sesión con Google
                  </Button>
                  <div className="text-center">
                    <button
                      type="button"
                      className="text-sm text-blue-600 hover:underline"
                      onClick={() => { setShowForgotModal(true); setForgotStep('email'); setForgotAlert({ show: false, type: '', message: '' }); }}
                    >
                      ¿Olvidaste tu contraseña?
                    </button>
                  </div>
                </div>
              </TabsContent>
              {/* Tab de Registro */}
              <TabsContent value="register">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Nombre</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="firstName"
                          name="firstName"
                          type="text"
                          placeholder="Juan"
                          value={registerData.firstName}
                          onChange={handleRegisterChange}
                          className={`pl-10 ${errors.firstName ? 'border-red-500' : ''}`}
                        />
                      </div>
                      {errors.firstName && <p className="text-xs text-red-500">{errors.firstName}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Apellidos</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="lastName"
                          name="lastName"
                          type="text"
                          placeholder="Pérez"
                          value={registerData.lastName}
                          onChange={handleRegisterChange}
                          className={`pl-10 ${errors.lastName ? 'border-red-500' : ''}`}
                        />
                      </div>
                      {errors.lastName && <p className="text-xs text-red-500">{errors.lastName}</p>}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="register-email"
                        name="email"
                        type="email"
                        placeholder="usuario@correo.com"
                        value={registerData.email}
                        onChange={handleRegisterChange}
                        className={`pl-10 ${errors.registerEmail ? 'border-red-500' : ''}`}
                      />
                    </div>
                    {errors.registerEmail && <p className="text-sm text-red-500">{errors.registerEmail}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Contraseña</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="register-password"
                        name="password"
                        type={showPassword.register ? "text" : "password"}
                        placeholder="••••••••"
                        value={registerData.password}
                        onChange={handleRegisterChange}
                        className={`pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('register')}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword.register ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                     <p className="text-xs text-gray-500">
                        Usa al menos 8 caracteres con mayúsculas, minúsculas y números para una contraseña segura.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showPassword.confirm ? "text" : "password"}
                        placeholder="••••••••"
                        value={registerData.confirmPassword}
                        onChange={handleRegisterChange}
                        className={`pl-10 pr-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('confirm')}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
                  </div>
                  <Button 
                    onClick={handleRegister}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Registrando...' : 'Crear Cuenta'}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardHeader>
          <CardFooter className="pt-0">
            <div className="w-full text-center text-sm text-gray-500">
              <p>© 2024 SAT - Todos los derechos reservados</p>
              <p className="mt-1">Servicio de Administración Tributaria</p>
            </div>
          </CardFooter>
    

        </Card>
        {/* Modal para recuperar/restablecer contraseña */}
        {showForgotModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm relative">
              <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={() => setShowForgotModal(false)}>✕</button>
              <h2 className="text-lg font-bold mb-2 text-blue-700">Recuperar/Restablecer Contraseña</h2>
              {forgotAlert.show && (
                <Alert className={`mb-2 ${forgotAlert.type === 'success' ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
                  <AlertDescription className={forgotAlert.type === 'success' ? 'text-green-800' : 'text-red-800'}>
                    {forgotAlert.message}
                  </AlertDescription>
                </Alert>
              )}
              {forgotStep === 'email' ? (
                <>
                  <Label htmlFor="forgot-email">Email</Label>
                  <Input
                    id="forgot-email"
                    type="email"
                    value={forgotEmail}
                    onChange={e => setForgotEmail(e.target.value)}
                    className="mb-2"
                  />
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={handleForgotPassword}>
                    Enviar enlace de recuperación
                  </Button>
                </>
              ) : (
                <>
                  <Label htmlFor="reset-token">Token recibido por email</Label>
                  <Input
                    id="reset-token"
                    type="text"
                    value={resetToken}
                    onChange={e => setResetToken(e.target.value)}
                    className="mb-2"
                  />
                  <Label htmlFor="reset-password">Nueva contraseña</Label>
                  <Input
                    id="reset-password"
                    type="password"
                    value={resetPassword}
                    onChange={e => setResetPassword(e.target.value)}
                    className="mb-2"
                  />
                  <Label htmlFor="reset-password2">Confirmar nueva contraseña</Label>
                  <Input
                    id="reset-password2"
                    type="password"
                    value={resetPassword2}
                    onChange={e => setResetPassword2(e.target.value)}
                    className="mb-2"
                  />
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white" onClick={handleResetPassword}>
                    Restablecer contraseña
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SATAuthComponent;