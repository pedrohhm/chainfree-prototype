import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { useApp } from '../../context/AppContext';
import { Brain, Dumbbell, TrendingUp, MessageSquare } from 'lucide-react';
import { Link } from 'react-router';
import { Button } from '../../components/ui/button';

export default function PatientDashboard() {
  const { patient, userName, compulsions, eprExercises, progressData, questions } = useApp();
  const canUseHealthFeatures = patient?.healthConsent !== false;

  const stats = [
    {
      title: 'Compulsões Mapeadas',
      value: compulsions.length,
      icon: Brain,
      color: '#8B5CF6',
      link: '/patient/mapping',
    },
    {
      title: 'Exercícios EPR',
      value: eprExercises.length,
      icon: Dumbbell,
      color: '#8B5CF6',
      link: '/patient/epr',
    },
    {
      title: 'Dias de Progresso',
      value: progressData.length,
      icon: TrendingUp,
      color: '#3B82F6',
      link: '/patient/progress',
    },
    {
      title: 'Perguntas Enviadas',
      value: questions.filter(q => q.patientId === 'current').length,
      icon: MessageSquare,
      color: '#8B5CF6',
      link: '/patient/questions',
    },
  ];

  return (
    <div className="p-4 w-full max-w-full overflow-x-hidden">
      <div className="mb-6">
        <h1 className="text-2xl mb-2" style={{ color: '#1F2937' }}>
          Bem-vindo(a), {userName}!
        </h1>
        <p style={{ color: '#6B7280' }}>
          Aqui está um resumo do seu progresso no ChainFree
        </p>
      </div>

      {canUseHealthFeatures && <div className="grid grid-cols-2 gap-4 mb-6">
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
      </div>}

      <div className="grid grid-cols-1 gap-4">
        <Card>
          <CardHeader>
            <CardTitle style={{ color: '#1F2937' }}>Sobre o ChainFree</CardTitle>
            <CardDescription>Seu apoio complementar no tratamento do TOC</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-4" style={{ color: '#6B7280' }}>
              O ChainFree é uma ferramenta de apoio complementar para pessoas com sintomas do Transtorno Obsessivo-Compulsivo (TOC).
              {canUseHealthFeatures && ' Use o app para mapear suas compulsões, registrar exercícios de EPR e acompanhar seu progresso.'}
            </p>
            <Link to="/patient/psychoeducation">
              <Button style={{ backgroundColor: '#8B5CF6' }} className="text-white">
                Começar Psicoeducação
              </Button>
            </Link>
          </CardContent>
        </Card>

        {canUseHealthFeatures && <Card>
          <CardHeader>
            <CardTitle style={{ color: '#1F2937' }}>Primeiros Passos</CardTitle>
            <CardDescription>Recomendações para começar</CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3 text-sm" style={{ color: '#6B7280' }}>
              <li className="flex items-start gap-2">
                <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs" style={{ backgroundColor: '#8B5CF6' }}>1</span>
                <span>Leia o conteúdo de psicoeducação sobre o TOC</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs" style={{ backgroundColor: '#8B5CF6' }}>2</span>
                <span>Mapeie suas compulsões e obsessões</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs" style={{ backgroundColor: '#8B5CF6' }}>3</span>
                <span>Registre exercícios de EPR conforme orientação profissional</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs" style={{ backgroundColor: '#8B5CF6' }}>4</span>
                <span>Acompanhe seu progresso ao longo do tempo</span>
              </li>
            </ol>
          </CardContent>
        </Card>}
      </div>
    </div>
  );
}
