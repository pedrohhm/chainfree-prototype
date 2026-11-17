import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { useApp } from '../../context/AppContext';
import { Users, MessageSquare, FileEdit, TrendingUp, FileText } from 'lucide-react';
import { Link } from 'react-router';
import { Button } from '../../components/ui/button';

export default function TherapistDashboard() {
  const { userName, questions, compulsions, eprExercises, progressData } = useApp();

  const unansweredQuestions = questions.filter(q => !q.answer).length;

  const stats = [
    {
      title: 'Pacientes Ativos',
      value: 3,
      icon: Users,
      color: '#3B82F6',
      link: '/therapist/patients',
    },
    {
      title: 'Perguntas Pendentes',
      value: unansweredQuestions,
      icon: MessageSquare,
      color: '#F59E0B',
      link: '/therapist/questions',
    },
    {
      title: 'Notas Criadas',
      value: 12,
      icon: FileEdit,
      color: '#3B82F6',
      link: '/therapist/notes',
    },
    {
      title: 'Relatórios Gerados',
      value: 5,
      icon: TrendingUp,
      color: '#3B82F6',
      link: '/therapist/reports',
    },
  ];

  return (
    <div className="p-4 w-full max-w-full overflow-x-hidden">
      <div className="mb-6">
        <h1 className="text-2xl mb-2" style={{ color: '#1F2937' }}>
          Bem-vindo(a), Dr(a). {userName}!
        </h1>
        <p style={{ color: '#6B7280' }}>
          Visão geral da sua prática clínica
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium" style={{ color: '#6B7280' }}>
                  {stat.title}
                </CardTitle>
                <Icon className="w-4 h-4" style={{ color: stat.color }} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-2" style={{ color: stat.color }}>
                  {stat.value}
                </div>
                <Link to={stat.link}>
                  <Button variant="link" className="p-0 h-auto" style={{ color: stat.color }}>
                    Ver detalhes →
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-4">
        <Card>
          <CardHeader>
            <CardTitle style={{ color: '#1F2937' }}>Atividade Recente</CardTitle>
            <CardDescription>Últimas interações com pacientes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 rounded-lg" style={{ backgroundColor: '#F8FAFC' }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#DBEAFE' }}>
                  <MessageSquare className="w-4 h-4" style={{ color: '#3B82F6' }} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium" style={{ color: '#1F2937' }}>Nova pergunta recebida</p>
                  <p className="text-xs" style={{ color: '#6B7280' }}>Paciente Maria Silva - Há 2 horas</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg" style={{ backgroundColor: '#F8FAFC' }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#DBEAFE' }}>
                  <TrendingUp className="w-4 h-4" style={{ color: '#3B82F6' }} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium" style={{ color: '#1F2937' }}>Progresso registrado</p>
                  <p className="text-xs" style={{ color: '#6B7280' }}>Paciente João Santos - Há 5 horas</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg" style={{ backgroundColor: '#F8FAFC' }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#DBEAFE' }}>
                  <FileEdit className="w-4 h-4" style={{ color: '#3B82F6' }} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium" style={{ color: '#1F2937' }}>Exercício EPR concluído</p>
                  <p className="text-xs" style={{ color: '#6B7280' }}>Paciente Ana Costa - Há 1 dia</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle style={{ color: '#1F2937' }}>Ações Rápidas</CardTitle>
            <CardDescription>Acesso rápido às funcionalidades principais</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Link to="/therapist/patients">
                <Button className="w-full justify-start" variant="outline">
                  <Users className="w-4 h-4 mr-2" />
                  Visualizar Pacientes
                </Button>
              </Link>
              <Link to="/therapist/questions">
                <Button className="w-full justify-start" variant="outline">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Responder Perguntas
                  {unansweredQuestions > 0 && (
                    <span className="ml-auto px-2 py-1 rounded-full text-xs text-white" style={{ backgroundColor: '#F59E0B' }}>
                      {unansweredQuestions}
                    </span>
                  )}
                </Button>
              </Link>
              <Link to="/therapist/notes">
                <Button className="w-full justify-start" variant="outline">
                  <FileEdit className="w-4 h-4 mr-2" />
                  Criar Notas/Sugestões
                </Button>
              </Link>
              <Link to="/therapist/reports">
                <Button className="w-full justify-start" variant="outline">
                  <FileText className="w-4 h-4 mr-2" />
                  Gerar Relatórios
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6" style={{ borderColor: '#3B82F6' }}>
        <CardHeader>
          <CardTitle style={{ color: '#1F2937' }}>Sobre o ChainFree para Terapeutas</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm" style={{ color: '#6B7280' }}>
            O ChainFree permite acompanhar remotamente o progresso dos seus pacientes, responder dúvidas entre sessões, 
            adicionar notas e sugestões, e gerar relatórios de evolução. Todas essas funcionalidades complementam o 
            atendimento presencial e facilitam a continuidade do tratamento.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}