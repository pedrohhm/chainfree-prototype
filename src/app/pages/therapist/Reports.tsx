import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Label } from '../../components/ui/label';
import { FileText, Download, Calendar, User } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../../components/ui/badge';

export default function Reports() {
  const { compulsions, eprExercises, progressData } = useApp();
  const [selectedPatient, setSelectedPatient] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [generatedReport, setGeneratedReport] = useState(false);

  const patients = [
    { id: '1', name: 'Maria Silva' },
    { id: '2', name: 'João Santos' },
    { id: '3', name: 'Ana Costa' },
  ];

  const periods = [
    { id: 'week', label: 'Última semana' },
    { id: 'month', label: 'Último mês' },
    { id: 'quarter', label: 'Último trimestre' },
    { id: 'all', label: 'Todo o período' },
  ];

  const handleGenerateReport = () => {
    setGeneratedReport(true);
  };

  const handleDownloadPDF = () => {
    alert('Funcionalidade de download de PDF será implementada na versão final.');
  };

  const completedExercises = eprExercises.filter(e => e.completedAt).length;
  const averageScore = progressData.length > 0 
    ? (progressData.reduce((sum, entry) => sum + entry.score, 0) / progressData.length).toFixed(1)
    : 0;

  return (
    <div className="p-4 w-full max-w-full overflow-x-hidden">
      <div className="mb-6">
        <h1 className="text-2xl mb-2" style={{ color: '#1F2937' }}>
          Gerar Relatórios
        </h1>
        <p style={{ color: '#6B7280' }}>
          Crie relatórios de evolução dos pacientes
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle style={{ color: '#1F2937' }}>Configurar Relatório</CardTitle>
              <CardDescription>Selecione os parâmetros</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="patient">Paciente</Label>
                <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                  <SelectTrigger id="patient">
                    <SelectValue placeholder="Selecione o paciente" />
                  </SelectTrigger>
                  <SelectContent>
                    {patients.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {patient.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="period">Período</Label>
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger id="period">
                    <SelectValue placeholder="Selecione o período" />
                  </SelectTrigger>
                  <SelectContent>
                    {periods.map((period) => (
                      <SelectItem key={period.id} value={period.id}>
                        {period.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={handleGenerateReport}
                disabled={!selectedPatient || !selectedPeriod}
                className="w-full"
                style={{ backgroundColor: '#3B82F6' }}
              >
                <FileText className="w-4 h-4 mr-2" />
                Gerar Relatório
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          {!generatedReport ? (
            <Card className="h-full flex items-center justify-center">
              <CardContent className="text-center py-12">
                <FileText className="w-16 h-16 mx-auto mb-4" style={{ color: '#3B82F6', opacity: 0.3 }} />
                <CardTitle className="mb-2" style={{ color: '#1F2937' }}>
                  Nenhum relatório gerado
                </CardTitle>
                <CardDescription>
                  Configure os parâmetros e clique em "Gerar Relatório"
                </CardDescription>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle style={{ color: '#1F2937' }}>Relatório de Evolução</CardTitle>
                    <CardDescription>
                      Paciente: {patients.find(p => p.id === selectedPatient)?.name} • 
                      Período: {periods.find(p => p.id === selectedPeriod)?.label}
                    </CardDescription>
                  </div>
                  <Button onClick={handleDownloadPDF} style={{ backgroundColor: '#3B82F6' }} className="text-white">
                    <Download className="w-4 h-4 mr-2" />
                    Baixar PDF
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4" style={{ color: '#1F2937' }}>
                    Informações do Paciente
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" style={{ color: '#3B82F6' }} />
                      <div>
                        <p className="text-xs" style={{ color: '#6B7280' }}>Nome</p>
                        <p className="text-sm font-medium" style={{ color: '#1F2937' }}>
                          {patients.find(p => p.id === selectedPatient)?.name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" style={{ color: '#3B82F6' }} />
                      <div>
                        <p className="text-xs" style={{ color: '#6B7280' }}>Data do Relatório</p>
                        <p className="text-sm font-medium" style={{ color: '#1F2937' }}>
                          {new Date().toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6" style={{ borderColor: '#E5E7EB' }}>
                  <h3 className="text-lg font-semibold mb-4" style={{ color: '#1F2937' }}>
                    Resumo Estatístico
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm" style={{ color: '#6B7280' }}>
                          Compulsões Mapeadas
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-bold" style={{ color: '#3B82F6' }}>
                          {compulsions.length}
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm" style={{ color: '#6B7280' }}>
                          Exercícios Concluídos
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-bold" style={{ color: '#10B981' }}>
                          {completedExercises}
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm" style={{ color: '#6B7280' }}>
                          Média de Sintomas
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-bold" style={{ color: '#F59E0B' }}>
                          {averageScore}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div className="border-t pt-6" style={{ borderColor: '#E5E7EB' }}>
                  <h3 className="text-lg font-semibold mb-4" style={{ color: '#1F2937' }}>
                    Tipos de Compulsões Identificadas
                  </h3>
                  {compulsions.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {compulsions.map((compulsion) => (
                        <Badge key={compulsion.id} variant="outline" style={{ borderColor: '#3B82F6', color: '#3B82F6' }}>
                          {compulsion.type}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm" style={{ color: '#6B7280' }}>
                      Nenhuma compulsão registrada no período
                    </p>
                  )}
                </div>

                <div className="border-t pt-6" style={{ borderColor: '#E5E7EB' }}>
                  <h3 className="text-lg font-semibold mb-4" style={{ color: '#1F2937' }}>
                    Progresso no Tratamento
                  </h3>
                  {progressData.length > 0 ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: '#F8FAFC' }}>
                        <span className="text-sm" style={{ color: '#6B7280' }}>Dias de registro:</span>
                        <span className="text-sm font-semibold" style={{ color: '#1F2937' }}>
                          {progressData.length}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: '#F8FAFC' }}>
                        <span className="text-sm" style={{ color: '#6B7280' }}>Melhor pontuação:</span>
                        <span className="text-sm font-semibold" style={{ color: '#10B981' }}>
                          {Math.min(...progressData.map(e => e.score))}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: '#F8FAFC' }}>
                        <span className="text-sm" style={{ color: '#6B7280' }}>Pior pontuação:</span>
                        <span className="text-sm font-semibold" style={{ color: '#EF4444' }}>
                          {Math.max(...progressData.map(e => e.score))}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm" style={{ color: '#6B7280' }}>
                      Nenhum dado de progresso registrado no período
                    </p>
                  )}
                </div>

                <div className="border-t pt-6" style={{ borderColor: '#E5E7EB' }}>
                  <h3 className="text-lg font-semibold mb-4" style={{ color: '#1F2937' }}>
                    Observações Clínicas
                  </h3>
                  <div className="bg-blue-50 p-4 rounded-lg" style={{ borderLeft: '4px solid #3B82F6' }}>
                    <p className="text-sm italic" style={{ color: '#6B7280' }}>
                      [Este espaço pode ser preenchido com observações clínicas específicas do terapeuta 
                      sobre a evolução do paciente durante o período analisado]
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
