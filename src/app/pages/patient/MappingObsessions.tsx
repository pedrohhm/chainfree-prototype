import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { useApp } from '../../context/AppContext';
import { Brain, Plus, Trash2, Edit, ArrowLeft } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../components/ui/dialog';

const obsessionTypes = [
  'Agressão / Violência',
  'Sexual / Religiosa',
  'Simetria / Ordem',
  'Contaminação',
  'Acumulação',
  'Dúvida excessiva',
  'Somática',
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

export default function MappingObsessions() {
  const navigate = useNavigate();
  const { obsessions, addObsession, updateObsession, deleteObsession } = useApp();
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
    if (!type) { setTypeError('Selecione o tipo de obsessão.'); valid = false; }
    else setTypeError('');
    if (!description.trim()) { setDescError('Descreva a obsessão.'); valid = false; }
    else setDescError('');
    return valid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (editingId) {
      updateObsession(editingId, { type, description, intensity: parseInt(intensity) });
      setLiveMessage('Obsessão atualizada com sucesso.');
    } else {
      addObsession({ type, description, intensity: parseInt(intensity) });
      setLiveMessage('Obsessão registrada com sucesso.');
    }
    resetForm();
    setIsOpen(false);
  };

  const handleEdit = (obs: ReturnType<typeof useApp>['obsessions'][number]) => {
    setEditingId(obs.id);
    setType(obs.type);
    setDescription(obs.description);
    setIntensity(obs.intensity.toString());
    setIsOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteObsession(id);
    setLiveMessage('Obsessão excluída.');
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
              Obsessões
            </h1>
            <p className="text-sm" style={{ color: '#6B7280' }}>
              Pensamentos, medos ou imagens intrusivos
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
              style={{ backgroundColor: '#7C3AED' }}
              className="text-white min-h-[48px] flex-shrink-0"
              aria-label="Adicionar nova obsessão"
            >
              <Plus className="w-4 h-4 mr-2" aria-hidden="true" />
              Adicionar
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? 'Editar' : 'Registrar'} Obsessão</DialogTitle>
              <DialogDescription>
                {editingId
                  ? 'Edite os dados da obsessão registrada.'
                  : 'Adicione uma nova obsessão ao seu mapeamento.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* Tipo */}
              <div className="space-y-1">
                <Label htmlFor="obs-type">
                  Tipo <span aria-hidden="true" className="text-red-500">*</span>
                  <span className="sr-only">(obrigatório)</span>
                </Label>
                <Select
                  value={type}
                  onValueChange={(v) => { setType(v); setTypeError(''); }}
                >
                  <SelectTrigger
                    id="obs-type"
                    className="min-h-[48px]"
                    aria-required="true"
                    aria-invalid={!!typeError}
                    aria-describedby={typeError ? 'obs-type-error' : undefined}
                  >
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {obsessionTypes.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {typeError && (
                  <p id="obs-type-error" role="alert" className="text-sm text-red-600 flex items-center gap-1">
                    <span aria-hidden="true">⚠</span> {typeError}
                  </p>
                )}
              </div>

              {/* Descrição */}
              <div className="space-y-1">
                <Label htmlFor="obs-description">
                  Descrição <span aria-hidden="true" className="text-red-500">*</span>
                  <span className="sr-only">(obrigatório)</span>
                </Label>
                <Textarea
                  id="obs-description"
                  placeholder="Descreva a obsessão..."
                  value={description}
                  onChange={(e) => { setDescription(e.target.value); setDescError(''); }}
                  rows={4}
                  aria-required="true"
                  aria-invalid={!!descError}
                  aria-describedby={descError ? 'obs-desc-error' : undefined}
                />
                {descError && (
                  <p id="obs-desc-error" role="alert" className="text-sm text-red-600 flex items-center gap-1">
                    <span aria-hidden="true">⚠</span> {descError}
                  </p>
                )}
              </div>

              {/* Intensidade */}
              <div className="space-y-2">
                <Label htmlFor="obs-intensity">
                  Nível de Intensidade:{' '}
                  <span aria-live="polite">
                    {intensity} — {intensityLabel(parseInt(intensity))}
                  </span>
                </Label>
                <input
                  id="obs-intensity"
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

      {obsessions.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Brain
              className="w-16 h-16 mx-auto mb-4"
              style={{ color: '#7C3AED', opacity: 0.3 }}
              aria-hidden="true"
            />
            <CardTitle className="mb-2" style={{ color: '#1F2937' }}>
              Nenhuma obsessão registrada
            </CardTitle>
            <CardDescription className="mb-4">
              Comece adicionando suas obsessões para acompanhar melhor o tratamento
            </CardDescription>
            <Button
              onClick={() => setIsOpen(true)}
              style={{ backgroundColor: '#7C3AED' }}
              className="text-white min-h-[48px]"
              aria-label="Adicionar primeira obsessão"
            >
              <Plus className="w-4 h-4 mr-2" aria-hidden="true" />
              Adicionar Primeira Obsessão
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          role="list"
          aria-label={`${obsessions.length} obsessão${obsessions.length !== 1 ? 'ões' : ''} registrada${obsessions.length !== 1 ? 's' : ''}`}
        >
          {obsessions.map((obs) => (
            <Card
              key={obs.id}
              className="hover:shadow-lg transition-shadow"
              role="listitem"
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: '#EDE9FE' }}
                      aria-hidden="true"
                    >
                      <Brain className="w-5 h-5" style={{ color: '#7C3AED' }} />
                    </div>
                    <div className="min-w-0">
                      <CardTitle className="text-base truncate" style={{ color: '#1F2937' }}>
                        {obs.type}
                      </CardTitle>
                      <CardDescription className="text-xs">
                        <time dateTime={new Date(obs.createdAt).toISOString()}>
                          {new Date(obs.createdAt).toLocaleDateString('pt-BR')}
                        </time>
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="min-h-[48px] min-w-[48px] hover:bg-blue-50"
                      aria-label={`Editar obsessão: ${obs.type}`}
                      onClick={() => handleEdit(obs)}
                    >
                      <Edit className="w-4 h-4 text-blue-600" aria-hidden="true" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="min-h-[48px] min-w-[48px] hover:bg-red-50"
                      aria-label={`Excluir obsessão: ${obs.type}`}
                      onClick={() => handleDelete(obs.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" aria-hidden="true" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-3" style={{ color: '#6B7280' }}>
                  {obs.description}
                </p>
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span style={{ color: '#6B7280' }}>Intensidade:</span>
                    <span
                      className="font-semibold"
                      style={{ color: intensityColor(obs.intensity) }}
                    >
                      {obs.intensity}/10 — {intensityLabel(obs.intensity)}
                    </span>
                  </div>
                  <div
                    className="w-full h-2 rounded-full overflow-hidden"
                    style={{ backgroundColor: '#E5E7EB' }}
                    role="img"
                    aria-label={`Intensidade ${obs.intensity} de 10`}
                  >
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${(obs.intensity / 10) * 100}%`,
                        backgroundColor: intensityColor(obs.intensity),
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card className="mt-8" style={{ borderColor: '#7C3AED', borderLeftWidth: '4px' }}>
        <CardHeader>
          <CardTitle className="text-base" style={{ color: '#1F2937' }}>O que são obsessões?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm" style={{ color: '#6B7280' }}>
            Obsessões são pensamentos, medos ou imagens intrusivos e repetitivos que persistem mesmo quando você tenta
            ignorá-los. Registrar e nomear suas obsessões é um passo fundamental para a terapia de Exposição e Prevenção
            de Resposta (EPR).
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
