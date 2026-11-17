import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Link } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { useApp } from '../../context/AppContext';
import { User, Mail, Calendar, Crown, Check, X, FileText, ShieldCheck } from 'lucide-react';
import { Badge } from '../../components/ui/badge';

export default function Profile() {
  const { patient, userName, setUserName } = useApp();
  const navigate = useNavigate();
  const [name, setName] = useState(userName || '');
  const [email, setEmail] = useState('paciente@exemplo.com');
  const [birthDate, setBirthDate] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [hasSubscription] = useState(false); // Mock - em produção viria do backend

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setUserName(name);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setName(userName || '');
    setIsEditing(false);
  };

  return (
    <div className="p-4 w-full max-w-full overflow-x-hidden">
      <div className="mb-6">
        <h1 className="text-2xl mb-2" style={{ color: '#1F2937' }}>
          Meu Perfil
        </h1>
        <p style={{ color: '#6B7280' }}>
          Consulte suas informações de cadastro e assinatura
        </p>
      </div>

      <div className="grid gap-6 max-w-4xl">
        {/* Dados Pessoais */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#F3E8FF' }}
                >
                  <User className="w-6 h-6" style={{ color: '#8B5CF6' }} />
                </div>
                <div>
                  <CardTitle style={{ color: '#1F2937' }}>Dados Pessoais</CardTitle>
                  <CardDescription>Suas informações de cadastro</CardDescription>
                </div>
              </div>
              {!patient && !isEditing && (
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                  style={{ borderColor: '#8B5CF6', color: '#8B5CF6' }}
                >
                  Editar
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" style={{ color: '#6B7280' }} />
                  <Input
                    id="name"
                    value={patient?.name ?? name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={!isEditing}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" style={{ color: '#6B7280' }} />
                  <Input
                    id="email"
                    type="email"
                    value={patient?.email ?? email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={!isEditing}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="birthDate">Data de Nascimento</Label>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" style={{ color: '#6B7280' }} />
                  <Input
                    id="birthDate"
                    type="date"
                    value={patient?.birthDate ?? birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              {isEditing && (
                <div className="flex gap-2 justify-end pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    style={{ backgroundColor: '#8B5CF6' }}
                    className="text-white"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Salvar
                  </Button>
                </div>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Assinatura */}
        <Card style={{ borderColor: hasSubscription ? '#8B5CF6' : '#E5E7EB' }}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: hasSubscription ? '#F3E8FF' : '#F3F4F6' }}
              >
                <Crown className="w-6 h-6" style={{ color: hasSubscription ? '#8B5CF6' : '#9CA3AF' }} />
              </div>
              <div>
                <CardTitle style={{ color: '#1F2937' }}>Assinatura</CardTitle>
                <CardDescription>Status da sua assinatura Premium</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {hasSubscription ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: '#F3E8FF' }}>
                  <div>
                    <p className="font-semibold" style={{ color: '#8B5CF6' }}>ChainFree Premium</p>
                    <p className="text-sm" style={{ color: '#6B7280' }}>Ativa desde 01/04/2026</p>
                  </div>
                  <Badge style={{ backgroundColor: '#10B981', color: 'white' }}>
                    Ativa
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4" style={{ color: '#10B981' }} />
                    <span style={{ color: '#6B7280' }}>Backup na nuvem</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4" style={{ color: '#10B981' }} />
                    <span style={{ color: '#6B7280' }}>Sincronização com terapeuta</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4" style={{ color: '#10B981' }} />
                    <span style={{ color: '#6B7280' }}>Customização da interface</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4" style={{ color: '#10B981' }} />
                    <span style={{ color: '#6B7280' }}>Recursos de organização</span>
                  </div>
                </div>
                <div className="pt-4 border-t flex justify-between items-center">
                  <div>
                    <p className="text-sm" style={{ color: '#6B7280' }}>Próxima cobrança</p>
                    <p className="font-semibold" style={{ color: '#1F2937' }}>R$ 9,90 em 01/05/2026</p>
                  </div>
                  <Button variant="outline" size="sm" style={{ color: '#EF4444', borderColor: '#EF4444' }}>
                    Cancelar Assinatura
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Crown className="w-16 h-16 mx-auto mb-4" style={{ color: '#9CA3AF', opacity: 0.3 }} />
                <p className="mb-2" style={{ color: '#1F2937' }}>Você não possui assinatura ativa</p>
                <p className="text-sm mb-4" style={{ color: '#6B7280' }}>
                  Assine o ChainFree Premium e tenha acesso a recursos exclusivos
                </p>
                <Button
                  style={{ backgroundColor: '#8B5CF6' }}
                  className="text-white"
                  onClick={() => navigate('/subscription')}
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Assinar Premium
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle style={{ color: '#1F2937' }}>Privacidade e documentos</CardTitle>
            <CardDescription>Consulte as condições e seus direitos a qualquer momento</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            <Button asChild variant="outline" className="min-h-12 justify-start">
              <Link to="/terms?returnTo=/patient/profile">
                <FileText aria-hidden="true" />
                Termos de Uso e Consentimento
              </Link>
            </Button>
            <Button asChild variant="outline" className="min-h-12 justify-start">
              <Link to="/privacy?returnTo=/patient/profile">
                <ShieldCheck aria-hidden="true" />
                Política de Privacidade
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
