import { useState } from 'react';
import { useLocation, useNavigate, Link, Navigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { useApp } from '../context/AppContext';
import { UserCircle, Stethoscope, Eye } from 'lucide-react';

export default function Login() {
  const [selectedType, setSelectedType] = useState<'patient' | 'therapist'>('patient');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { state } = useLocation();
  const { patient, isRestoringSession, signIn, enterGuestMode } = useApp();

  if (patient) return <Navigate to="/patient/dashboard" replace />;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedType !== 'patient' || isSubmitting || isRestoringSession) return;
    setFormError('');
    setIsSubmitting(true);

    try {
      await signIn(email, password);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Não foi possível entrar.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGuestLogin = () => {
    enterGuestMode(selectedType);
    navigate(selectedType === 'patient' ? '/patient/dashboard' : '/therapist/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-6" style={{ backgroundColor: '#F8FAFC' }}>
      <Card className="w-full max-w-md" style={{ borderColor: selectedType === 'patient' ? '#8B5CF6' : '#3B82F6' }}>
        <CardHeader className="text-center">
          <div
            className="mx-auto mb-4 w-16 h-16 rounded-full flex items-center justify-center transition-colors duration-300"
            style={{ backgroundColor: selectedType === 'patient' ? '#8B5CF6' : '#3B82F6' }}
          >
            <span className="text-2xl text-white">⛓️‍💥</span>
          </div>
          <CardTitle className="text-2xl transition-colors duration-300" style={{ color: selectedType === 'patient' ? '#8B5CF6' : '#3B82F6' }}>
            ChainFree
          </CardTitle>
          <CardDescription style={{ color: '#6B7280' }}>
            Seu apoio no tratamento do TOC
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <Label style={{ color: '#1F2937' }}>Tipo de Usuário</Label>
              <div className="space-y-3">
                <button
                  type="button"
                  aria-pressed={selectedType === 'patient'}
                  disabled={isSubmitting}
                  className="flex w-full items-center space-x-2 p-4 rounded-lg border-2 cursor-pointer hover:bg-slate-50 transition-colors"
                  style={{ borderColor: selectedType === 'patient' ? '#8B5CF6' : '#E5E7EB', backgroundColor: selectedType === 'patient' ? '#F3E8FF' : 'transparent' }}
                  onClick={() => setSelectedType('patient')}
                >
                  <span className="flex items-center gap-2 flex-1">
                    <UserCircle className="w-5 h-5" style={{ color: '#8B5CF6' }} />
                    <span style={{ color: '#1F2937' }}>Paciente/Usuário</span>
                  </span>
                  {selectedType === 'patient' && (
                    <span className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: '#8B5CF6' }}>
                      <span className="w-2 h-2 rounded-full bg-white" />
                    </span>
                  )}
                </button>
                <button
                  type="button"
                  aria-pressed={selectedType === 'therapist'}
                  disabled={isSubmitting}
                  className="flex w-full items-center space-x-2 p-4 rounded-lg border-2 cursor-pointer hover:bg-slate-50 transition-colors"
                  style={{ borderColor: selectedType === 'therapist' ? '#3B82F6' : '#E5E7EB', backgroundColor: selectedType === 'therapist' ? '#DBEAFE' : 'transparent' }}
                  onClick={() => setSelectedType('therapist')}
                >
                  <span className="flex items-center gap-2 flex-1">
                    <Stethoscope className="w-5 h-5" style={{ color: '#3B82F6' }} />
                    <span style={{ color: '#1F2937' }}>Terapeuta</span>
                  </span>
                  {selectedType === 'therapist' && (
                    <span className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: '#3B82F6' }}>
                      <span className="w-2 h-2 rounded-full bg-white" />
                    </span>
                  )}
                </button>
              </div>
            </div>

            {selectedType === 'patient' ? (
              <>
                {state?.registrationMessage && (
                  <p role="status" className="rounded-lg border border-green-300 bg-green-50 p-3 text-sm text-green-800">
                    {state.registrationMessage}
                  </p>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email" style={{ color: '#1F2937' }}>Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="username"
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
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    minLength={6}
                    maxLength={128}
                    required
                  />
                  <div className="text-right">
                    <Link to="/forgot-password" className="text-xs hover:underline" style={{ color: '#8B5CF6' }}>
                      Esqueci minha senha
                    </Link>
                  </div>
                </div>

                {formError && (
                  <p role="alert" className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-800">
                    {formError}
                  </p>
                )}

                <Button type="submit" disabled={isSubmitting || isRestoringSession} className="w-full text-white" style={{ backgroundColor: '#8B5CF6' }}>
                  {isSubmitting ? 'Entrando…' : 'Entrar'}
                </Button>
              </>
            ) : (
              <p className="text-sm text-slate-600">As telas de terapeuta estão disponíveis no modo visitante.</p>
            )}

            <div className="space-y-3">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                disabled={isSubmitting || isRestoringSession}
                onClick={handleGuestLogin}
                style={{ borderColor: selectedType === 'patient' ? '#8B5CF6' : '#3B82F6', color: selectedType === 'patient' ? '#8B5CF6' : '#3B82F6' }}
              >
                <Eye className="w-4 h-4 mr-2" />
                Modo Visitante {selectedType === 'therapist' ? '(Demo)' : ''}
              </Button>
              <p className="text-xs text-center" style={{ color: '#6B7280' }}>
                Explore o app com dados fictícios. Os dados da demonstração são descartados ao sair ou recarregar.
              </p>
            </div>

            {selectedType === 'patient' && (
              <div className="text-center text-sm">
                <span style={{ color: '#6B7280' }}>Não tem uma conta? </span>
                <Link to="/register" className="hover:underline" style={{ color: '#8B5CF6' }}>
                  Criar conta
                </Link>
              </div>
            )}

            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 border-t pt-4 text-sm">
              <Link to="/terms" className="min-h-11 inline-flex items-center text-slate-600 underline-offset-4 hover:underline">
                Termos de Uso
              </Link>
              <Link to="/privacy" className="min-h-11 inline-flex items-center text-slate-600 underline-offset-4 hover:underline">
                Política de Privacidade
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
