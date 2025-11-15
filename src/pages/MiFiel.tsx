import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, CheckCircle, AlertCircle, Trash2, Plus, Key, FileText } from 'lucide-react';

const MiFiel = () => {
  const [hasValidFiel, setHasValidFiel] = useState(true); // Cambia a false para modo sin FIEL
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const [formData, setFormData] = useState({
    rfc: '',
    password: '',
    keyFile: null,
    cerFile: null
  });

  // Datos de FIEL existente (simulado)
  const [fielData, setFielData] = useState({
    rfc: 'XAXX010101000',
    nombre: 'Fernando Pérez',
    vigenciaInicio: '2023-01-15',
    vigenciaFin: '2027-01-15',
    certificadoSerial: 'A1B2C3D4E5F6G7H8'
  });

  const validateRFC = (rfc) => {
    const rfcPattern = /^([A-ZÑ&]{3,4}\d{6}[A-V1-9][A-Z1-9][0-9A])$/;
    return rfcPattern.test(rfc.toUpperCase());
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileChange = (e, fileType) => {
    const file = e.target.files[0];
    setFormData(prev => ({
      ...prev,
      [fileType]: file
    }));
    
    if (errors[fileType]) {
      setErrors(prev => ({
        ...prev,
        [fileType]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.rfc.trim()) {
      newErrors.rfc = 'El RFC es requerido';
    } else if (!validateRFC(formData.rfc)) {
      newErrors.rfc = 'Formato de RFC inválido';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'La contraseña es requerida';
    }

    if (!formData.keyFile) {
      newErrors.keyFile = 'Debes seleccionar el archivo de clave privada (.key)';
    }

    if (!formData.cerFile) {
      newErrors.cerFile = 'Debes seleccionar el archivo de certificado (.cer)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    // Simular validación de FIEL
    setTimeout(() => {
      setLoading(false);
      setHasValidFiel(true);
      setShowForm(false);
      alert('¡FIEL validada exitosamente!');
    }, 2000);
  };

  const handleDeleteFiel = () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar tu FIEL? Deberás cargarla nuevamente.')) {
      setHasValidFiel(false);
      setShowForm(false);
      setFielData(null);
      setFormData({
        rfc: '',
        password: '',
        keyFile: null,
        cerFile: null
      });
    }
  };

    const navigate = useNavigate();

  const handleBackToMenu = () => {
      navigate('/home')
  };

  // Vista cuando NO tiene FIEL validada
  if (!hasValidFiel && !showForm) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Administrar Mi FIEL</h1>
            <p className="text-gray-600">Gestiona tu Firma Electrónica Avanzada del SAT</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Key className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No tienes una FIEL registrada</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Para comenzar a usar los servicios del SAT, necesitas registrar tu Firma Electrónica Avanzada (FIEL).
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium inline-flex items-center gap-2 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Agregar FIEL
            </button>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={handleBackToMenu}
              className="text-gray-600 hover:text-gray-900 inline-flex items-center gap-2 font-medium"
            >
              <ArrowLeft className="w-5 h-5" />
              Regresar al Menú
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Vista cuando tiene FIEL validada
  if (hasValidFiel && !showForm) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Administrar Mi FIEL</h1>
            <p className="text-gray-600">Gestiona tu Firma Electrónica Avanzada del SAT</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
            <div className="bg-green-50 border-b border-green-100 px-6 py-4 flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <div>
                <div className="font-semibold text-green-900">FIEL Activa y Validada</div>
                <div className="text-sm text-green-700">Tu firma electrónica está lista para usar</div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-500 mb-1 block">RFC</label>
                  <div className="text-lg font-semibold text-gray-900">{fielData.rfc}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 mb-1 block">Nombre</label>
                  <div className="text-lg font-semibold text-gray-900">{fielData.nombre}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 mb-1 block">Vigencia Desde</label>
                  <div className="text-gray-900">{new Date(fielData.vigenciaInicio).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 mb-1 block">Vigencia Hasta</label>
                  <div className="text-gray-900">{new Date(fielData.vigenciaFin).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-500 mb-1 block">Número de Serie del Certificado</label>
                  <div className="text-gray-900 font-mono text-sm">{fielData.certificadoSerial}</div>
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium inline-flex items-center gap-2 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Actualizar FIEL
                </button>
                <button
                  onClick={handleDeleteFiel}
                  className="bg-white hover:bg-red-50 text-red-600 border border-red-300 px-5 py-2.5 rounded-lg font-medium inline-flex items-center gap-2 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                  Eliminar FIEL
                </button>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-900">
              <strong className="font-medium">Importante:</strong> Mantén tus archivos de FIEL en un lugar seguro. Nunca compartas tu contraseña de clave privada con nadie.
            </div>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={handleBackToMenu}
              className="text-gray-600 hover:text-gray-900 inline-flex items-center gap-2 font-medium"
            >
              <ArrowLeft className="w-5 h-5" />
              Regresar al Menú
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Vista del Formulario
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {hasValidFiel ? 'Actualizar FIEL' : 'Agregar FIEL'}
          </h1>
          <p className="text-gray-600">Ingresa los datos de tu Firma Electrónica Avanzada del SAT</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                RFC <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="rfc"
                value={formData.rfc}
                onChange={handleInputChange}
                placeholder="Ingresa tu RFC"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                  errors.rfc ? 'border-red-500' : 'border-gray-300'
                }`}
                maxLength={13}
              />
              {errors.rfc && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.rfc}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña de Clave Privada <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Ingresa tu contraseña"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.password && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.password}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Clave Privada (KEY) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept=".key,.pem"
                  onChange={(e) => handleFileChange(e, 'keyFile')}
                  className="hidden"
                  id="keyFile"
                />
                <label
                  htmlFor="keyFile"
                  className={`flex items-center justify-center gap-2 w-full px-4 py-3 border rounded-lg cursor-pointer transition-colors ${
                    errors.keyFile 
                      ? 'border-red-500 bg-red-50 hover:bg-red-100' 
                      : formData.keyFile
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <Upload className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-700">
                    {formData.keyFile ? formData.keyFile.name : 'Seleccionar archivo .key'}
                  </span>
                </label>
              </div>
              {errors.keyFile && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.keyFile}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Certificado (CER) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept=".cer,.crt"
                  onChange={(e) => handleFileChange(e, 'cerFile')}
                  className="hidden"
                  id="cerFile"
                />
                <label
                  htmlFor="cerFile"
                  className={`flex items-center justify-center gap-2 w-full px-4 py-3 border rounded-lg cursor-pointer transition-colors ${
                    errors.cerFile 
                      ? 'border-red-500 bg-red-50 hover:bg-red-100' 
                      : formData.cerFile
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <FileText className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-700">
                    {formData.cerFile ? formData.cerFile.name : 'Seleccionar archivo .cer'}
                  </span>
                </label>
              </div>
              {errors.cerFile && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.cerFile}
                </p>
              )}
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Validando FIEL...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Validar FIEL
                </>
              )}
            </button>

            {hasValidFiel && (
              <button
                onClick={() => setShowForm(false)}
                className="w-full bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 py-3 rounded-lg font-medium transition-colors"
              >
                Cancelar
              </button>
            )}
          </div>
        </div>

        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-amber-900">
            <strong className="font-medium">Nota:</strong> Los archivos .key y .cer son proporcionados por el SAT cuando obtienes tu FIEL. Asegúrate de tener estos archivos antes de continuar.
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={handleBackToMenu}
            className="text-gray-600 hover:text-gray-900 inline-flex items-center gap-2 font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            Regresar al Menú
          </button>
        </div>
      </div>
    </div>
  );
};

export default MiFiel;