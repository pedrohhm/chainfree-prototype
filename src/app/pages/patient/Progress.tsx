import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { useApp } from '../../context/AppContext';
import { TrendingUp, TrendingDown, Minus, RefreshCw, AlertCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Alert, AlertDescription, AlertTitle } from '../../components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';

export default function Progress() {
  const { compulsions, eprExercises, updateCompulsion } = useApp();
  const [isIntensityUpdateOpen, setIsIntensityUpdateOpen] = useState(false);
  const [selectedCompulsionId, setSelectedCompulsionId] = useState('');
  const [newIntensity, setNewIntensity] = useState('5');

  // Cálculo automático de progresso
  const calculateProgress = () => {
    if (compulsions.length === 0) return 0;

    // Média de intensidade das compulsões (invertida para que menor = melhor)
    const avgIntensity = compulsions.reduce((sum, c) => sum + c.intensity, 0) / compulsions.length;
    const intensityScore = ((10 - avgIntensity) / 10) * 50; // 0-50 pontos

    // Taxa de sucesso nos exercícios EPR com registros
    const completedExercises = eprExercises.filter(e => e.successRecords && e.successRecords.length > 0 && e.successRate !== null);
    let eprScore = 0;
    if (completedExercises.length > 0) {
      const avgSuccessRate = completedExercises.reduce((sum, e) => sum + (e.successRate || 0), 0) / completedExercises.length;
      eprScore = (avgSuccessRate / 100) * 50; // 0-50 pontos
    }

    return intensityScore + eprScore;
  };

  const calculateTrend = () => {
    // Verifica se há exercícios com registros recentemente
    const exercisesWithRecords = eprExercises.filter(e => e.successRecords && e.successRecords.length > 0);

    if (exercisesWithRecords.length < 2) return 'stable';

    const avgRecentSuccess = exercisesWithRecords.reduce((sum, e) => sum + (e.successRate || 0), 0) / exercisesWithRecords.length;

    // Verifica ansiedade média dos exercícios
    const avgAnxiety = eprExercises.reduce((sum, e) => sum + e.anxietyLevel, 0) / (eprExercises.length || 1);

    if (avgRecentSuccess > 70 && avgAnxiety < 5) return 'improving';
    if (avgRecentSuccess < 40 || avgAnxiety > 7) return 'worsening';
    return 'stable';
  };

  const shouldSuggestIntensityUpdate = () => {
    const exercisesWithHighSuccess = eprExercises
      .filter(e => e.successRecords && e.successRecords.length > 0 && e.successRate !== null && e.successRate >= 80)
      .slice(-3);

    return exercisesWithHighSuccess.length >= 3;
  };

  const getCompulsionsNeedingUpdate = () => {
    const highSuccessExercises = eprExercises.filter(e => e.successRecords && e.successRecords.length > 0 && e.successRate !== null && e.successRate >= 80);

    const compulsionIds = new Set<string>();
    highSuccessExercises.forEach(e => {
      e.compulsionIds.forEach(id => compulsionIds.add(id));
    });

    return compulsions.filter(c => compulsionIds.has(c.id) && c.intensity > 2);
  };

  const handleOpenIntensityUpdate = (compulsionId: string) => {
    const compulsion = compulsions.find(c => c.id === compulsionId);
    if (compulsion) {
      setSelectedCompulsionId(compulsionId);
      setNewIntensity(compulsion.intensity.toString());
      setIsIntensityUpdateOpen(true);
    }
  };

  const handleUpdateIntensity = () => {
    updateCompulsion(selectedCompulsionId, { intensity: parseInt(newIntensity) });
    setIsIntensityUpdateOpen(false);
  };

  const progressScore = calculateProgress();
  const trend = calculateTrend();
  const needsUpdate = shouldSuggestIntensityUpdate();
  const compulsionsToUpdate = getCompulsionsNeedingUpdate();

  // Dados para o gráfico (histórico baseado em todos os registros de sucesso)
  const chartData = useMemo(() => {
    const allRecords: any[] = [];
    eprExercises.forEach(exercise => {
      if (exercise.successRecords) {
        exercise.successRecords.forEach(record => {
          allRecords.push({
            name: new Date(record.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
            score: record.successRate,
            date: new Date(record.date),
            timestamp: new Date(record.date).getTime(),
          });
        });
      }
    });

    // Agrupar por data e calcular média
    const groupedByDate = allRecords.reduce((acc, record) => {
      if (!acc[record.name]) {
        acc[record.name] = { scores: [], timestamp: record.timestamp };
      }
      acc[record.name].scores.push(record.score);
      return acc;
    }, {} as Record<string, { scores: number[], timestamp: number }>);

    return Object.entries(groupedByDate)
      .map(([name, data], index) => ({
        name,
        score: data.scores.reduce((sum, s) => sum + s, 0) / data.scores.length,
        timestamp: data.timestamp,
      }))
      .sort((a, b) => a.timestamp - b.timestamp)
      .map((item, index) => ({
        id: `progress-${index}-${item.timestamp}`,
        name: item.name,
        score: item.score,
      }));
  }, [eprExercises]);

  const getTrendInfo = () => {
    switch (trend) {
      case 'improving':
        return { icon: TrendingUp, text: 'Tendência de melhora', color: '#10B981' };
      case 'worsening':
        return { icon: TrendingDown, text: 'Requer atenção', color: '#8B5CF6' };
      case 'stable':
        return { icon: Minus, text: 'Progresso estável', color: '#3B82F6' };
    }
  };

  const trendInfo = getTrendInfo();

  return (
    <div className="p-4 w-full max-w-full overflow-x-hidden">
      <div className="mb-6">
        <h1 className="text-2xl mb-2" style={{ color: '#1F2937' }}>
          Tracker de Progresso
        </h1>
        <p style={{ color: '#6B7280' }}>
          Acompanhamento automático baseado em seu mapeamento e exercícios EPR
        </p>
      </div>

      {/* Dialog para atualizar intensidade */}
      <Dialog open={isIntensityUpdateOpen} onOpenChange={setIsIntensityUpdateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Atualizar Intensidade da Compulsão</DialogTitle>
            <DialogDescription>
              Atualize a intensidade com base em seu progresso
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {selectedCompulsionId && (
              <>
                <p className="text-sm" style={{ color: '#6B7280' }}>
                  {compulsions.find(c => c.id === selectedCompulsionId)?.type}
                </p>
                <div className="space-y-2">
                  <Label htmlFor="newIntensity">Nova Intensidade: {newIntensity}</Label>
                  <Input
                    id="newIntensity"
                    type="range"
                    min="0"
                    max="10"
                    value={newIntensity}
                    onChange={(e) => setNewIntensity(e.target.value)}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs" style={{ color: '#6B7280' }}>
                    <span>0 (Mínima)</span>
                    <span>5 (Moderada)</span>
                    <span>10 (Máxima)</span>
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setIsIntensityUpdateOpen(false)}>
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleUpdateIntensity}
                    style={{ backgroundColor: '#3B82F6' }}
                    className="text-white"
                  >
                    Atualizar
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {compulsions.length === 0 && eprExercises.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <TrendingUp className="w-16 h-16 mx-auto mb-4" style={{ color: '#3B82F6', opacity: 0.3 }} />
            <CardTitle className="mb-2" style={{ color: '#1F2937' }}>
              Comece seu acompanhamento
            </CardTitle>
            <CardDescription className="mb-4">
              Registre suas compulsões no Mapeamento e realize exercícios de EPR para visualizar seu progresso
            </CardDescription>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Sugestão de atualização de intensidade */}
          {needsUpdate && compulsionsToUpdate.length > 0 && (
            <Alert className="mb-6" style={{ backgroundColor: '#EFF6FF', borderColor: '#3B82F6' }}>
              <AlertCircle className="w-4 h-4" style={{ color: '#3B82F6' }} />
              <AlertTitle style={{ color: '#3B82F6' }}>Atualização de Intensidade Sugerida</AlertTitle>
              <AlertDescription>
                <p className="text-sm mb-3" style={{ color: '#6B7280' }}>
                  Parabéns! Você teve ótimo desempenho nos exercícios EPR recentes. Considere atualizar a intensidade destas compulsões:
                </p>
                <div className="space-y-2">
                  {compulsionsToUpdate.map(c => (
                    <div key={c.id} className="flex items-center justify-between p-2 rounded" style={{ backgroundColor: 'white' }}>
                      <div>
                        <p className="text-sm font-semibold" style={{ color: '#1F2937' }}>{c.type}</p>
                        <p className="text-xs" style={{ color: '#6B7280' }}>Intensidade atual: {c.intensity}/10</p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleOpenIntensityUpdate(c.id)}
                        style={{ backgroundColor: '#3B82F6' }}
                        className="text-white"
                      >
                        <RefreshCw className="w-3 h-3 mr-1" />
                        Atualizar
                      </Button>
                    </div>
                  ))}
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Score de progresso */}
          <Card className="mb-6" style={{ backgroundColor: '#F3E8FF', borderColor: '#8B5CF6' }}>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm mb-2" style={{ color: '#6B7280' }}>Pontuação de Progresso</p>
                <p className="text-5xl font-bold mb-2" style={{ color: '#8B5CF6' }}>
                  {progressScore.toFixed(0)}
                </p>
                <p className="text-xs" style={{ color: '#6B7280' }}>
                  de 100 pontos possíveis
                </p>
                <div className="mt-4 w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${progressScore}%`,
                      backgroundColor: '#8B5CF6'
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tendência */}
          <Card className="mb-6" style={{ backgroundColor: `${trendInfo.color}10`, borderColor: trendInfo.color }}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <trendInfo.icon className="w-8 h-8" style={{ color: trendInfo.color }} />
                <div>
                  <p className="font-semibold" style={{ color: trendInfo.color }}>
                    {trendInfo.text}
                  </p>
                  <p className="text-sm" style={{ color: '#6B7280' }}>
                    Baseado em {eprExercises.filter(e => e.successRecords && e.successRecords.length > 0).length} exercícios com registros
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Gráfico de desempenho EPR */}
          {chartData.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle style={{ color: '#1F2937' }}>Desempenho nos Exercícios EPR</CardTitle>
                <CardDescription>Taxa de sucesso ao longo do tempo</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData} key="progress-chart">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      interval="preserveStartEnd"
                      allowDuplicatedCategory={false}
                    />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#10B981"
                      strokeWidth={2}
                      dot={{ fill: '#10B981', r: 4 }}
                      isAnimationActive={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* Cards de estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm" style={{ color: '#6B7280' }}>Compulsões Mapeadas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold" style={{ color: '#8B5CF6' }}>
                  {compulsions.length}
                </p>
                <p className="text-xs mt-1" style={{ color: '#6B7280' }}>
                  Intensidade média: {compulsions.length > 0 ? (compulsions.reduce((sum, c) => sum + c.intensity, 0) / compulsions.length).toFixed(1) : 0}/10
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm" style={{ color: '#6B7280' }}>Exercícios EPR</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold" style={{ color: '#3B82F6' }}>
                  {eprExercises.filter(e => e.isActive).length}
                </p>
                <p className="text-xs mt-1" style={{ color: '#6B7280' }}>
                  ativos de {eprExercises.length} totais
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm" style={{ color: '#6B7280' }}>Taxa de Sucesso Média</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold" style={{ color: '#10B981' }}>
                  {eprExercises.filter(e => e.successRate !== null).length > 0
                    ? (eprExercises.filter(e => e.successRate !== null).reduce((sum, e) => sum + (e.successRate || 0), 0) / eprExercises.filter(e => e.successRate !== null).length).toFixed(0)
                    : 0}%
                </p>
                <p className="text-xs mt-1" style={{ color: '#6B7280' }}>
                  em {eprExercises.filter(e => e.successRecords && e.successRecords.length > 0).length} exercícios com registros
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Detalhamento de compulsões */}
          <Card>
            <CardHeader>
              <CardTitle style={{ color: '#1F2937' }}>Intensidade das Compulsões</CardTitle>
              <CardDescription>Acompanhe a evolução individual de cada compulsão</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {compulsions.map((compulsion) => (
                  <div key={compulsion.id} className="p-3 rounded-lg" style={{ backgroundColor: '#F8FAFC' }}>
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-semibold text-sm" style={{ color: '#1F2937' }}>{compulsion.type}</p>
                        <p className="text-xs" style={{ color: '#6B7280' }}>{compulsion.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold" style={{ color: '#8B5CF6' }}>
                          {compulsion.intensity}/10
                        </p>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleOpenIntensityUpdate(compulsion.id)}
                          style={{ color: '#3B82F6' }}
                        >
                          Atualizar
                        </Button>
                      </div>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${(compulsion.intensity / 10) * 100}%`,
                          backgroundColor: '#8B5CF6'
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      <Card className="mt-8" style={{ borderColor: '#3B82F6' }}>
        <CardHeader>
          <CardTitle style={{ color: '#1F2937' }}>Como funciona o Tracker</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm" style={{ color: '#6B7280' }}>
            <p>
              • <strong>Pontuação automática:</strong> Calculada com base na intensidade das compulsões (50%) e taxa de sucesso nos exercícios EPR (50%)
            </p>
            <p>
              • <strong>Tendência:</strong> Avalia seu desempenho recente nos exercícios e níveis de ansiedade
            </p>
            <p>
              • <strong>Sugestões de atualização:</strong> Quando você tem bom desempenho consistente, o app sugere atualizar a intensidade das compulsões relacionadas
            </p>
            <p className="font-semibold mt-4" style={{ color: '#3B82F6' }}>
              💡 Dica: Mantenha as intensidades atualizadas para um acompanhamento mais preciso do seu progresso!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
