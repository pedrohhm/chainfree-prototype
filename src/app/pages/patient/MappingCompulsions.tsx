import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { useApp } from '../../context/AppContext';
import { Zap, Plus, Trash2, Edit, ArrowLeft } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../components/ui/dialog';

const compulsionTypes = [
  'Limpeza e Lavagem',
  'Verificação',
  'Ordem e Simetria',
  'Contagem',
  'Acumulação',
  'Repetição',
  'Mental',
  'Outro',
];

const intensityColor = (value: number) => {
  if (value <= 3) return '#10B981';
  if (value <= 6) return '#F59E0B';
  return '#EF4444';
};

const intensityLabel = (value: number) => {
  if (value <= 3) return 'Baixa';
  if (value <= 6) return 'Moderada';
  return 'Alta';
};

export default function MappingCompulsions() {
  const navigate = useNavigate();
  const { compulsions, addCompulsion, updateCompulsion, deleteCompulsion } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [intensity, setIntensity] = useState('5');
  const [typeError, setTypeError] = useState('');
  const [descError, setDescError] = useState('');
  const [liveMessage, setLiveMessage] = useState('');

  const resetForm = () => {
    setType('');
    setDescription('');
    setIntensity('5');
    setEditingId(null);
    setTypeError('');
    setDescError('');
  };

  const validate = () => {
    let valid = true;
    if (!type) { setTypeError('Selecione o tipo de compulsão.'); valid = false; }
    else setTypeError('');
    if (!description.trim()) { setDescError('Descreva a compulsão.'); valid = false; }
    else setDescError('');
    return valid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (editingId) {
      updateCompulsion(editingId, { type, description, intensity: parseInt(intensity) });
      setLiveMessage('Compulsão atualizada com sucesso.');
    } else {
      addCompulsion({ type, description, intensity: parseInt(intensity) });
      setLiveMessage('Compulsão registrada com sucesso.');
    }
    resetForm();
    setIsOpen(false);
  };

  const handleEdit = (c: ReturnType<typeof useApp>['compulsions'][number]) => {
    setEditingId(c.id);
    setType(c.type);
    setDescription(c.description);
    setIntensity(c.intensity.toString());
    setIsOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteCompulsion(id);
    setLiveMessage('Compulsão excluída.');
  };

  return (
    <div className="p-4 w-full max-w-full overflow-x-hidden">
      {/* Live region for screen reader announcements (RA10) */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {liveMessage}
      </div>

      <div className="mb-6 flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Voltar ao mapeamento"
            className="min-h-[48px] min-w-[48px] flex-shrink-0"
            onClick={() => navigate('/patient/mapping')}
          >
            <ArrowLeft className="w-5 h-5" aria-hidden="true" />
          </Button>
          <div className="min-w-0">
            <h1 className="text-2xl font-bold truncate" style={{ color: '#1F2937' }}>
              Compulsões
            </h1>
            <p className="text-sm" style={{ color: '#6B7280' }}>
              Comportamentos ou rituais repetitivos
            </p>
          </div>
        </div>

        <Dialog
          open={isOpen}
          onOpenChange={(open) => {
            setIsOpen(open);
            if (!open) resetForm();
          }}
        >
          <DialogTrigger asChild>
            <Button
              style={{ backgroundColor: '#8B5CF6' }}
              className="text-white min-h-[48px] flex-shrink-0"
              aria-label="Adicionar nova compulsão"
            >
              <Plus className="w-4 h-4 mr-2" aria-hidden="true" />
              Adicionar
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? 'Editar' : 'Registrar'} Compulsão</DialogTitle>
              <DialogDescription>
                {editingId
                  ? 'Edite os dados da compulsão registrada.'
                  : 'Adicione uma nova compulsão ao seu mapeamento.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* Tipo */}
              <div className="space-y-1">
                <Label htmlFor="comp-type">
                  Tipo <span aria-hidden="true" className="text-red-500">*</span>
                  <span className="sr-only">(obrigatório)</span>
                </Label>
                <Select
                  value={type}
                  onValueChange={(v) => { setType(v); setTypeError(''); }}
                >
                  <SelectTrigger
                    id="comp-type"
                    className="min-h-[48px]"
                    aria-required="true"
                    aria-invalid={!!typeError}
                    aria-describedby={typeError ? 'comp-type-error' : undefined}
                  >
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {compulsionTypes.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {typeError && (
                  <p id="comp-type-error" role="alert" className="text-sm text-red-600 flex items-center gap-1">
                    <span aria-hidden="true">⚠</span> {typeError}
                  </p>
                )}
              </div>

              {/* Descrição */}
              <div className="space-y-1">
                <Label htmlFor="comp-description">
                  Descrição <span aria-hidden="true" className="text-red-500">*</span>
                  <span className="sr-only">(obrigatório)</span>
                </Label>
                <Textarea
                  id="comp-description"
                  placeholder="Descreva a compulsão..."
                  value={description}
                  onChange={(e) => { setDescription(e.target.value); setDescError(''); }}
                  rows={4}
                  aria-required="true"
                  aria-invalid={!!descError}
                  aria-describedby={descError ? 'comp-desc-error' : undefined}
                />
                {descError && (
                  <p id="comp-desc-error" role="alert" className="text-sm text-red-600 flex items-center gap-1">
                    <span aria-hidden="true">⚠</span> {descError}
                  </p>
                )}
              </div>

              {/* Intensidade */}
              <div className="space-y-2">
                <Label htmlFor="comp-intensity">
                  Nível de Intensidade:{' '}
                  <span aria-live="polite">
                    {intensity} — {intensityLabel(parseInt(intensity))}
                  </span>
                </Label>
                <input
                  id="comp-intensity"
                  type="range"
                  min="0"
                  max="10"
                  value={intensity}
                  onChange={(e) => setIntensity(e.target.value)}
                  className="w-full min-h-[48px] accent-purple-600"
                  aria-valuemin={0}
                  aria-valuemax={10}
                  aria-valuenow={parseInt(intensity)}
                  aria-valuetext={`${intensity} — ${intensityLabel(parseInt(intensity))}`}
                />
                <div className="flex justify-between text-xs" style={{ color: '#6B7280' }} aria-hidden="true">
                  <span>0 Mínima</span>
                  <span>5 Moderada</span>
                  <span>10 Máxima</span>
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  className="min-h-[48px]"
                  onClick={() => { setIsOpen(false); resetForm(); }}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  style={{ backgroundColor: '#10B981' }}
                  className="text-white min-h-[48px]"
                >
                  {editingId ? 'Atualizar' : 'Salvar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {compulsions.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Zap
              className="w-16 h-16 mx-auto mb-4"
              style={{ color: '#8B5CF6', opacity: 0.3 }}
              aria-hidden="true"
            />
            <CardTitle className="mb-2" style={{ color: '#1F2937' }}>
              Nenhuma compulsão registrada
            </CardTitle>
            <CardDescription className="mb-4">
              Comece adicionando suas compulsões para acompanhar melhor o tratamento
            </CardDescription>
            <Button
              onClick={() => setIsOpen(true)}
              style={{ backgroundColor: '#8B5CF6' }}
              className="text-white min-h-[48px]"
              aria-label="Adicionar primeira compulsão"
            >
              <Plus className="w-4 h-4 mr-2" aria-hidden="true" />
              Adicionar Primeira Compulsão
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          role="list"
          aria-label={`${compulsions.length} compulsão${compulsions.length !== 1 ? 'ões' : ''} registrada${compulsions.length !== 1 ? 's' : ''}`}
        >
          {compulsions.map((comp) => (
            <Card
              key={comp.id}
              className="hover:shadow-lg transition-shadow"
              role="listitem"
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: '#F3E8FF' }}
                      aria-hidden="true"
                    >
                      <Zap className="w-5 h-5" style={{ color: '#8B5CF6' }} />
                    </div>
                    <div className="min-w-0">
                      <CardTitle className="text-base truncate" style={{ color: '#1F2937' }}>
                        {comp.type}
                      </CardTitle>
                      <CardDescription className="text-xs">
                        <time dateTime={new Date(comp.createdAt).toISOString()}>
                          {new Date(comp.createdAt).toLocaleDateString('pt-BR')}
                        </time>
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="min-h-[48px] min-w-[48px] hover:bg-blue-50"
                      aria-label={`Editar compulsão: ${comp.type}`}
                      onClick={() => handleEdit(comp)}
                    >
                      <Edit className="w-4 h-4 text-blue-600" aria-hidden="true" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="min-h-[48px] min-w-[48px] hover:bg-red-50"
                      aria-label={`Excluir compulsão: ${comp.type}`}
                      onClick={() => handleDelete(comp.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" aria-hidden="true" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-3" style={{ color: '#6B7280' }}>
                  {comp.description}
                </p>
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span style={{ color: '#6B7280' }}>Intensidade:</span>
                    <span
                      className="font-semibold"
                      style={{ color: intensityColor(comp.intensity) }}
                    >
                      {comp.intensity}/10 — {intensityLabel(comp.intensity)}
                    </span>
                  </div>
                  <div
                    className="w-full h-2 rounded-full overflow-hidden"
                    style={{ backgroundColor: '#E5E7EB' }}
                    role="img"
                    aria-label={`Intensidade ${comp.intensity} de 10`}
                  >
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${(comp.intensity / 10) * 100}%`,
                        backgroundColor: intensityColor(comp.intensity),
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card className="mt-8" style={{ borderColor: '#8B5CF6', borderLeftWidth: '4px' }}>
        <CardHeader>
          <CardTitle className="text-base" style={{ color: '#1F2937' }}>O que são compulsões?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm" style={{ color: '#6B7280' }}>
            Compulsões são comportamentos ou rituais repetitivos realizados para reduzir o desconforto causado pelas
            obsessões. Identificá-las é essencial para a prática dos exercícios de Exposição e Prevenção de Resposta (EPR).
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
