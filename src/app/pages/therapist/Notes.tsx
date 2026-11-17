import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { FileEdit, Plus, User, Edit, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../../components/ui/alert-dialog';

interface Note {
  id: string;
  patientId: string;
  patientName: string;
  title: string;
  content: string;
  createdAt: Date;
}

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [patientId, setPatientId] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const patients = [
    { id: '1', name: 'Maria Silva' },
    { id: '2', name: 'João Santos' },
    { id: '3', name: 'Ana Costa' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedPatient = patients.find(p => p.id === patientId);
    if (selectedPatient) {
      if (editingId) {
        setNotes(notes.map(note =>
          note.id === editingId
            ? { ...note, title, content, patientId, patientName: selectedPatient.name }
            : note
        ));
      } else {
        const newNote: Note = {
          id: Date.now().toString(),
          patientId,
          patientName: selectedPatient.name,
          title,
          content,
          createdAt: new Date(),
        };
        setNotes([...notes, newNote]);
      }
      resetForm();
      setIsOpen(false);
    }
  };

  const handleEdit = (note: Note) => {
    setEditingId(note.id);
    setTitle(note.title);
    setContent(note.content);
    setPatientId(note.patientId);
    setIsOpen(true);
  };

  const handleDelete = () => {
    if (deleteId) {
      setNotes(notes.filter(note => note.id !== deleteId));
      setDeleteId(null);
    }
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
    setPatientId('');
    setEditingId(null);
  };

  return (
    <div className="p-4 w-full max-w-full overflow-x-hidden">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl mb-2" style={{ color: '#1F2937' }}>
            Notas e Sugestões
          </h1>
          <p style={{ color: '#6B7280' }}>
            Registre observações e recomendações para seus pacientes
          </p>
        </div>
        <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button style={{ backgroundColor: '#3B82F6' }} className="text-white">
              <Plus className="w-4 h-4 mr-2" />
              Nova Nota
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Editar' : 'Criar'} Nota/Sugestão</DialogTitle>
              <DialogDescription>
                {editingId ? 'Edite a nota ou sugestão' : 'Adicione observações ou recomendações para o paciente'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="patient">Paciente</Label>
                <Select value={patientId} onValueChange={setPatientId} required>
                  <SelectTrigger>
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
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  placeholder="Ex: Recomendação para próxima sessão"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Conteúdo</Label>
                <Textarea
                  id="content"
                  placeholder="Digite suas observações, recomendações ou sugestões..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={8}
                  required
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => { resetForm(); setIsOpen(false); }}>
                  Cancelar
                </Button>
                <Button type="submit" style={{ backgroundColor: '#3B82F6' }} className="text-white">
                  {editingId ? 'Atualizar' : 'Salvar'} Nota
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {notes.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <FileEdit className="w-16 h-16 mx-auto mb-4" style={{ color: '#3B82F6', opacity: 0.3 }} />
            <CardTitle className="mb-2" style={{ color: '#1F2937' }}>
              Nenhuma nota registrada
            </CardTitle>
            <CardDescription className="mb-4">
              Comece criando notas e sugestões para seus pacientes
            </CardDescription>
            <Button onClick={() => setIsOpen(true)} style={{ backgroundColor: '#3B82F6' }} className="text-white">
              <Plus className="w-4 h-4 mr-2" />
              Criar Primeira Nota
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {notes.slice().reverse().map((note) => (
            <Card key={note.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: '#DBEAFE' }}
                    >
                      <User className="w-5 h-5" style={{ color: '#3B82F6' }} />
                    </div>
                    <div>
                      <CardTitle style={{ color: '#1F2937' }}>{note.title}</CardTitle>
                      <CardDescription>
                        Paciente: {note.patientName} • {new Date(note.createdAt).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:bg-blue-50"
                      onClick={() => handleEdit(note)}
                    >
                      <Edit className="w-4 h-4 text-blue-600" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:bg-red-50"
                      onClick={() => setDeleteId(note.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-blue-50 p-4 rounded-lg" style={{ borderLeft: '4px solid #3B82F6' }}>
                  <p className="text-sm whitespace-pre-line" style={{ color: '#1F2937' }}>
                    {note.content}
                  </p>
                </div>
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
              Tem certeza que deseja excluir esta nota? Esta ação não pode ser desfeita.
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

      <Card className="mt-8" style={{ borderColor: '#3B82F6' }}>
        <CardHeader>
          <CardTitle style={{ color: '#1F2937' }}>Sobre Notas e Sugestões</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm" style={{ color: '#6B7280' }}>
            Use esta seção para registrar observações sobre o progresso do paciente, sugestões de exercícios EPR, 
            ajustes no plano de tratamento, ou qualquer outra informação relevante que você queira documentar ou 
            compartilhar com o paciente.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
