import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import { useApp } from '../../context/AppContext';
import { MessageSquare, Send, User, Edit } from 'lucide-react';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';

export default function TherapistQuestions() {
  const { questions, answerQuestion } = useApp();
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const [answer, setAnswer] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedQuestion) {
      answerQuestion(selectedQuestion, answer);
      setAnswer('');
      setSelectedQuestion(null);
      setIsOpen(false);
      setIsEditing(false);
    }
  };

  const handleEditAnswer = (question: typeof questions[0]) => {
    setSelectedQuestion(question.id);
    setAnswer(question.answer || '');
    setIsEditing(true);
    setIsOpen(true);
  };

  const resetForm = () => {
    setAnswer('');
    setSelectedQuestion(null);
    setIsEditing(false);
  };

  const unansweredQuestions = questions.filter(q => !q.answer);
  const answeredQuestions = questions.filter(q => q.answer);

  return (
    <div className="p-4 w-full max-w-full overflow-x-hidden">
      <div className="mb-6">
        <h1 className="text-2xl mb-2" style={{ color: '#1F2937' }}>
          Perguntas dos Pacientes
        </h1>
        <p style={{ color: '#6B7280' }}>
          Responda às dúvidas dos seus pacientes
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card style={{ borderColor: '#F59E0B' }}>
          <CardHeader>
            <CardTitle style={{ color: '#1F2937' }}>Perguntas Pendentes</CardTitle>
            <CardDescription>Aguardando sua resposta</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold" style={{ color: '#F59E0B' }}>
              {unansweredQuestions.length}
            </p>
          </CardContent>
        </Card>
        <Card style={{ borderColor: '#10B981' }}>
          <CardHeader>
            <CardTitle style={{ color: '#1F2937' }}>Perguntas Respondidas</CardTitle>
            <CardDescription>Total de respostas enviadas</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold" style={{ color: '#10B981' }}>
              {answeredQuestions.length}
            </p>
          </CardContent>
        </Card>
      </div>

      {unansweredQuestions.length > 0 && (
        <>
          <h2 className="text-xl font-semibold mb-4" style={{ color: '#1F2937' }}>
            Aguardando Resposta
          </h2>
          <div className="space-y-4 mb-6">
            {unansweredQuestions.map((question) => (
              <Card key={question.id} style={{ borderColor: '#F59E0B' }}>
                <CardHeader>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: '#DBEAFE' }}
                      >
                        <User className="w-5 h-5" style={{ color: '#3B82F6' }} />
                      </div>
                      <div>
                        <CardTitle className="text-base" style={{ color: '#1F2937' }}>
                          Paciente: Maria Silva
                        </CardTitle>
                        <CardDescription className="text-xs">
                          {new Date(question.createdAt).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: 'long',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge style={{ backgroundColor: '#FEF3C7', color: '#F59E0B' }}>
                      Pendente
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-2" style={{ color: '#6B7280' }}>Pergunta:</p>
                    <p style={{ color: '#1F2937' }}>{question.question}</p>
                  </div>
                  <Dialog open={isOpen && selectedQuestion === question.id} onOpenChange={(open) => {
                    setIsOpen(open);
                    if (!open) resetForm();
                  }}>
                    <DialogTrigger asChild>
                      <Button
                        onClick={() => {
                          setSelectedQuestion(question.id);
                          setIsEditing(false);
                        }}
                        style={{ backgroundColor: '#3B82F6' }}
                        className="text-white"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Responder
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{isEditing ? 'Editar' : 'Responder'} Pergunta</DialogTitle>
                        <DialogDescription>
                          {isEditing ? 'Edite sua resposta' : 'Envie sua resposta para o paciente'}
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm font-medium mb-2" style={{ color: '#6B7280' }}>Pergunta:</p>
                          <p className="text-sm" style={{ color: '#1F2937' }}>{question.question}</p>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="answer">Sua Resposta</Label>
                          <Textarea
                            id="answer"
                            placeholder="Digite sua resposta aqui..."
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            rows={6}
                            required
                          />
                        </div>
                        <div className="flex gap-2 justify-end">
                          <Button type="button" variant="outline" onClick={() => {
                            setIsOpen(false);
                            resetForm();
                          }}>
                            Cancelar
                          </Button>
                          <Button type="submit" style={{ backgroundColor: '#3B82F6' }} className="text-white">
                            <Send className="w-4 h-4 mr-2" />
                            {isEditing ? 'Atualizar' : 'Enviar'} Resposta
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {answeredQuestions.length > 0 && (
        <>
          <h2 className="text-xl font-semibold mb-4" style={{ color: '#1F2937' }}>
            Histórico de Respostas
          </h2>
          <div className="space-y-4">
            {answeredQuestions.slice().reverse().map((question) => (
              <Card key={question.id}>
                <CardHeader>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: '#DBEAFE' }}
                      >
                        <User className="w-5 h-5" style={{ color: '#3B82F6' }} />
                      </div>
                      <div>
                        <CardTitle className="text-base" style={{ color: '#1F2937' }}>
                          Paciente: Maria Silva
                        </CardTitle>
                        <CardDescription className="text-xs">
                          {new Date(question.createdAt).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: 'long',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge style={{ backgroundColor: '#D1FAE5', color: '#10B981' }}>
                      Respondida
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-2" style={{ color: '#6B7280' }}>Pergunta:</p>
                    <p style={{ color: '#1F2937' }}>{question.question}</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg" style={{ borderLeft: '4px solid #3B82F6' }}>
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-sm font-medium" style={{ color: '#3B82F6' }}>Sua Resposta:</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover:bg-blue-100 -mt-1"
                        onClick={() => handleEditAnswer(question)}
                      >
                        <Edit className="w-4 h-4 text-blue-600" />
                      </Button>
                    </div>
                    <p style={{ color: '#1F2937' }}>{question.answer}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {questions.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <MessageSquare className="w-16 h-16 mx-auto mb-4" style={{ color: '#3B82F6', opacity: 0.3 }} />
            <CardTitle className="mb-2" style={{ color: '#1F2937' }}>
              Nenhuma pergunta recebida
            </CardTitle>
            <CardDescription>
              As perguntas dos pacientes aparecerão aqui
            </CardDescription>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
