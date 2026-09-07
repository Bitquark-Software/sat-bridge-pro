import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarIcon, RefreshCw, Square } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const API = 'http://localhost:3000/v1/descarga-masiva';
const authHeaders = (): HeadersInit => {
  const token = localStorage.getItem('token') || localStorage.getItem('access_token') || '';
  return { Authorization: `Bearer ${token}` };
};
const money = (n: number) => n.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
const toISO = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const parseISO = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
};
const fmt = (iso: string) => format(parseISO(iso), 'd MMM yyyy', { locale: es });
const todayISO = () => toISO(new Date());
const yearStartISO = () => `${new Date().getFullYear()}-01-01`;

const selectClass =
  'border-input h-9 w-full rounded-md border bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]';

type Job = {
  uuid: string;
  status: string;
  month?: string;
  message?: string;
  error?: string;
  logs?: string[];
  year: number;
};
type SyncData = { cfdi_count: number; can_sync: boolean; job: Job | null };

const DescargaMasiva = () => {
  const navigate = useNavigate();
  const [sync, setSync] = useState<SyncData | null>(null);
  const [posting, setPosting] = useState(false);
  const [from, setFrom] = useState(yearStartISO);
  const [to, setTo] = useState(todayISO);
  const [tipo, setTipo] = useState<'I' | 'E'>('I');
  const [entra, setEntra] = useState<'all' | 'yes' | 'no'>('all');
  const [tab, setTab] = useState('facturas');
  const [banner, setBanner] = useState('');

  const job = sync?.job;
  const running = job?.status === 'queued' || job?.status === 'running';
  const failed = job?.status === 'failed' || job?.status === 'aborted';
  const count = sync?.cfdi_count ?? null;

  const load = async () => {
    const token = localStorage.getItem('token') || localStorage.getItem('access_token');
    if (!token) {
      navigate('/login');
      return;
    }
    const res = await fetch(`${API}/sync`, { headers: authHeaders() });
    if (res.status === 401) {
      navigate('/login');
      return;
    }
    const json = await res.json().catch(() => ({}));
    if (!res.ok) return;
    const data = json.data as SyncData;
    setSync(data);
    if (data.job?.status === 'failed' || data.job?.status === 'aborted') setTab('consola');
  };

  useEffect(() => {
    load().catch(() => setSync({ cfdi_count: 0, can_sync: false, job: null }));
  }, []);

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      load().catch(() => {});
    }, 2000);
    return () => window.clearInterval(id);
  }, [running]);

  const start = async () => {
    if (!sync?.can_sync || posting) return;
    setPosting(true);
    setBanner('');
    try {
      const res = await fetch(`${API}/sync`, { method: 'POST', headers: authHeaders() });
      if (res.status === 401) {
        navigate('/login');
        return;
      }
      const json = await res.json().catch(() => ({}));
      if (res.ok) setSync(json.data);
      else {
        await load();
        setBanner(json.message || 'No se pudo iniciar la sincronización');
      }
    } finally {
      setPosting(false);
    }
  };

  const abort = async () => {
    if (!running || posting) return;
    setPosting(true);
    setBanner('');
    try {
      const res = await fetch(`${API}/sync/abort`, { method: 'POST', headers: authHeaders() });
      if (res.status === 401) {
        navigate('/login');
        return;
      }
      const json = await res.json().catch(() => ({}));
      if (res.ok) {
        setSync(json.data);
        setTab('consola');
      } else {
        await load();
        setBanner(json.message || 'No se pudo abortar el job');
      }
    } finally {
      setPosting(false);
    }
  };

  const rows: { fecha: string; folio: string; emisor: string; receptor: string; tipo: string; entra: string; total: number }[] = [];
  const total = rows.reduce((s, r) => s + r.total, 0);
  const busy = running || posting;
  const disabled = !sync?.can_sync || busy;

  return (
    <div id="descarga-masiva" className="space-y-6">
      {banner && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{banner}</AlertDescription>
        </Alert>
      )}
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div>
            <CardTitle>CFDIs hasta hoy</CardTitle>
            <CardDescription>Facturas registradas al {new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}</CardDescription>
          </div>
          <div className="flex gap-2">
            {running && (
              <Button type="button" variant="destructive" onClick={abort} disabled={posting}>
                <Square />
                Abortar
              </Button>
            )}
            <Button onClick={start} disabled={disabled} aria-busy={busy}>
              <RefreshCw className={busy ? 'animate-spin' : ''} />
              {job?.status === 'done' ? 'Sincronizado' : busy ? 'Sincronizando…' : 'Sincronizar'}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {count === null ? (
            <div className="h-10 w-24 bg-muted rounded animate-pulse" />
          ) : (
            <p className="text-4xl font-semibold tabular-nums">{count}</p>
          )}
          {job?.message && (
            <p className="text-muted-foreground text-sm" aria-live="polite">
              {job.message}
            </p>
          )}
        </CardContent>
      </Card>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="facturas">Facturas</TabsTrigger>
          <TabsTrigger value="consola">Consola</TabsTrigger>
        </TabsList>
        <TabsContent value="facturas">
          <Card>
            <CardHeader>
              <CardTitle>Facturas</CardTitle>
              <CardDescription>Filtra por periodo, tipo y si entra al cálculo</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="periodo">Periodo</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button id="periodo" variant="outline" className="w-full justify-start font-normal">
                        <CalendarIcon />
                        {from && to ? `${fmt(from)} – ${fmt(to)}` : 'Seleccionar periodo'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="range"
                        locale={es}
                        numberOfMonths={2}
                        selected={{ from: parseISO(from), to: parseISO(to) }}
                        onSelect={(r) => {
                          if (r?.from) setFrom(toISO(r.from));
                          if (r?.to) setTo(toISO(r.to));
                        }}
                        disabled={{ after: new Date() }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo de factura</Label>
                  <select id="tipo" className={selectClass} value={tipo} onChange={(e) => setTipo(e.target.value as 'I' | 'E')}>
                    <option value="I">Ingreso</option>
                    <option value="E">Gasto</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="entra">Entra</Label>
                  <select id="entra" className={selectClass} value={entra} onChange={(e) => setEntra(e.target.value as 'all' | 'yes' | 'no')}>
                    <option value="all">Todos</option>
                    <option value="yes">Entra</option>
                    <option value="no">No entra</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto rounded-md border">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 sticky top-0">
                    <tr className="text-left">
                      <th className="px-3 py-2 font-medium">Fecha</th>
                      <th className="px-3 py-2 font-medium">Folio</th>
                      <th className="px-3 py-2 font-medium">Emisor</th>
                      <th className="px-3 py-2 font-medium">Receptor</th>
                      <th className="px-3 py-2 font-medium">Tipo</th>
                      <th className="px-3 py-2 font-medium">Entra</th>
                      <th className="px-3 py-2 font-medium text-right">Monto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {count === null
                      ? Array.from({ length: 5 }, (_, i) => (
                          <tr key={i} className="border-t">
                            {Array.from({ length: 7 }, (_, j) => (
                              <td key={j} className="px-3 py-3">
                                <div className={`h-4 bg-muted rounded animate-pulse ${j === 6 ? 'ml-auto w-16' : 'w-24'}`} />
                              </td>
                            ))}
                          </tr>
                        ))
                      : rows.length === 0
                        ? (
                          <tr className="border-t">
                            <td colSpan={7} className="px-3 py-8 text-center text-muted-foreground">
                              No hay CFDIs en este periodo
                            </td>
                          </tr>
                        )
                        : rows.map((r) => (
                          <tr key={r.folio} className="border-t">
                            <td className="px-3 py-2">{r.fecha}</td>
                            <td className="px-3 py-2 font-mono text-xs">{r.folio}</td>
                            <td className="px-3 py-2">{r.emisor}</td>
                            <td className="px-3 py-2">{r.receptor}</td>
                            <td className="px-3 py-2">{r.tipo}</td>
                            <td className="px-3 py-2">{r.entra}</td>
                            <td className="px-3 py-2 text-right tabular-nums">{money(r.total)}</td>
                          </tr>
                        ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t bg-muted/30 font-medium">
                      <td colSpan={6} className="px-3 py-2 text-right">Total</td>
                      <td className="px-3 py-2 text-right tabular-nums">{money(total)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="consola">
          <Card>
            <CardHeader>
              <CardTitle>Consola del job</CardTitle>
              <CardDescription>Historial de la extracción SAT</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {failed && job?.error && (
                <Alert variant="destructive">
                  <AlertTitle>Falló la extracción</AlertTitle>
                  <AlertDescription className="font-mono text-xs whitespace-pre-wrap">{job.error}</AlertDescription>
                </Alert>
              )}
              <pre className="bg-muted max-h-96 overflow-auto rounded-md p-4 text-xs leading-6">
                {(job?.logs && job.logs.length > 0) ? job.logs.join('\n') : 'Sin logs todavía'}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DescargaMasiva;
