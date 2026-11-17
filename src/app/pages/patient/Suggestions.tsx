import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { FileEdit, User, Calendar } from 'lucide-react';

interface Suggestion {
  id: string;
  title: string;
  content: string;
  therapistName: string;
  createdAt: Date;
}

export default function Suggestions() {
  // Mock data - em produção virá do backend/contexto
  const suggestions: Suggestion[] = [
    {
      id: '1',
      title: 'Recomendação para exercício EPR',
      content: 'Com base no seu progresso recente, recomendo aumentar gradualmente o tempo de exposição nos exercícios relacionados à compulsão de verificação. Você tem demonstrado ótimo controle e está pronto para o próximo nível.',
      therapistName: 'Dr(a). Silva',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      id: '2',
      title: 'Observação sobre progresso',
      content: 'Notei uma redução significativa na intensidade das compulsões de limpeza. Continue praticando as técnicas de EPR que discutimos na última sessão. Seu empenho está sendo recompensado!',
      therapistName: 'Dr(a). Silva',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
  ];

  return (
    <div className="p-4 w-full max-w-full overflow-x-hidden">
      <div className="mb-6">
        <h1 className="text-2xl mb-2" style={{ color: '#1F2937' }}>
          Sugestões do Terapeuta
        </h1>
        <p style={{ color: '#6B7280' }}>
          Recomendações e observações do seu terapeuta
        </p>
      </div>

      {suggestions.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <FileEdit className="w-16 h-16 mx-auto mb-4" style={{ color: '#8B5CF6', opacity: 0.3 }} />
            <CardTitle className="mb-2" style={{ color: '#1F2937' }}>
              Nenhuma sugestão recebida
            </CardTitle>
            <CardDescription>
              Quando seu terapeuta adicionar sugestões ou observações, elas aparecerão aqui
            </CardDescription>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {suggestions.slice().reverse().map((suggestion) => (
            <Card key={suggestion.id}>
              <CardHeader>
                <div className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: '#DBEAFE' }}
                  >
                    <User className="w-5 h-5" style={{ color: '#3B82F6' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle style={{ color: '#1F2937' }}>{suggestion.title}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <span>{suggestion.therapistName}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(suggestion.createdAt).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </span>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-blue-50 p-4 rounded-lg" style={{ borderLeft: '4px solid #3B82F6' }}>
                  <p className="text-sm whitespace-pre-line" style={{ color: '#1F2937' }}>
                    {suggestion.content}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card className="mt-8" style={{ borderColor: '#8B5CF6' }}>
        <CardHeader>
          <CardTitle style={{ color: '#1F2937' }}>Sobre as Sugestões</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm" style={{ color: '#6B7280' }}>
            Seu terapeuta pode adicionar sugestões e observações sobre seu progresso a qualquer momento.
            Estas recomendações complementam o acompanhamento presencial e ajudam a manter a continuidade
            do seu tratamento entre as sessões.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
