import { Link } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { useApp } from '../../context/AppContext';
import { Brain, Zap, ChevronRight } from 'lucide-react';

export default function Mapping() {
  const { obsessions, compulsions } = useApp();

  const sections = [
    {
      title: 'Obsessões',
      description: 'Pensamentos, medos ou imagens intrusivos e repetitivos',
      icon: Brain,
      path: '/patient/mapping/obsessions',
      count: obsessions.length,
      color: '#7C3AED',
      bg: '#EDE9FE',
      label: 'Acessar mapeamento de obsessões',
    },
    {
      title: 'Compulsões',
      description: 'Comportamentos ou rituais repetitivos realizados para reduzir o desconforto',
      icon: Zap,
      path: '/patient/mapping/compulsions',
      count: compulsions.length,
      color: '#8B5CF6',
      bg: '#F3E8FF',
      label: 'Acessar mapeamento de compulsões',
    },
  ];

  return (
    <div className="p-4 w-full max-w-full overflow-x-hidden">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1" style={{ color: '#1F2937' }}>
          Mapeamento
        </h1>
        <p className="text-sm" style={{ color: '#6B7280' }}>
          Registre e acompanhe suas obsessões e compulsões separadamente
        </p>
      </div>

      <div className="space-y-4" role="list" aria-label="Categorias de mapeamento">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <Link
              key={section.path}
              to={section.path}
              aria-label={`${section.label} — ${section.count} registro${section.count !== 1 ? 's' : ''}`}
              role="listitem"
            >
              <Card className="transition-shadow hover:shadow-md focus-within:ring-2 focus-within:ring-purple-400">
                <CardContent className="p-0">
                  <div className="flex items-center gap-4 p-5 min-h-[80px]">
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: section.bg }}
                      aria-hidden="true"
                    >
                      <Icon className="w-7 h-7" style={{ color: section.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-lg font-semibold" style={{ color: '#1F2937' }}>
                        {section.title}
                      </h2>
                      <CardDescription className="text-sm line-clamp-2">
                        {section.description}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      {section.count > 0 && (
                        <span
                          className="text-xs font-semibold px-2 py-1 rounded-full"
                          style={{ backgroundColor: section.bg, color: section.color }}
                          aria-hidden="true"
                        >
                          {section.count}
                        </span>
                      )}
                      <ChevronRight className="w-5 h-5" style={{ color: '#9CA3AF' }} aria-hidden="true" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <Card className="mt-8" style={{ borderColor: '#8B5CF6', borderLeftWidth: '4px' }}>
        <CardHeader>
          <CardTitle className="text-base" style={{ color: '#1F2937' }}>Por que mapear separadamente?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm" style={{ color: '#6B7280' }}>
            Obsessões e compulsões têm naturezas distintas. Ao registrá-las separadamente, você e seu terapeuta
            conseguem identificar padrões com mais precisão e desenvolver estratégias de intervenção direcionadas.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
