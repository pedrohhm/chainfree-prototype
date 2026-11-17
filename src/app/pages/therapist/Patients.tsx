import { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Button } from '../../components/ui/button';
import { Plus, UserPlus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { useApp } from '../../context/AppContext';
import { Brain, Dumbbell, TrendingUp, User } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Badge } from '../../components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Patients() {
  const { compulsions, eprExercises } = useApp();
  const [selectedPatientId, setSelectedPatientId] = useState(1);
  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);
  const [newPatientName, setNewPatientName] = useState('');
  const [newPatientEmail, setNewPatientEmail] = useState('');
  const [newPatientAge, setNewPatientAge] = useState('');

  // Mock patients data - em produção seria um estado global ou vindo do backend
  const [patients, setPatients] = useState([
    { id: 1, name: 'Maria Silva', age: 28, sessionsCount: 12, email: 'maria@exemplo.com' },
    { id: 2, name: 'João Santos', age: 35, sessionsCount: 8, email: 'joao@exemplo.com' },
    { id: 3, name: 'Ana Costa', age: 42, sessionsCount: 15, email: 'ana@exemplo.com' },
  ]);

  const selectedPatient = patients.find(p => p.id === selectedPatientId) || patients[0];

  const handleAddPatient = (e: React.FormEvent) => {
    e.preventDefault();
    const newPatient = {
      id: Date.now(),
      name: newPatientName,
      age: parseInt(newPatientAge),
      sessionsCount: 0,
      email: newPatientEmail,
    };
    setPatients([...patients, newPatient]);
    setNewPatientName('');
    setNewPatientEmail('');
    setNewPatientAge('');
    setIsAddPatientOpen(false);
  };

  // Simular dados de progresso (na prática viriam do contexto filtrado por paciente)
  const generateMockProgressData = (patientId: number) => {
    const baseValues = [7, 6, 6, 5, 5, 4, 4, 3];
    const variation = patientId === 1 ? 0 : patientId === 2 ? 1 : -1;
    const baseTime = Date.now();

    return baseValues.map((val, i) => {
      // Cada ponto tem um dia único, começando de 7 dias atrás
      const timestamp = baseTime - (7 - i) * 24 * 60 * 60 * 1000 + (i * 3600000); // Adicionar horas para garantir unicidade
      const dateName = new Date(timestamp).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });

      return {
        id: `mock-${patientId}-${i}-${timestamp}`,
        name: dateName,
        score: Math.max(0, Math.min(10, val + variation)),
      };
    });
  };

  const chartData = useMemo(() => {
    if (selectedPatientId === 1) {
      const allRecords: Array<{ name: string; score: number; timestamp: number }> = [];
      eprExercises.forEach(exercise => {
        if (exercise.successRecords) {
          exercise.successRecords.forEach(record => {
            allRecords.push({
              name: new Date(record.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
              score: record.successRate / 10,
              timestamp: new Date(record.date).getTime(),
            });
          });
        }
      });

      const grouped = allRecords.reduce((acc, r) => {
        if (!acc[r.name]) acc[r.name] = { scores: [], timestamp: r.timestamp };
        acc[r.name].scores.push(r.score);
        return acc;
      }, {} as Record<string, { scores: number[]; timestamp: number }>);

      return Object.entries(grouped)
        .map(([name, data], index) => ({
          id: `${data.timestamp}-${index}`,
          name,
          score: data.scores.reduce((sum, s) => sum + s, 0) / data.scores.length,
          timestamp: data.timestamp,
        }))
        .sort((a, b) => a.timestamp - b.timestamp)
        .slice(-8)
        .map((item, index) => ({
          id: `chart-${index}-${item.timestamp}`,
          name: item.name,
          score: item.score,
        }));
    } else {
      return generateMockProgressData(selectedPatientId);
    }
  }, [selectedPatientId, eprExercises]);

  return (
    <div className="p-4 w-full max-w-full overflow-x-hidden">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl mb-2" style={{ color: '#1F2937' }}>
            Pacientes
          </h1>
          <p style={{ color: '#6B7280' }}>
            Visualize e acompanhe o progresso dos seus pacientes
          </p>
        </div>
        <Dialog open={isAddPatientOpen} onOpenChange={setIsAddPatientOpen}>
          <DialogTrigger asChild>
            <Button style={{ backgroundColor: '#3B82F6' }} className="text-white">
              <UserPlus className="w-4 h-4 mr-2" />
              Vincular Paciente
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Vincular Novo Paciente</DialogTitle>
              <DialogDescription>
                Adicione um novo paciente à sua lista de acompanhamento
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddPatient} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="patientName">Nome Completo</Label>
                <Input
                  id="patientName"
                  placeholder="Ex: Maria Silva"
                  value={newPatientName}
                  onChange={(e) => setNewPatientName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="patientEmail">Email</Label>
                <Input
                  id="patientEmail"
                  type="email"
                  placeholder="paciente@exemplo.com"
                  value={newPatientEmail}
                  onChange={(e) => setNewPatientEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="patientAge">Idade</Label>
                <Input
                  id="patientAge"
                  type="number"
                  placeholder="Ex: 28"
                  min="1"
                  max="120"
                  value={newPatientAge}
                  onChange={(e) => setNewPatientAge(e.target.value)}
                  required
                />
              </div>
              <div className="bg-blue-50 p-4 rounded-lg text-sm" style={{ color: '#6B7280' }}>
                <p className="font-semibold mb-1" style={{ color: '#3B82F6' }}>Importante:</p>
                <p>
                  O paciente receberá um convite por email para se vincular à sua conta.
                  Após a aceitação, você poderá acompanhar o progresso dele remotamente.
                </p>
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setIsAddPatientOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" style={{ backgroundColor: '#3B82F6' }} className="text-white">
                  Enviar Convite
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {patients.map((patient) => (
          <Card
            key={patient.id}
            className={`hover:shadow-lg transition-all cursor-pointer ${
              selectedPatientId === patient.id
                ? 'ring-2 ring-offset-2'
                : ''
            }`}
            style={{
              ringColor: selectedPatientId === patient.id ? '#3B82F6' : 'transparent'
            }}
            onClick={() => setSelectedPatientId(patient.id)}
          >
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: selectedPatientId === patient.id ? '#3B82F6' : '#DBEAFE'
                  }}
                >
                  <User
                    className="w-6 h-6"
                    style={{ color: selectedPatientId === patient.id ? 'white' : '#3B82F6' }}
                  />
                </div>
                <div>
                  <CardTitle style={{ color: '#1F2937' }}>{patient.name}</CardTitle>
                  <CardDescription>{patient.age} anos</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span style={{ color: '#6B7280' }}>Sessões:</span>
                  <Badge variant="outline">{patient.sessionsCount}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span style={{ color: '#6B7280' }}>Status:</span>
                  <Badge style={{ backgroundColor: '#D1FAE5', color: '#10B981' }}>Ativo</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle style={{ color: '#1F2937' }}>
            Detalhes do Paciente: {selectedPatient.name}
          </CardTitle>
          <CardDescription>Informações e progresso detalhado</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="compulsions" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="compulsions">Compulsões</TabsTrigger>
              <TabsTrigger value="epr">Exercícios EPR</TabsTrigger>
              <TabsTrigger value="progress">Progresso</TabsTrigger>
            </TabsList>

            <TabsContent value="compulsions" className="space-y-4 mt-6">
              {selectedPatientId === 1 && compulsions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {compulsions.map((compulsion) => (
                    <Card key={compulsion.id}>
                      <CardHeader>
                        <CardTitle className="text-base" style={{ color: '#1F2937' }}>
                          {compulsion.type}
                        </CardTitle>
                        <CardDescription className="text-xs">
                          {new Date(compulsion.createdAt).toLocaleDateString('pt-BR')}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm mb-2" style={{ color: '#6B7280' }}>
                          {compulsion.description}
                        </p>
                        <div className="flex items-center justify-between text-xs">
                          <span style={{ color: '#6B7280' }}>Intensidade:</span>
                          <span className="font-semibold" style={{
                            color: compulsion.intensity <= 3 ? '#10B981' : compulsion.intensity <= 6 ? '#F59E0B' : '#EF4444'
                          }}>
                            {compulsion.intensity}/10
                          </span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mt-2">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${(compulsion.intensity / 10) * 100}%`,
                              backgroundColor: compulsion.intensity <= 3 ? '#10B981' : compulsion.intensity <= 6 ? '#F59E0B' : '#EF4444'
                            }}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Brain className="w-12 h-12 mx-auto mb-3" style={{ color: '#3B82F6', opacity: 0.3 }} />
                  <p style={{ color: '#6B7280' }}>
                    {selectedPatientId === 1
                      ? 'Nenhuma compulsão registrada pelo paciente'
                      : 'Dados de demonstração - integração com banco de dados necessária'}
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="epr" className="space-y-4 mt-6">
              {selectedPatientId === 1 && eprExercises.length > 0 ? (
                <div className="space-y-3">
                  {eprExercises.map((exercise) => {
                    const relatedCompulsions = compulsions.filter(c => exercise.compulsionIds.includes(c.id));
                    return (
                      <Card key={exercise.id}>
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-base" style={{ color: '#1F2937' }}>
                                {exercise.title}
                              </CardTitle>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {relatedCompulsions.map((c) => (
                                  <Badge
                                    key={c.id}
                                    variant="outline"
                                    style={{ borderColor: '#3B82F6', color: '#3B82F6' }}
                                  >
                                    {c.type}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              {exercise.isActive && (
                                <Badge style={{ backgroundColor: '#FEF3C7', color: '#F59E0B' }}>
                                  Ativo
                                </Badge>
                              )}
                              {exercise.successRecords && exercise.successRecords.length > 0 && (
                                <Badge style={{ backgroundColor: '#D1FAE5', color: '#10B981' }}>
                                  Com registros
                                </Badge>
                              )}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm mb-3" style={{ color: '#6B7280' }}>
                            {exercise.description}
                          </p>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                            <div>
                              <p style={{ color: '#6B7280' }}>Duração:</p>
                              <p className="font-semibold">{exercise.duration} min</p>
                            </div>
                            <div>
                              <p style={{ color: '#6B7280' }}>Ansiedade:</p>
                              <p className="font-semibold" style={{
                                color: exercise.anxietyLevel <= 3 ? '#10B981' : exercise.anxietyLevel <= 6 ? '#F59E0B' : '#EF4444'
                              }}>
                                {exercise.anxietyLevel}/10
                              </p>
                            </div>
                            <div>
                              <p style={{ color: '#6B7280' }}>Chance Sucesso:</p>
                              <p className="font-semibold" style={{
                                color: exercise.successChance >= 70 ? '#10B981' : exercise.successChance >= 40 ? '#F59E0B' : '#EF4444'
                              }}>
                                {exercise.successChance}%
                              </p>
                            </div>
                            {exercise.successRate !== null && (
                              <div>
                                <p style={{ color: '#6B7280' }}>Êxito Obtido:</p>
                                <p className="font-semibold" style={{ color: '#10B981' }}>
                                  {exercise.successRate.toFixed(0)}%
                                </p>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Dumbbell className="w-12 h-12 mx-auto mb-3" style={{ color: '#3B82F6', opacity: 0.3 }} />
                  <p style={{ color: '#6B7280' }}>
                    {selectedPatientId === 1
                      ? 'Nenhum exercício EPR registrado'
                      : 'Dados de demonstração - integração com banco de dados necessária'}
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="progress" className="mt-6">
              {chartData.length > 0 ? (
                <>
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-4" style={{ color: '#1F2937' }}>
                      Evolução dos Sintomas
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={chartData} key={`chart-${selectedPatientId}`}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="name"
                          interval="preserveStartEnd"
                          allowDuplicatedCategory={false}
                        />
                        <YAxis domain={[0, 10]} />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="score"
                          stroke="#3B82F6"
                          strokeWidth={2}
                          dot={{ fill: '#3B82F6', r: 4 }}
                          isAnimationActive={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm" style={{ color: '#6B7280' }}>Compulsões</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-2">
                        <p className="text-2xl font-bold" style={{ color: '#3B82F6' }}>
                          {selectedPatientId === 1 ? compulsions.length : (selectedPatientId % 5) + 3}
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm" style={{ color: '#6B7280' }}>EPR Ativos</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-2">
                        <p className="text-2xl font-bold" style={{ color: '#10B981' }}>
                          {selectedPatientId === 1
                            ? eprExercises.filter(e => e.isActive).length
                            : (selectedPatientId % 3) + 2}
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm" style={{ color: '#6B7280' }}>Tendência</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-2">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-6 h-6" style={{ color: '#10B981' }} />
                          <p className="text-xl font-bold leading-none" style={{ color: '#10B981' }}>
                            Melhora
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <TrendingUp className="w-12 h-12 mx-auto mb-3" style={{ color: '#3B82F6', opacity: 0.3 }} />
                  <p style={{ color: '#6B7280' }}>Nenhum dado de progresso registrado</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {selectedPatientId !== 1 && (
        <Card className="mt-6" style={{ backgroundColor: '#FEF3C7', borderColor: '#F59E0B' }}>
          <CardContent className="pt-6">
            <p className="text-sm" style={{ color: '#92400E' }}>
              <strong>Nota:</strong> Os dados para {selectedPatient.name} são demonstrativos.
              Para exibir dados reais de múltiplos pacientes, seria necessária integração com banco de dados
              para armazenar informações separadas por paciente.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
