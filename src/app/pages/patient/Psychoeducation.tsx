import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { BookOpen, Brain, Pill } from 'lucide-react';
import { Link } from 'react-router';

export default function Psychoeducation() {
  const sections = [
    {
      id: 'what-is-ocd',
      title: 'O que é o TOC',
      description: 'Entenda o que é o Transtorno Obsessivo-Compulsivo',
      icon: Brain,
      color: '#8B5CF6',
      path: '/patient/psychoeducation/what-is-ocd',
    },
    {
      id: 'psychological-treatments',
      title: 'Tratamentos Psicológicos para o TOC',
      description: 'Conheça as abordagens psicológicas no tratamento',
      icon: BookOpen,
      color: '#8B5CF6',
      path: '/patient/psychoeducation/psychological-treatments',
    },
    {
      id: 'psychiatric-treatments',
      title: 'Tratamentos Psiquiátricos para o TOC',
      description: 'Saiba sobre os tratamentos medicamentosos',
      icon: Pill,
      color: '#8B5CF6',
      path: '/patient/psychoeducation/psychiatric-treatments',
    },
  ];

  return (
    <div className="p-4 w-full max-w-full overflow-x-hidden">
      <div className="mb-6">
        <h1 className="text-2xl mb-2" style={{ color: '#1F2937' }}>Psicoeducação</h1>
        <p style={{ color: '#6B7280' }}>
          Aprenda mais sobre o TOC e suas formas de tratamento
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <Link key={section.id} to={section.path}>
              <Card className="h-full hover:shadow-lg transition-all cursor-pointer border-2 hover:border-purple-300">
                <CardHeader>
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                    style={{ backgroundColor: `${section.color}20` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: section.color }} />
                  </div>
                  <CardTitle style={{ color: '#1F2937' }}>{section.title}</CardTitle>
                  <CardDescription>{section.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <span className="text-sm" style={{ color: section.color }}>
                    Ler mais →
                  </span>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <Card className="mt-8" style={{ borderColor: '#8B5CF6' }}>
        <CardHeader>
          <CardTitle style={{ color: '#1F2937' }}>Importante</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm" style={{ color: '#6B7280' }}>
            O ChainFree é uma ferramenta de apoio complementar e não substitui o acompanhamento profissional. 
            Se você tem sintomas de TOC, é fundamental buscar ajuda de um profissional de saúde mental qualificado.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
