import { useState } from 'react';
import { Link } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { useApp } from '../../context/AppContext';
import { User, Mail, Phone, Crown, Check, X, FileText, ShieldCheck } from 'lucide-react';
import { Badge } from '../../components/ui/badge';

export default function Profile() {
  const { userName, setUserName } = useApp();
  const [name, setName] = useState(userName || '');
  const [email, setEmail] = useState('terapeuta@exemplo.com');
  const [phone, setPhone] = useState('');
  const [crp, setCrp] = useState(localStorage.getItem('therapistCRP') || '');
  const [isEditing, setIsEditing] = useState(false);
  const [hasSubscription] = useState(false); // Mock - em produção viria do backend

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setUserName(name);
    if (crp) {
      localStorage.setItem('therapistCRP', crp);
    }
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
          Gerencie suas informações pessoais e assinatura
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
                  style={{ backgroundColor: '#DBEAFE' }}
                >
                  <User className="w-6 h-6" style={{ color: '#3B82F6' }} />
                </div>
                <div>
                  <CardTitle style={{ color: '#1F2937' }}>Dados Pessoais</CardTitle>
                  <CardDescription>Suas informações de cadastro</CardDescription>
                </div>
              </div>
              {!isEditing && (
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                  style={{ borderColor: '#3B82F6', color: '#3B82F6' }}
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
                    value={name}
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={!isEditing}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" style={{ color: '#6B7280' }} />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(00) 00000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="crp">CRP (Conselho Regional de Psicologia)</Label>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" style={{ color: '#6B7280' }} />
                  <Input
                    id="crp"
                    type="text"
                    placeholder="Ex: 06/123456"
                    value={crp}
                    onChange={(e) => setCrp(e.target.value)}
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
                    style={{ backgroundColor: '#3B82F6' }}
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
        <Card style={{ borderColor: hasSubscription ? '#3B82F6' : '#E5E7EB' }}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: hasSubscription ? '#DBEAFE' : '#F3F4F6' }}
              >
                <Crown className="w-6 h-6" style={{ color: hasSubscription ? '#3B82F6' : '#9CA3AF' }} />
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
                <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: '#DBEAFE' }}>
                  <div>
                    <p className="font-semibold" style={{ color: '#3B82F6' }}>ChainFree Premium</p>
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
                    <span style={{ color: '#6B7280' }}>Sincronização com pacientes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4" style={{ color: '#10B981' }} />
                    <span style={{ color: '#6B7280' }}>Relatórios automatizados</span>
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
                  style={{ backgroundColor: '#3B82F6' }}
                  className="text-white"
                  onClick={() => window.location.href = '/subscription'}
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
              <Link to="/terms?returnTo=/therapist/profile">
                <FileText aria-hidden="true" />
                Termos de Uso e Consentimento
              </Link>
            </Button>
            <Button asChild variant="outline" className="min-h-12 justify-start">
              <Link to="/privacy?returnTo=/therapist/profile">
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
