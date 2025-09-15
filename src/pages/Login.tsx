import React, { useState } from 'react';
import "../style/login.css"
import { Building2, Eye, EyeOff, Mail, Lock, User, Phone, FileText } from 'lucide-react';
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
  
  // Estados de control
  const [showPassword, setShowPassword] = useState({
    login: false,
    register: false,
    confirm: false
  });
  
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);
  
  // Validaciones
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  const validateRFC = (rfc: string) => {
    const rfcRegex = /^[A-ZÑ&]{3,4}[0-9]{2}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])[A-Z0-9]{2}[0-9A]$/;
    return rfcRegex.test(rfc.toUpperCase());
  };
  
  const validatePhone = (phone: string) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  };
  
  // Manejo de cambios en formularios
  const handleLoginChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setLoginData(prev => ({ ...prev, [name]: value }));
    
    // Validación en tiempo real
    if (name === 'email' && value && !validateEmail(value)) {
      setErrors(prev => ({ ...prev, loginEmail: 'Formato de email inválido' }));
    } else {
      setErrors(prev => ({ ...prev, loginEmail: '' }));
    }
  };
  
  const handleRegisterChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    let processedValue = value;
    
    // Formateo automático para RFC
    if (name === 'rfc') {
      processedValue = value.toUpperCase().replace(/[^A-ZÑ&0-9]/g, '');
    }
    
    // Solo números para teléfono
    if (name === 'phone') {
      processedValue = value.replace(/[^0-9]/g, '');
    }
    
    setRegisterData(prev => ({ ...prev, [name]: processedValue }));
    
    // Validaciones en tiempo real
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
  
  // Manejo de envío de formularios
  const handleLogin = async () => {
    setIsLoading(true);
    
    // Validaciones finales
    const newErrors = {};
    if (!loginData.email) newErrors.loginEmail = 'Email requerido';
    else if (!validateEmail(loginData.email)) newErrors.loginEmail = 'Formato de email inválido';
    if (!loginData.password) newErrors.loginPassword = 'Contraseña requerida';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }
    
    // Simulación de autenticación
    setTimeout(() => {
      setIsLoading(false);
      setAlert({
        show: true,
        type: 'success',
        message: '¡Inicio de sesión exitoso! Bienvenido al portal SAT.'
      });
      
      console.log('Login data:', loginData);
    }, 2000);
  };
  
  const handleRegister = async () => {
    setIsLoading(true);
    
    // Validaciones finales
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
    
    // Simulación de registro
    setTimeout(() => {
      setIsLoading(false);
      setAlert({
        show: true,
        type: 'success',
        message: '¡Registro exitoso! Tu cuenta ha sido creada correctamente.'
      });
      
      // Aquí normalmente harías la llamada a tu API
      console.log('Register data:', registerData);
    }, 2000);
  };
  
  const togglePasswordVisibility = (field: string) => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center p-6 overflow-auto">
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
                  
                  <div className="text-center">
                    <a href="#" className="text-sm text-blue-600 hover:underline">
                      ¿Olvidaste tu contraseña?
                    </a>
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