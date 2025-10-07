import React, { useState } from 'react';
import { Building2, Eye, EyeOff, Mail, Lock, User, Phone, FileText, Chrome, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';

const SATAuthComponent = () => {
  // Estados para Login
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  
  // Estados para Registro
  const [registerData, setRegisterData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    rfc: '',
    password: '',
    confirmPassword: ''
  });

  // Estados para Forgot Password
  const [forgotPasswordData, setForgotPasswordData] = useState({
    email: ''
  });

  // Estados para Reset Password
  const [resetPasswordData, setResetPasswordData] = useState({
    token: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Estados para Email Verification
  const [verificationData, setVerificationData] = useState({
    token: '',
    email: ''
  });
  
  // Estados de control
  const [showPassword, setShowPassword] = useState({
    login: false,
    register: false,
    confirm: false,
    newPassword: false,
    confirmNewPassword: false
  });
  
  const [currentView, setCurrentView] = useState('auth'); // 'auth', 'forgot-password', 'reset-password', 'verify-email'
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  
  // URLs de tu backend (ajústalas según tu configuración)
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';
  
  // Validaciones
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  const validateRFC = (rfc) => {
    const rfcRegex = /^[A-ZÑ&]{3,4}[0-9]{2}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])[A-Z0-9]{2}[0-9A]$/;
    return rfcRegex.test(rfc.toUpperCase());
  };
  
  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  };

  // Función para mostrar alertas
  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => {
      setAlert({ show: false, type: '', message: '' });
    }, 5000);
  };
  
  // Manejo de cambios en formularios
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'email' && value && !validateEmail(value)) {
      setErrors(prev => ({ ...prev, loginEmail: 'Formato de email inválido' }));
    } else {
      setErrors(prev => ({ ...prev, loginEmail: '' }));
    }
  };
  
  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;
    
    if (name === 'rfc') {
      processedValue = value.toUpperCase().replace(/[^A-ZÑ&0-9]/g, '');
    }
    
    if (name === 'phone') {
      processedValue = value.replace(/[^0-9]/g, '');
    }
    
    setRegisterData(prev => ({ ...prev, [name]: processedValue }));
    
    const newErrors = { ...errors };
    
    if (name === 'email' && processedValue && !validateEmail(processedValue)) {
      newErrors.registerEmail = 'Formato de email inválido';
    } else if (name === 'email') {
      newErrors.registerEmail = '';
    }
    
    if (name === 'rfc' && processedValue && !validateRFC(processedValue)) {
      newErrors.rfc = 'RFC inválido (ej: XAXX010101000)';
    } else if (name === 'rfc') {
      newErrors.rfc = '';
    }
    
    if (name === 'phone' && processedValue && !validatePhone(processedValue)) {
      newErrors.phone = 'Teléfono debe tener 10 dígitos';
    } else if (name === 'phone') {
      newErrors.phone = '';
    }
    
    if (name === 'confirmPassword' && processedValue !== registerData.password) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    } else if (name === 'confirmPassword') {
      newErrors.confirmPassword = '';
    }
    
    if (name === 'password' && registerData.confirmPassword && processedValue !== registerData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    } else if (name === 'password' && registerData.confirmPassword && processedValue === registerData.confirmPassword) {
      newErrors.confirmPassword = '';
    }
    
    setErrors(newErrors);
  };

  const handleForgotPasswordChange = (e) => {
    const { name, value } = e.target;
    setForgotPasswordData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'email' && value && !validateEmail(value)) {
      setErrors(prev => ({ ...prev, forgotEmail: 'Formato de email inválido' }));
    } else {
      setErrors(prev => ({ ...prev, forgotEmail: '' }));
    }
  };

  const handleResetPasswordChange = (e) => {
    const { name, value } = e.target;
    setResetPasswordData(prev => ({ ...prev, [name]: value }));
    
    const newErrors = { ...errors };
    
    if (name === 'confirmPassword' && value !== resetPasswordData.newPassword) {
      newErrors.resetConfirmPassword = 'Las contraseñas no coinciden';
    } else if (name === 'confirmPassword') {
      newErrors.resetConfirmPassword = '';
    }
    
    if (name === 'newPassword' && resetPasswordData.confirmPassword && value !== resetPasswordData.confirmPassword) {
      newErrors.resetConfirmPassword = 'Las contraseñas no coinciden';
    } else if (name === 'newPassword' && resetPasswordData.confirmPassword && value === resetPasswordData.confirmPassword) {
      newErrors.resetConfirmPassword = '';
    }
    
    setErrors(newErrors);
  };

  const handleVerificationChange = (e) => {
    const { name, value } = e.target;
    setVerificationData(prev => ({ ...prev, [name]: value }));
  };
  
  // Manejo de envío de formularios
  const handleLogin = async () => {
    setIsLoading(true);
    
    const newErrors = {};
    if (!loginData.email) newErrors.loginEmail = 'Email requerido';
    else if (!validateEmail(loginData.email)) newErrors.loginEmail = 'Formato de email inválido';
    if (!loginData.password) newErrors.loginPassword = 'Contraseña requerida';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }
    
    try {
      // Aquí harás la llamada a tu API: POST /auth/login
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: loginData.email,
          password: loginData.password
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        showAlert('success', '¡Inicio de sesión exitoso! Bienvenido al portal SAT.');
        // Guardar token, redirigir, etc.
        localStorage.setItem('token', data.token);
      } else {
        showAlert('error', data.message || 'Error al iniciar sesión');
      }
    } catch (error) {
      showAlert('error', 'Error de conexión. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRegister = async () => {
    setIsLoading(true);
    
    const newErrors = {};
    if (!registerData.firstName) newErrors.firstName = 'Nombre requerido';
    if (!registerData.lastName) newErrors.lastName = 'Apellidos requeridos';
    if (!registerData.email) newErrors.registerEmail = 'Email requerido';
    else if (!validateEmail(registerData.email)) newErrors.registerEmail = 'Formato de email inválido';
    if (!registerData.phone) newErrors.phone = 'Teléfono requerido';
    else if (!validatePhone(registerData.phone)) newErrors.phone = 'Teléfono debe tener 10 dígitos';
    if (!registerData.rfc) newErrors.rfc = 'RFC requerido';
    else if (!validateRFC(registerData.rfc)) newErrors.rfc = 'RFC inválido';
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
      // Aquí harás la llamada a tu API: POST /auth/register
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: registerData.firstName,
          lastName: registerData.lastName,
          email: registerData.email,
          phone: registerData.phone,
          rfc: registerData.rfc,
          password: registerData.password
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        showAlert('success', '¡Registro exitoso! Revisa tu email para verificar tu cuenta.');
        setCurrentView('verify-email');
        setVerificationData(prev => ({ ...prev, email: registerData.email }));
      } else {
        showAlert('error', data.message || 'Error al registrarse');
      }
    } catch (error) {
      showAlert('error', 'Error de conexión. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Redirigir a tu endpoint de Google OAuth
    window.location.href = `${API_BASE_URL}/auth/google`;
  };

  const handleForgotPassword = async () => {
    setIsLoading(true);
    
    const newErrors = {};
    if (!forgotPasswordData.email) newErrors.forgotEmail = 'Email requerido';
    else if (!validateEmail(forgotPasswordData.email)) newErrors.forgotEmail = 'Formato de email inválido';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }
    
    try {
      // POST /auth/forgot-password
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: forgotPasswordData.email
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        showAlert('success', 'Se ha enviado un enlace de recuperación a tu email.');
        setCurrentView('reset-password');
      } else {
        showAlert('error', data.message || 'Error al enviar email de recuperación');
      }
    } catch (error) {
      showAlert('error', 'Error de conexión. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setIsLoading(true);
    
    const newErrors = {};
    if (!resetPasswordData.token) newErrors.resetToken = 'Token requerido';
    if (!resetPasswordData.newPassword) newErrors.resetPassword = 'Nueva contraseña requerida';
    if (resetPasswordData.newPassword.length < 6) newErrors.resetPassword = 'Contraseña debe tener al menos 6 caracteres';
    if (!resetPasswordData.confirmPassword) newErrors.resetConfirmPassword = 'Confirmación requerida';
    if (resetPasswordData.newPassword !== resetPasswordData.confirmPassword) newErrors.resetConfirmPassword = 'Las contraseñas no coinciden';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }
    
    try {
      // POST /auth/reset-password
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: resetPasswordData.token,
          newPassword: resetPasswordData.newPassword
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        showAlert('success', '¡Contraseña restablecida exitosamente!');
        setCurrentView('auth');
        setActiveTab('login');
      } else {
        showAlert('error', data.message || 'Error al restablecer contraseña');
      }
    } catch (error) {
      showAlert('error', 'Error de conexión. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyEmail = async () => {
    setIsLoading(true);
    
    const newErrors = {};
    if (!verificationData.token) newErrors.verificationToken = 'Código de verificación requerido';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }
    
    try {
      // POST /auth/verify-email
      const response = await fetch(`${API_BASE_URL}/auth/verify-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: verificationData.token
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        showAlert('success', '¡Email verificado exitosamente! Ya puedes iniciar sesión.');
        setCurrentView('auth');
        setActiveTab('login');
      } else {
        showAlert('error', data.message || 'Error al verificar email');
      }
    } catch (error) {
      showAlert('error', 'Error de conexión. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setIsLoading(true);
    
    try {
      // POST /auth/send-verification-email (requiere autenticación)
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/auth/send-verification-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (response.ok) {
        showAlert('success', 'Email de verificación reenviado.');
      } else {
        showAlert('error', data.message || 'Error al reenviar email');
      }
    } catch (error) {
      showAlert('error', 'Error de conexión. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const goBack = () => {
    setCurrentView('auth');
    setErrors({});
  };
  
  return (
    <div className="min-h-screen h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 flex items-center justify-center p-4 overflow-auto">
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
          {/* Formulario principal de Auth */}
          {currentView === 'auth' && (
            <>
              <CardHeader className="pb-4">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="login" className="font-medium">Iniciar Sesión</TabsTrigger>
                    <TabsTrigger value="register" className="font-medium">Registrarse</TabsTrigger>
                  </TabsList>
                  
                  {/* Tab de Login */}
                  <TabsContent value="login">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="login-email">Email o RFC</Label>
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
                      </div>
                      
                      <Button 
                        onClick={handleLogin}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2"
                        disabled={isLoading}
                      >
                        {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                      </Button>

                      {/* Divider */}
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-background px-2 text-muted-foreground">O continúa con</span>
                        </div>
                      </div>

                      {/* Google Login Button */}
                      <Button 
                        onClick={handleGoogleLogin}
                        variant="outline"
                        className="w-full font-medium py-2"
                        disabled={isLoading}
                      >
                        <Chrome className="w-4 h-4 mr-2" />
                        Iniciar con Google
                      </Button>
                      
                      <div className="text-center">
                        <button 
                          onClick={() => setCurrentView('forgot-password')}
                          className="text-sm text-blue-600 hover:underline"
                        >
                          ¿Olvidaste tu contraseña?
                        </button>
                      </div>
                    </div>
                  </TabsContent>
                  
                  {/* Tab de Registro */}
                  <TabsContent value="register">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
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
                              placeholder="Pérez García"
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
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="phone">Teléfono</Label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              id="phone"
                              name="phone"
                              type="tel"
                              placeholder="5551234567"
                              value={registerData.phone}
                              onChange={handleRegisterChange}
                              maxLength={10}
                              className={`pl-10 ${errors.phone ? 'border-red-500' : ''}`}
                            />
                          </div>
                          {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="rfc">RFC</Label>
                          <div className="relative">
                            <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              id="rfc"
                              name="rfc"
                              type="text"
                              placeholder="XAXX010101000"
                              value={registerData.rfc}
                              onChange={handleRegisterChange}
                              maxLength={13}
                              className={`pl-10 ${errors.rfc ? 'border-red-500' : ''}`}
                            />
                          </div>
                          {errors.rfc && <p className="text-xs text-red-500">{errors.rfc}</p>}
                        </div>
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
            </>
          )}

          {/* Forgot Password View */}
          {currentView === 'forgot-password' && (
            <CardHeader className="pb-4">
              <div className="flex items-center mb-4">
                <button onClick={goBack} className="text-blue-600 hover:text-blue-800 mr-2">
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <h2 className="text-xl font-semibold">Recuperar Contraseña</h2>
              </div>
              
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Ingresa tu email para recibir un enlace de recuperación de contraseña.
                </p>
                
                <div className="space-y-2">
                  <Label htmlFor="forgot-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="forgot-email"
                      name="email"
                      type="email"
                      placeholder="usuario@correo.com"
                      value={forgotPasswordData.email}
                      onChange={handleForgotPasswordChange}
                      className={`pl-10 ${errors.forgotEmail ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {errors.forgotEmail && <p className="text-sm text-red-500">{errors.forgotEmail}</p>}
                </div>
                
                <Button 
                  onClick={handleForgotPassword}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2"
                  disabled={isLoading}
                >
                  {isLoading ? 'Enviando...' : 'Enviar Enlace de Recuperación'}
                </Button>
              </div>
            </CardHeader>
          )}

          {/* Reset Password View */}
          {currentView === 'reset-password' && (
            <CardHeader className="pb-4">
              <div className="flex items-center mb-4">
                <button onClick={goBack} className="text-blue-600 hover:text-blue-800 mr-2">
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <h2 className="text-xl font-semibold">Restablecer Contraseña</h2>
              </div>
              
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Ingresa el código que recibiste en tu email y tu nueva contraseña.
                </p>
                
                <div className="space-y-2">
                  <Label htmlFor="reset-token">Código de Recuperación</Label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="reset-token"
                      name="token"
                      type="text"
                      placeholder="Código del email"
                      value={resetPasswordData.token}
                      onChange={handleResetPasswordChange}
                      className={`pl-10 ${errors.resetToken ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {errors.resetToken && <p className="text-sm text-red-500">{errors.resetToken}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="new-password">Nueva Contraseña</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="new-password"
                      name="newPassword"
                      type={showPassword.newPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={resetPasswordData.newPassword}
                      onChange={handleResetPasswordChange}
                      className={`pl-10 pr-10 ${errors.resetPassword ? 'border-red-500' : ''}`}
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('newPassword')}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword.newPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.resetPassword && <p className="text-sm text-red-500">{errors.resetPassword}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirm-new-password">Confirmar Nueva Contraseña</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="confirm-new-password"
                      name="confirmPassword"
                      type={showPassword.confirmNewPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={resetPasswordData.confirmPassword}
                      onChange={handleResetPasswordChange}
                      className={`pl-10 pr-10 ${errors.resetConfirmPassword ? 'border-red-500' : ''}`}
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('confirmNewPassword')}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword.confirmNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.resetConfirmPassword && <p className="text-sm text-red-500">{errors.resetConfirmPassword}</p>}
                </div>
                
                <Button 
                  onClick={handleResetPassword}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2"
                  disabled={isLoading}
                >
                  {isLoading ? 'Restableciendo...' : 'Restablecer Contraseña'}
                </Button>
              </div>
            </CardHeader>
          )}

          {/* Email Verification View */}
          {currentView === 'verify-email' && (
            <CardHeader className="pb-4">
              <div className="flex items-center mb-4">
                <button onClick={goBack} className="text-blue-600 hover:text-blue-800 mr-2">
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <h2 className="text-xl font-semibold">Verificar Email</h2>
              </div>
              
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Se ha enviado un código de verificación a{' '}
                  <span className="font-medium">{verificationData.email}</span>
                </p>
                
                <div className="space-y-2">
                  <Label htmlFor="verification-token">Código de Verificación</Label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="verification-token"
                      name="token"
                      type="text"
                      placeholder="Código del email"
                      value={verificationData.token}
                      onChange={handleVerificationChange}
                      className={`pl-10 ${errors.verificationToken ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {errors.verificationToken && <p className="text-sm text-red-500">{errors.verificationToken}</p>}
                </div>
                
                <Button 
                  onClick={handleVerifyEmail}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2"
                  disabled={isLoading}
                >
                  {isLoading ? 'Verificando...' : 'Verificar Email'}
                </Button>
                
                <div className="text-center">
                  <button 
                    onClick={handleResendVerification}
                    className="text-sm text-blue-600 hover:underline"
                    disabled={isLoading}
                  >
                    ¿No recibiste el código? Reenviar
                  </button>
                </div>
              </div>
            </CardHeader>
          )}
          
          <CardFooter className="pt-0">
            <div className="w-full text-center text-sm text-gray-500">
              <p>© 2024 SAT - Todos los derechos reservados</p>
              <p className="mt-1">Servicio de Administración Tributaria</p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default SATAuthComponent;