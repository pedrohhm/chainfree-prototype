import { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router';
import { format } from 'date-fns';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { UserCircle, Stethoscope, ArrowLeft } from 'lucide-react';
import { registerPatient } from '../api/patientAuth';
import { useApp } from '../context/AppContext';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [termsChoice, setTermsChoice] = useState<'accept' | 'decline' | ''>('');
  const [healthConsent, setHealthConsent] = useState<'accept' | 'decline' | ''>('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { patient, isRestoringSession } = useApp();

  if (patient) return <Navigate to="/patient/dashboard" replace />;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || isRestoringSession) return;
    setFormError('');

    if (password !== confirmPassword) {
      setFormError('As senhas não coincidem. Confira os dois campos de senha.');
      return;
    }

    if (termsChoice !== 'accept') {
      setFormError('É necessário concordar com os Termos de Uso para criar a conta.');
      return;
    }

    if (!healthConsent) {
      setFormError('Informe separadamente sua decisão sobre o tratamento de dados de saúde.');
      return;
    }

    setIsSubmitting(true);
    try {
      const { message } = await registerPatient({ name, birthDate, email, password, confirmPassword, termsChoice, healthConsent });
      navigate('/', { replace: true, state: { registrationMessage: message } });
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Não foi possível criar a conta.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-6" style={{ backgroundColor: '#F8FAFC' }}>
      <Card className="w-full max-w-md" style={{ borderColor: '#8B5CF6' }}>
        <CardHeader className="text-center">
          <Link to="/" className="inline-flex items-center gap-2 mb-4 text-sm hover:underline" style={{ color: '#6B7280' }}>
            <ArrowLeft className="w-4 h-4" />
            Voltar para login
          </Link>
          <div
            className="mx-auto mb-4 w-16 h-16 rounded-full flex items-center justify-center transition-colors duration-300"
            style={{ backgroundColor: '#8B5CF6' }}
          >
            <span className="text-2xl text-white">⛓️‍💥</span>
          </div>
          <CardTitle className="text-2xl" style={{ color: '#8B5CF6' }}>
            Criar Conta
          </CardTitle>
          <CardDescription style={{ color: '#6B7280' }}>
            Cadastre-se no ChainFree
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-6">
            <div className="space-y-4">
              <Label style={{ color: '#1F2937' }}>Tipo de Usuário</Label>
              <div className="space-y-3">
                <div className="flex items-center space-x-2 p-4 rounded-lg border-2" style={{ borderColor: '#8B5CF6', backgroundColor: '#F3E8FF' }}>
                  <div className="flex items-center gap-2 flex-1">
                    <UserCircle className="w-5 h-5" style={{ color: '#8B5CF6' }} />
                    <span style={{ color: '#1F2937' }}>Paciente/Usuário</span>
                  </div>
                  <div aria-hidden="true" className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: '#8B5CF6' }}>
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>
                </div>
                <div className="flex items-center gap-2 p-4 rounded-lg border-2" style={{ borderColor: '#E5E7EB' }}>
                  <Stethoscope className="w-5 h-5" style={{ color: '#3B82F6' }} />
                  <span style={{ color: '#1F2937' }}>Terapeuta</span>
                  <span className="ml-auto text-right text-xs text-slate-600">Modo visitante</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name" style={{ color: '#1F2937' }}>Nome Completo</Label>
              <Input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="Digite seu nome completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={150}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthDate" style={{ color: '#1F2937' }}>Data de Nascimento</Label>
              <Input
                id="birthDate"
                name="birthDate"
                type="date"
                autoComplete="bday"
                min="1000-01-01"
                max={format(new Date(), 'yyyy-MM-dd')}
                aria-describedby="birthDateHint"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                required
              />
              <p id="birthDateHint" className="text-xs text-slate-600">Cadastro disponível a partir dos 18 anos.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" style={{ color: '#1F2937' }}>Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                maxLength={254}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" style={{ color: '#1F2937' }}>Senha</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                maxLength={128}
              />
              <p className="text-xs text-slate-600">Use entre 6 e 128 caracteres.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" style={{ color: '#1F2937' }}>Confirmar Senha</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                maxLength={128}
              />
            </div>

            <div className="space-y-5 border-t pt-5">
              <fieldset className="space-y-3">
                <legend className="font-medium text-slate-800">
                  Termos de Uso <span aria-hidden="true">*</span>
                </legend>
                <p className="text-sm leading-relaxed text-slate-600">
                  Leia os{' '}
                  <Link
                    to="/terms?returnTo=/register"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Termos de Uso e Consentimento (abre em outra aba)"
                    className="font-medium text-purple-700 underline underline-offset-4"
                  >
                    Termos de Uso e Consentimento
                  </Link>{' '}
                  e a{' '}
                  <Link
                    to="/privacy?returnTo=/register"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Política de Privacidade (abre em outra aba)"
                    className="font-medium text-purple-700 underline underline-offset-4"
                  >
                    Política de Privacidade
                  </Link>
                  .
                </p>
                <RadioGroup
                  value={termsChoice}
                  onValueChange={(value) => setTermsChoice(value as 'accept' | 'decline')}
                  aria-label="Escolha sobre os Termos de Uso"
                >
                  <Label className="flex min-h-12 cursor-pointer items-center gap-3 rounded-lg border p-3">
                    <RadioGroupItem value="accept" className="size-6" />
                    Concordo com os Termos de Uso
                  </Label>
                  <Label className="flex min-h-12 cursor-pointer items-center gap-3 rounded-lg border p-3">
                    <RadioGroupItem value="decline" className="size-6" />
                    Não concordo com os Termos de Uso
                  </Label>
                </RadioGroup>
              </fieldset>

              <fieldset className="space-y-3">
                <legend className="font-medium text-slate-800">
                  Consentimento para dados de saúde <span aria-hidden="true">*</span>
                </legend>
                <p className="text-sm leading-relaxed text-slate-600">
                  Esta escolha é independente. A recusa não impede a criação da conta,
                  mas desativa recursos que registram ou analisam dados de saúde.
                </p>
                <RadioGroup
                  value={healthConsent}
                  onValueChange={(value) => setHealthConsent(value as 'accept' | 'decline')}
                  aria-label="Escolha sobre o tratamento de dados pessoais de saúde"
                >
                  <Label className="flex min-h-12 cursor-pointer items-center gap-3 rounded-lg border p-3">
                    <RadioGroupItem value="accept" className="size-6" />
                    Concordo com o tratamento descrito
                  </Label>
                  <Label className="flex min-h-12 cursor-pointer items-center gap-3 rounded-lg border p-3">
                    <RadioGroupItem value="decline" className="size-6" />
                    Não concordo com esse tratamento
                  </Label>
                </RadioGroup>
              </fieldset>
            </div>

            {formError && (
              <div
                role="alert"
                className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-800"
              >
                {formError}
              </div>
            )}

            <Button
              type="submit"
              disabled={isSubmitting || isRestoringSession}
              className="w-full text-white"
              style={{ backgroundColor: '#8B5CF6' }}
            >
              {isSubmitting ? 'Criando conta…' : 'Criar Conta'}
            </Button>

            <div className="text-center text-sm">
              <span style={{ color: '#6B7280' }}>Já tem uma conta? </span>
              <Link to="/" className="hover:underline" style={{ color: '#8B5CF6' }}>
                Fazer login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
