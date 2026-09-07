import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, CheckCircle, AlertCircle, Trash2, Plus, Key, FileText } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const API = 'http://localhost:3000/v1/datos-fiscales';

const authHeaders = (): HeadersInit => {
  const token = localStorage.getItem('token') || localStorage.getItem('access_token') || '';
  return { Authorization: `Bearer ${token}` };
};

type FielRecord = { rfc: string; created_at: string; updated_at: string };

const fmtDate = (iso?: string) =>
  iso ? new Date(iso).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' }) : '—';

const MiFiel = () => {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<'loading' | 'empty' | 'ready' | 'form'>('loading');
  const [fiel, setFiel] = useState<FielRecord | null>(null);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [banner, setBanner] = useState('');
  const [formData, setFormData] = useState({ rfc: '', password: '', keyFile: null as File | null, cerFile: null as File | null });

  const loadFiel = async () => {
    const token = localStorage.getItem('token') || localStorage.getItem('access_token');
    if (!token) {
      navigate('/login');
      return;
    }
    const res = await fetch(API, { headers: authHeaders() });
    if (res.status === 401) {
      navigate('/login');
      return;
    }
    if (res.status === 404) {
      setFiel(null);
      setPhase('empty');
      return;
    }
    const json = await res.json();
    if (!res.ok) {
      setBanner(json.message || 'No se pudo cargar la FIEL');
      setPhase('empty');
      return;
    }
    const d = json.data;
    setFiel({ rfc: d.rfc, created_at: d.created_at, updated_at: d.updated_at });
    setPhase('ready');
  };

  useEffect(() => {
    loadFiel().catch(() => {
      setBanner('Error de conexión al servidor');
      setPhase('empty');
    });
  }, []);

  const validateRFC = (rfc: string) => /^([A-ZÑ&]{3,4}\d{6}[A-V1-9][A-Z1-9][0-9A])$/.test(rfc.toUpperCase());

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: name === 'rfc' ? value.toUpperCase() : value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, fileType: 'keyFile' | 'cerFile') => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, [fileType]: file }));
    if (errors[fileType]) setErrors((prev) => ({ ...prev, [fileType]: '' }));
  };

  const validateForm = () => {
    const next: Record<string, string> = {};
    if (!formData.rfc.trim()) next.rfc = 'El RFC es requerido';
    else if (!validateRFC(formData.rfc)) next.rfc = 'Formato de RFC inválido';
    if (!formData.password.trim()) next.password = 'La contraseña es requerida';
    else if (formData.password.length < 8) next.password = 'La contraseña debe tener al menos 8 caracteres';
    if (!formData.keyFile) next.keyFile = 'Selecciona el archivo .key';
    else if (!formData.keyFile.name.toLowerCase().endsWith('.key')) next.keyFile = 'El archivo debe ser .key';
    if (!formData.cerFile) next.cerFile = 'Selecciona el archivo .cer';
    else if (!formData.cerFile.name.toLowerCase().endsWith('.cer')) next.cerFile = 'El archivo debe ser .cer';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setSaving(true);
    setBanner('');
    try {
      if (fiel) {
        const del = await fetch(API, { method: 'DELETE', headers: authHeaders() });
        if (!del.ok && del.status !== 404) {
          const j = await del.json().catch(() => ({}));
          setBanner(j.message || 'No se pudo reemplazar la FIEL');
          setSaving(false);
          return;
        }
      }
      const body = new FormData();
      body.append('rfc', formData.rfc.trim());
      body.append('password', formData.password);
      body.append('cer_file', formData.cerFile!);
      body.append('key_file', formData.keyFile!);
      const res = await fetch(API, { method: 'POST', headers: authHeaders(), body });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setBanner(json.message || 'Error al registrar la FIEL');
        setSaving(false);
        return;
      }
      setFormData({ rfc: '', password: '', keyFile: null, cerFile: null });
      await loadFiel();
    } catch {
      setBanner('Error de conexión al servidor');
    }
    setSaving(false);
  };

  const handleDeleteFiel = async () => {
    if (!window.confirm('¿Eliminar tu FIEL? Tendrás que cargarla de nuevo.')) return;
    setBanner('');
    const res = await fetch(API, { method: 'DELETE', headers: authHeaders() });
    if (res.status === 401) {
      navigate('/login');
      return;
    }
    if (!res.ok && res.status !== 404) {
      const json = await res.json().catch(() => ({}));
      setBanner(json.message || 'No se pudo eliminar la FIEL');
      return;
    }
    setFiel(null);
    setPhase('empty');
  };

  const bannerAlert = banner ? (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{banner}</AlertDescription>
    </Alert>
  ) : null;

  if (phase === 'loading') {
    return (
      <Card id="fiel" aria-busy="true">
        <CardHeader>
          <div className="h-5 w-40 bg-muted rounded animate-pulse" />
          <div className="h-4 w-72 bg-muted rounded animate-pulse" />
        </CardHeader>
        <CardContent className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <div className="h-3 w-12 bg-muted rounded animate-pulse" />
            <div className="h-7 w-36 bg-muted rounded animate-pulse" />
          </div>
          <div className="space-y-2">
            <div className="h-3 w-20 bg-muted rounded animate-pulse" />
            <div className="h-6 w-44 bg-muted rounded animate-pulse" />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <div className="h-3 w-36 bg-muted rounded animate-pulse" />
            <div className="h-6 w-44 bg-muted rounded animate-pulse" />
          </div>
        </CardContent>
        <CardFooter className="gap-2">
          <div className="h-9 w-36 bg-muted rounded-md animate-pulse" />
          <div className="h-9 w-32 bg-muted rounded-md animate-pulse" />
        </CardFooter>
      </Card>
    );
  }

  if (phase === 'empty') {
    return (
      <div id="fiel">
        {bannerAlert}
        <Card>
          <CardHeader className="items-center text-center">
            <div className="bg-muted mb-2 flex size-14 items-center justify-center rounded-full">
              <Key className="text-muted-foreground size-7" />
            </div>
            <CardTitle>No has cargado tu FIEL</CardTitle>
            <CardDescription>
              Certificado (.cer), clave privada (.key) y contraseña que te dio el SAT.
            </CardDescription>
          </CardHeader>
          <CardFooter className="justify-center">
            <Button onClick={() => { setBanner(''); setPhase('form'); }}>
              <Plus />
              Cargar FIEL
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (phase === 'ready' && fiel) {
    return (
      <div id="fiel" className="space-y-4">
        {bannerAlert}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="size-5 text-green-600" />
              FIEL activa
            </CardTitle>
            <CardDescription>Certificado (.cer), clave (.key) y contraseña registrados</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 sm:grid-cols-2">
            <div>
              <p className="text-muted-foreground text-sm">RFC</p>
              <p className="text-lg font-semibold">{fiel.rfc}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Registrada</p>
              <p>{fmtDate(fiel.created_at)}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-muted-foreground text-sm">Última actualización</p>
              <p>{fmtDate(fiel.updated_at)}</p>
            </div>
          </CardContent>
          <CardFooter className="gap-2">
            <Button onClick={() => { setBanner(''); setPhase('form'); }}>
              <Plus />
              Actualizar FIEL
            </Button>
            <Button variant="destructive" onClick={handleDeleteFiel}>
              <Trash2 />
              Eliminar FIEL
            </Button>
          </CardFooter>
        </Card>
        <Alert>
          <AlertCircle />
          <AlertTitle>Importante</AlertTitle>
          <AlertDescription>No compartas tu contraseña ni los archivos .key / .cer.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div id="fiel">
      {bannerAlert}
      <Card>
        <CardHeader>
          <CardTitle>{fiel ? 'Actualizar FIEL' : 'Cargar FIEL'}</CardTitle>
          <CardDescription>Certificado (.cer), clave privada (.key) y contraseña</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="rfc">RFC</Label>
              <Input
                id="rfc"
                name="rfc"
                value={formData.rfc}
                onChange={handleInputChange}
                placeholder="XAXX010101000"
                maxLength={13}
                autoComplete="off"
                aria-invalid={!!errors.rfc}
              />
              {errors.rfc && <p className="text-destructive text-sm">{errors.rfc}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="fiel-password">Contraseña del certificado</Label>
              <Input
                id="fiel-password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Mínimo 8 caracteres"
                autoComplete="off"
                aria-invalid={!!errors.password}
              />
              {errors.password && <p className="text-destructive text-sm">{errors.password}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="keyFile">Clave privada (.key)</Label>
              <Input id="keyFile" type="file" accept=".key" className="hidden" onChange={(e) => handleFileChange(e, 'keyFile')} />
              <Button type="button" variant="outline" className="w-full" asChild>
                <label htmlFor="keyFile" className="cursor-pointer">
                  <Upload />
                  {formData.keyFile ? formData.keyFile.name : 'Seleccionar archivo .key'}
                </label>
              </Button>
              {errors.keyFile && <p className="text-destructive text-sm">{errors.keyFile}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="cerFile">Certificado (.cer)</Label>
              <Input id="cerFile" type="file" accept=".cer" className="hidden" onChange={(e) => handleFileChange(e, 'cerFile')} />
              <Button type="button" variant="outline" className="w-full" asChild>
                <label htmlFor="cerFile" className="cursor-pointer">
                  <FileText />
                  {formData.cerFile ? formData.cerFile.name : 'Seleccionar archivo .cer'}
                </label>
              </Button>
              {errors.cerFile && <p className="text-destructive text-sm">{errors.cerFile}</p>}
            </div>
            <div className="flex flex-col gap-2">
              <Button type="submit" disabled={saving}>
                <CheckCircle />
                {saving ? 'Guardando FIEL...' : 'Guardar FIEL'}
              </Button>
              <Button type="button" variant="outline" onClick={() => { setPhase(fiel ? 'ready' : 'empty'); setBanner(''); }}>
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default MiFiel;
