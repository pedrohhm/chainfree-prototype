import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { useApp } from '../../context/AppContext';
import { Dumbbell, Plus, CheckCircle, Clock, Lightbulb, Star, Trash2, Edit, History } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Badge } from '../../components/ui/badge';
import { Checkbox } from '../../components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../../components/ui/collapsible';
import { Alert, AlertDescription, AlertTitle } from '../../components/ui/alert';

// Dicas de EPR por tipo de compulsão
const eprTips: { [key: string]: string[] } = {
  'Limpeza e Lavagem': [
    'Toque em superfícies consideradas "sujas" sem lavar as mãos imediatamente',
    'Reduza gradualmente o número de lavagens de mãos por dia',
    'Use menos sabão ou reduza o tempo de lavagem',
    'Permita que roupas sejam usadas mais de uma vez antes de lavar',
  ],
  'Verificação': [
    'Verifique portas/janelas apenas uma vez antes de sair',
    'Evite voltar para verificar o fogão ou aparelhos',
    'Confie na memória sem verificar novamente',
    'Delegue a verificação para outra pessoa e confie nela',
  ],
  'Ordem e Simetria': [
    'Deixe objetos ligeiramente fora de alinhamento propositalmente',
    'Permita que quadros ou objetos fiquem tortos',
    'Organize apenas uma vez, sem ajustes repetidos',
    'Aceite que nem tudo precisa estar simétrico',
  ],
  'Contagem': [
    'Interrompa rituais de contagem no meio',
    'Faça atividades sem contar (passos, respirações, etc.)',
    'Permita números "ruins" sem rituais de neutralização',
    'Varie intencionalmente os números usados',
  ],
  'Acumulação': [
    'Descarte um item por dia sem verificar múltiplas vezes',
    'Doe objetos que não foram usados no último ano',
    'Resista ao impulso de guardar "por precaução"',
    'Limite o tempo de decisão sobre descartar algo (ex: 30 segundos)',
  ],
  'Repetição': [
    'Execute ações apenas uma vez, mesmo que "não pareça certo"',
    'Aceite a sensação de incompletude sem repetir',
    'Varie intencionalmente a forma de fazer atividades rotineiras',
    'Use temporizador para limitar tempo em tarefas repetitivas',
  ],
  'Mental': [
    'Resista a rituais mentais de neutralização',
    'Permita que pensamentos intrusivos passem sem análise',
    'Não repita frases ou orações mentalmente',
    'Aceite incerteza sem buscar reasseguramento mental',
  ],
  'Outro': [
    'Identifique o padrão específico da compulsão',
    'Exponha-se gradualmente ao gatilho sem realizar o ritual',
    'Registre o desconforto e observe que ele diminui com o tempo',
    'Busque orientação do seu terapeuta para exercícios personalizados',
  ],
};

export default function EPR() {
  const { eprExercises, compulsions, addEPRExercise, updateEPRExercise, deleteEPRExercise } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [isResultOpen, setIsResultOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedExerciseId, setSelectedExerciseId] = useState('');

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCompulsionIds, setSelectedCompulsionIds] = useState<string[]>([]);
  const [isActive, setIsActive] = useState(true);
  const [anxietyLevel, setAnxietyLevel] = useState('5');
  const [successChance, setSuccessChance] = useState('50');
  const [duration, setDuration] = useState('');
  const [showTips, setShowTips] = useState(false);

  // Result states
  const [resultType, setResultType] = useState<'percentage' | 'attempts'>('percentage');
  const [successPercentage, setSuccessPercentage] = useState('');
  const [succeeded, setSucceeded] = useState('');
  const [totalAttempts, setTotalAttempts] = useState('');

  const handleCompulsionToggle = (compulsionId: string) => {
    setSelectedCompulsionIds(prev =>
      prev.includes(compulsionId)
        ? prev.filter(id => id !== compulsionId)
        : [...prev, compulsionId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateEPRExercise(editingId, {
        title,
        description,
        compulsionIds: selectedCompulsionIds,
        isActive,
        anxietyLevel: parseInt(anxietyLevel),
        successChance: parseInt(successChance),
        duration: parseInt(duration),
      });
    } else {
      addEPRExercise({
        title,
        description,
        compulsionIds: selectedCompulsionIds,
        isActive,
        anxietyLevel: parseInt(anxietyLevel),
        successChance: parseInt(successChance),
        duration: parseInt(duration),
        successRecords: [],
        successRate: null,
        successAttempts: null,
      });
    }
    resetForm();
    setIsOpen(false);
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setSelectedCompulsionIds([]);
    setIsActive(true);
    setAnxietyLevel('5');
    setSuccessChance('50');
    setDuration('');
    setShowTips(false);
    setEditingId(null);
  };

  const handleEdit = (exercise: any) => {
    setEditingId(exercise.id);
    setTitle(exercise.title);
    setDescription(exercise.description);
    setSelectedCompulsionIds(exercise.compulsionIds);
    setIsActive(exercise.isActive);
    setAnxietyLevel(exercise.anxietyLevel.toString());
    setSuccessChance(exercise.successChance.toString());
    setDuration(exercise.duration.toString());
    setIsOpen(true);
  };

  const handleOpenResultDialog = (exerciseId: string) => {
    setSelectedExerciseId(exerciseId);
    setIsResultOpen(true);
  };

  const handleSubmitResult = (e: React.FormEvent) => {
    e.preventDefault();
    const exercise = eprExercises.find(ex => ex.id === selectedExerciseId);
    if (!exercise) return;

    let finalSuccessRate: number;
    let finalAttempts: { succeeded: number; total: number } | undefined = undefined;

    if (resultType === 'percentage') {
      finalSuccessRate = parseInt(successPercentage);
    } else {
      const succeededNum = parseInt(succeeded);
      const totalNum = parseInt(totalAttempts);
      finalSuccessRate = (succeededNum / totalNum) * 100;
      finalAttempts = { succeeded: succeededNum, total: totalNum };
    }

    // Adiciona novo registro aos registros existentes
    const newRecord = {
      date: new Date(),
      successRate: finalSuccessRate,
      attempts: finalAttempts,
    };

    const updatedRecords = [...(exercise.successRecords || []), newRecord];

    // Calcula a média de sucesso de todos os registros
    const avgSuccessRate = updatedRecords.reduce((sum, r) => sum + r.successRate, 0) / updatedRecords.length;

    // Calcula o total de tentativas (se aplicável)
    let totalSuccessAttempts: { succeeded: number; total: number } | null = null;
    const recordsWithAttempts = updatedRecords.filter(r => r.attempts);
    if (recordsWithAttempts.length > 0) {
      totalSuccessAttempts = {
        succeeded: recordsWithAttempts.reduce((sum, r) => sum + (r.attempts?.succeeded || 0), 0),
        total: recordsWithAttempts.reduce((sum, r) => sum + (r.attempts?.total || 0), 0),
      };
    }

    updateEPRExercise(selectedExerciseId, {
      successRecords: updatedRecords,
      successRate: avgSuccessRate,
      successAttempts: totalSuccessAttempts,
    });

    setSuccessPercentage('');
    setSucceeded('');
    setTotalAttempts('');
    setIsResultOpen(false);
  };

  const getSelectedCompulsionTypes = () => {
    return compulsions
      .filter(c => selectedCompulsionIds.includes(c.id))
      .map(c => c.type);
  };

  const getRelevantTips = () => {
    const types = getSelectedCompulsionTypes();
    const tips: { type: string; suggestions: string[] }[] = [];

    types.forEach(type => {
      if (eprTips[type]) {
        tips.push({ type, suggestions: eprTips[type] });
      }
    });

    return tips;
  };

  return (
    <div className="p-4 w-full max-w-full overflow-x-hidden">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl mb-2" style={{ color: '#1F2937' }}>
            Exercícios de EPR
          </h1>
          <p style={{ color: '#6B7280' }}>
            Exposição e Prevenção de Resposta
          </p>
        </div>
        <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button style={{ backgroundColor: '#8B5CF6' }} className="text-white">
              <Plus className="w-4 h-4 mr-2" />
              Novo Exercício
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Editar' : 'Registrar'} Exercício EPR</DialogTitle>
              <DialogDescription>
                {editingId ? 'Edite o exercício de Exposição e Prevenção de Resposta' : 'Adicione um novo exercício de Exposição e Prevenção de Resposta'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título do Exercício</Label>
                <Input
                  id="title"
                  placeholder="Ex: Não verificar o fogão"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Compulsões/Obsessões Relacionadas</Label>
                {compulsions.length === 0 ? (
                  <p className="text-sm" style={{ color: '#F59E0B' }}>
                    ⚠️ Nenhuma compulsão registrada. Vá para Mapeamento primeiro.
                  </p>
                ) : (
                  <div className="space-y-2 p-4 border rounded-lg">
                    {compulsions.map((c) => (
                      <div key={c.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={c.id}
                          checked={selectedCompulsionIds.includes(c.id)}
                          onCheckedChange={() => handleCompulsionToggle(c.id)}
                        />
                        <Label htmlFor={c.id} className="cursor-pointer flex-1">
                          {c.type} - {c.description}
                        </Label>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {selectedCompulsionIds.length > 0 && (
                <Collapsible open={showTips} onOpenChange={setShowTips}>
                  <CollapsibleTrigger asChild>
                    <Button type="button" variant="outline" className="w-full">
                      <Lightbulb className="w-4 h-4 mr-2" />
                      {showTips ? 'Ocultar' : 'Mostrar'} Dicas de Exercícios EPR
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-4 space-y-4">
                    {getRelevantTips().map((tip, index) => (
                      <Alert key={index} style={{ borderColor: '#8B5CF6', backgroundColor: '#F3E8FF' }}>
                        <Lightbulb className="w-4 h-4" style={{ color: '#8B5CF6' }} />
                        <AlertTitle style={{ color: '#8B5CF6' }}>{tip.type}</AlertTitle>
                        <AlertDescription>
                          <ul className="list-disc list-inside space-y-1 text-sm mt-2" style={{ color: '#6B7280' }}>
                            {tip.suggestions.map((suggestion, i) => (
                              <li key={i}>{suggestion}</li>
                            ))}
                          </ul>
                        </AlertDescription>
                      </Alert>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              )}

              <div className="space-y-2">
                <Label htmlFor="description">Descrição do Exercício</Label>
                <Textarea
                  id="description"
                  placeholder="Descreva como você realizará este exercício..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isActive"
                  checked={isActive}
                  onCheckedChange={(checked) => setIsActive(checked as boolean)}
                />
                <Label htmlFor="isActive" className="cursor-pointer">
                  Marcar como exercício ativo (me propus a fazer)
                </Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="anxietyLevel">Nível de Ansiedade Gerado: {anxietyLevel}</Label>
                <Input
                  id="anxietyLevel"
                  type="range"
                  min="0"
                  max="10"
                  value={anxietyLevel}
                  onChange={(e) => setAnxietyLevel(e.target.value)}
                  className="w-full"
                />
                <div className="flex justify-between text-xs" style={{ color: '#6B7280' }}>
                  <span>0 (Nenhuma ansiedade)</span>
                  <span>5 (Moderada)</span>
                  <span>10 (Ansiedade extrema)</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="successChance">Chance de Sucesso: {successChance}%</Label>
                <Input
                  id="successChance"
                  type="range"
                  min="0"
                  max="100"
                  value={successChance}
                  onChange={(e) => setSuccessChance(e.target.value)}
                  className="w-full"
                />
                <div className="flex justify-between text-xs" style={{ color: '#6B7280' }}>
                  <span>0% (Muito difícil)</span>
                  <span>50%</span>
                  <span>100% (Muito fácil)</span>
                </div>
                <p className="text-xs" style={{ color: '#8B5CF6' }}>
                  💡 Dica: Priorize exercícios com maior chance de sucesso para começar
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duração Planejada (minutos)</Label>
                <Input
                  id="duration"
                  type="number"
                  placeholder="30"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  required
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => { resetForm(); setIsOpen(false); }}>
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  style={{ backgroundColor: '#10B981' }}
                  className="text-white"
                  disabled={selectedCompulsionIds.length === 0}
                >
                  {editingId ? 'Atualizar' : 'Salvar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Dialog para ver histórico */}
      <Dialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Histórico de Registros</DialogTitle>
            <DialogDescription>
              Todos os registros de sucesso deste exercício
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {selectedExerciseId && eprExercises.find(e => e.id === selectedExerciseId)?.successRecords?.map((record, index) => (
              <div key={index} className="p-3 rounded-lg" style={{ backgroundColor: '#F0FDF4', borderLeft: '3px solid #10B981' }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold" style={{ color: '#1F2937' }}>
                    {new Date(record.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <span className="text-lg font-bold" style={{ color: '#10B981' }}>
                    {record.successRate.toFixed(0)}%
                  </span>
                </div>
                {record.attempts && (
                  <p className="text-xs" style={{ color: '#6B7280' }}>
                    {record.attempts.succeeded} de {record.attempts.total} tentativas
                  </p>
                )}
              </div>
            )) || <p className="text-sm text-center" style={{ color: '#6B7280' }}>Nenhum registro ainda</p>}
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog para registrar resultado */}
      <Dialog open={isResultOpen} onOpenChange={setIsResultOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar Resultado do Exercício</DialogTitle>
            <DialogDescription>
              Como foi seu desempenho na realização deste exercício?
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitResult} className="space-y-4">
            <div className="space-y-3">
              <Label>Forma de Registro</Label>
              <div className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="percentage"
                    name="resultType"
                    checked={resultType === 'percentage'}
                    onChange={() => setResultType('percentage')}
                  />
                  <Label htmlFor="percentage" className="cursor-pointer">Porcentagem Direta</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="attempts"
                    name="resultType"
                    checked={resultType === 'attempts'}
                    onChange={() => setResultType('attempts')}
                  />
                  <Label htmlFor="attempts" className="cursor-pointer">Sucesso/Tentativas</Label>
                </div>
              </div>
            </div>

            {resultType === 'percentage' ? (
              <div className="space-y-2">
                <Label htmlFor="successPercentage">Sucesso (%)</Label>
                <Input
                  id="successPercentage"
                  type="number"
                  min="0"
                  max="100"
                  placeholder="Ex: 80"
                  value={successPercentage}
                  onChange={(e) => setSuccessPercentage(e.target.value)}
                  required
                />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="succeeded">Vezes com Êxito</Label>
                  <Input
                    id="succeeded"
                    type="number"
                    min="0"
                    placeholder="Ex: 6"
                    value={succeeded}
                    onChange={(e) => setSucceeded(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="totalAttempts">Total de Tentativas</Label>
                  <Input
                    id="totalAttempts"
                    type="number"
                    min="1"
                    placeholder="Ex: 10"
                    value={totalAttempts}
                    onChange={(e) => setTotalAttempts(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={() => setIsResultOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" style={{ backgroundColor: '#10B981' }} className="text-white">
                Registrar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {eprExercises.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Dumbbell className="w-16 h-16 mx-auto mb-4" style={{ color: '#8B5CF6', opacity: 0.3 }} />
            <CardTitle className="mb-2" style={{ color: '#1F2937' }}>
              Nenhum exercício registrado
            </CardTitle>
            <CardDescription className="mb-4">
              Comece adicionando exercícios de EPR conforme orientação do seu terapeuta
            </CardDescription>
            {compulsions.length === 0 && (
              <p className="text-sm mb-4" style={{ color: '#F59E0B' }}>
                ⚠️ Registre primeiro suas compulsões na seção de Mapeamento
              </p>
            )}
            <Button
              onClick={() => setIsOpen(true)}
              style={{ backgroundColor: '#8B5CF6' }}
              className="text-white"
              disabled={compulsions.length === 0}
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Primeiro Exercício
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Filtro de exercícios ativos */}
          <div className="mb-4">
            <p className="text-sm" style={{ color: '#6B7280' }}>
              <Star className="w-4 h-4 inline mr-1" style={{ color: '#F59E0B' }} />
              {eprExercises.filter(e => e.isActive).length} exercícios ativos
            </p>
          </div>

          <div className="space-y-4">
            {eprExercises
              .sort((a, b) => (b.isActive ? 1 : 0) - (a.isActive ? 1 : 0))
              .map((exercise) => {
                const relatedCompulsions = compulsions.filter(c => exercise.compulsionIds.includes(c.id));
                const hasRecords = exercise.successRecords && exercise.successRecords.length > 0;
                return (
                  <Card
                    key={exercise.id}
                    className={hasRecords ? 'border-green-200 bg-green-50' : exercise.isActive ? 'border-purple-200' : ''}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div
                              className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                              style={{ backgroundColor: hasRecords ? '#D1FAE5' : '#F3E8FF' }}
                            >
                              {hasRecords ? (
                                <CheckCircle className="w-5 h-5" style={{ color: '#10B981' }} />
                              ) : (
                                <Dumbbell className="w-5 h-5" style={{ color: '#8B5CF6' }} />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <CardTitle className="text-lg" style={{ color: '#1F2937' }}>
                                  {exercise.title}
                                </CardTitle>
                                {exercise.isActive && (
                                  <Star className="w-4 h-4" style={{ color: '#F59E0B', fill: '#F59E0B' }} />
                                )}
                              </div>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {relatedCompulsions.map((c) => (
                                  <Badge
                                    key={c.id}
                                    variant="outline"
                                    style={{ borderColor: '#8B5CF6', color: '#8B5CF6' }}
                                  >
                                    {c.type}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {hasRecords && (
                            <Button
                              onClick={() => { setSelectedExerciseId(exercise.id); setIsHistoryOpen(true); }}
                              variant="outline"
                              size="sm"
                              style={{ borderColor: '#10B981', color: '#10B981' }}
                            >
                              <History className="w-4 h-4 mr-1" />
                              Histórico ({exercise.successRecords.length})
                            </Button>
                          )}
                          <Button
                            onClick={() => updateEPRExercise(exercise.id, { isActive: !exercise.isActive })}
                            variant="outline"
                            size="sm"
                            style={{
                              borderColor: exercise.isActive ? '#F59E0B' : '#9CA3AF',
                              color: exercise.isActive ? '#F59E0B' : '#9CA3AF'
                            }}
                            title={exercise.isActive ? 'Desmarcar como ativo' : 'Marcar como ativo'}
                          >
                            <Star className={`w-4 h-4 ${exercise.isActive ? 'fill-current' : ''}`} />
                          </Button>
                          <Button
                            onClick={() => handleOpenResultDialog(exercise.id)}
                            style={{ backgroundColor: '#10B981' }}
                            className="text-white"
                            size="sm"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Registrar
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="hover:bg-blue-50"
                            onClick={() => handleEdit(exercise)}
                          >
                            <Edit className="w-4 h-4 text-blue-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="hover:bg-red-50"
                            onClick={() => deleteEPRExercise(exercise.id)}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm mb-3" style={{ color: '#6B7280' }}>
                        {exercise.description}
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        <div>
                          <p className="text-xs" style={{ color: '#6B7280' }}>Duração</p>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{exercise.duration} min</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs" style={{ color: '#6B7280' }}>Ansiedade</p>
                          <span className="font-semibold" style={{ color: '#8B5CF6' }}>
                            {exercise.anxietyLevel}/10
                          </span>
                        </div>
                        <div>
                          <p className="text-xs" style={{ color: '#6B7280' }}>Chance de Sucesso</p>
                          <span className="font-semibold" style={{ color: '#3B82F6' }}>
                            {exercise.successChance}%
                          </span>
                        </div>
                        {hasRecords && exercise.successRate !== null && (
                          <div>
                            <p className="text-xs" style={{ color: '#6B7280' }}>Taxa Média de Sucesso</p>
                            <span className="font-semibold" style={{ color: '#10B981' }}>
                              {exercise.successRate.toFixed(0)}%
                            </span>
                            {exercise.successAttempts && (
                              <p className="text-xs" style={{ color: '#6B7280' }}>
                                ({exercise.successAttempts.succeeded}/{exercise.successAttempts.total} total)
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                      {hasRecords && (
                        <div className="mt-3 pt-3 border-t flex items-center gap-1 text-sm" style={{ color: '#10B981', borderColor: '#D1FAE5' }}>
                          <CheckCircle className="w-4 h-4" />
                          <span>{exercise.successRecords.length} {exercise.successRecords.length === 1 ? 'registro' : 'registros'} de sucesso</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        </>
      )}

      <Card className="mt-8" style={{ borderColor: '#8B5CF6' }}>
        <CardHeader>
          <CardTitle style={{ color: '#1F2937' }}>Sobre EPR</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm mb-3" style={{ color: '#6B7280' }}>
            A Exposição e Prevenção de Resposta (EPR) é uma técnica fundamental no tratamento do TOC.
            Consiste em se expor gradualmente às situações que provocam ansiedade e resistir ao impulso de realizar a compulsão.
          </p>
          <p className="text-sm font-semibold" style={{ color: '#8B5CF6' }}>
            ⚠️ Importante: Os exercícios de EPR devem ser realizados com orientação de um profissional qualificado.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
