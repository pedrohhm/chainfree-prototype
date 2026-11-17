import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import { useApp } from '../../context/AppContext';
import { MessageSquare, Plus, CheckCircle, Clock, Edit, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../../components/ui/alert-dialog';
import { Badge } from '../../components/ui/badge';

export default function PatientQuestions() {
  const { questions, addQuestion, updateQuestion, deleteQuestion } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [questionText, setQuestionText] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const myQuestions = questions.filter(q => q.patientId === 'current');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateQuestion(editingId, questionText);
    } else {
      addQuestion({
        patientId: 'current',
        question: questionText,
        answer: null,
      });
    }
    setQuestionText('');
    setEditingId(null);
    setIsOpen(false);
  };

  const handleEdit = (question: typeof myQuestions[0]) => {
    setEditingId(question.id);
    setQuestionText(question.question);
    setIsOpen(true);
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteQuestion(deleteId);
      setDeleteId(null);
    }
  };

  const resetForm = () => {
    setQuestionText('');
    setEditingId(null);
  };

  return (
    <div className="p-4 w-full max-w-full overflow-x-hidden">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl mb-2" style={{ color: '#1F2937' }}>
            Perguntas ao Terapeuta
          </h1>
          <p style={{ color: '#6B7280' }}>
            Envie suas dúvidas e receba orientações do seu terapeuta
          </p>
        </div>
        <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button style={{ backgroundColor: '#8B5CF6' }} className="text-white">
              <Plus className="w-4 h-4 mr-2" />
              Nova Pergunta
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? 'Editar' : 'Enviar'} Pergunta</DialogTitle>
              <DialogDescription>
                {editingId ? 'Edite sua pergunta' : 'Escreva sua pergunta para o terapeuta'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="question">Sua Pergunta</Label>
                <Textarea
                  id="question"
                  placeholder="Digite sua pergunta aqui..."
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  rows={6}
                  required
                />
              </div>
              <div className="bg-purple-50 p-4 rounded-lg text-sm" style={{ color: '#6B7280' }}>
                <p className="font-semibold mb-1" style={{ color: '#8B5CF6' }}>Dica:</p>
                <p>
                  Seja específico(a) em sua pergunta. Quanto mais detalhes você fornecer, 
                  melhor o terapeuta poderá orientá-lo(a).
                </p>
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => { resetForm(); setIsOpen(false); }}>
                  Cancelar
                </Button>
                <Button type="submit" style={{ backgroundColor: '#8B5CF6' }} className="text-white">
                  {editingId ? 'Atualizar' : 'Enviar'} Pergunta
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {myQuestions.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <MessageSquare className="w-16 h-16 mx-auto mb-4" style={{ color: '#8B5CF6', opacity: 0.3 }} />
            <CardTitle className="mb-2" style={{ color: '#1F2937' }}>
              Nenhuma pergunta enviada
            </CardTitle>
            <CardDescription className="mb-4">
              Envie perguntas ao seu terapeuta para esclarecer dúvidas sobre o tratamento
            </CardDescription>
            <Button onClick={() => setIsOpen(true)} style={{ backgroundColor: '#8B5CF6' }} className="text-white">
              <Plus className="w-4 h-4 mr-2" />
              Enviar Primeira Pergunta
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {myQuestions.slice().reverse().map((question) => (
            <Card key={question.id} className={question.answer ? 'border-green-200' : 'border-yellow-200'}>
              <CardHeader>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" style={{ color: '#8B5CF6' }} />
                    <CardTitle className="text-lg" style={{ color: '#1F2937' }}>
                      Sua Pergunta
                    </CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    {!question.answer && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:bg-purple-50"
                          onClick={() => handleEdit(question)}
                        >
                          <Edit className="w-4 h-4 text-purple-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:bg-red-50"
                          onClick={() => setDeleteId(question.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </>
                    )}
                    {question.answer ? (
                      <Badge style={{ backgroundColor: '#D1FAE5', color: '#10B981' }}>
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Respondida
                      </Badge>
                    ) : (
                      <Badge style={{ backgroundColor: '#FEF3C7', color: '#F59E0B' }}>
                        <Clock className="w-3 h-3 mr-1" />
                        Aguardando
                      </Badge>
                    )}
                  </div>
                </div>
                <CardDescription className="text-xs">
                  Enviada em {new Date(question.createdAt).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-2" style={{ color: '#6B7280' }}>Pergunta:</p>
                  <p style={{ color: '#1F2937' }}>{question.question}</p>
                </div>
                {question.answer && (
                  <div className="bg-green-50 p-4 rounded-lg" style={{ borderLeft: '4px solid #10B981' }}>
                    <p className="text-sm font-medium mb-2" style={{ color: '#10B981' }}>Resposta do Terapeuta:</p>
                    <p style={{ color: '#1F2937' }}>{question.answer}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta pergunta? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteId(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} style={{ backgroundColor: '#EF4444' }}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Card className="mt-8" style={{ borderColor: '#8B5CF6' }}>
        <CardHeader>
          <CardTitle style={{ color: '#1F2937' }}>Sobre as Perguntas</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm" style={{ color: '#6B7280' }}>
            Esta funcionalidade permite que você mantenha contato com seu terapeuta entre as sessões.
            No entanto, lembre-se que esta não é uma forma de atendimento emergencial. Em caso de crise,
            procure ajuda presencial imediata.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
