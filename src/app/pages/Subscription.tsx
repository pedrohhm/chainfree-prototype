import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { useApp } from '../context/AppContext';
import { Check, Crown, ArrowLeft, Cloud, Users, Palette, FileBarChart, FolderKanban } from 'lucide-react';

export default function Subscription() {
  const navigate = useNavigate();
  const { userType } = useApp();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubscribe = () => {
    setIsProcessing(true);
    // Simular processamento de pagamento
    setTimeout(() => {
      setIsProcessing(false);
      alert('Assinatura realizada com sucesso! 🎉');
      navigate(userType === 'patient' ? '/patient/dashboard' : '/therapist/dashboard');
    }, 2000);
  };

  const handleBack = () => {
    navigate(userType === 'patient' ? '/patient/dashboard' : '/therapist/dashboard');
  };

  const primaryColor = userType === 'patient' ? '#8B5CF6' : '#3B82F6';
  const lightColor = userType === 'patient' ? '#F3E8FF' : '#DBEAFE';

  const patientFeatures = [
    { icon: Cloud, text: 'Backup automático na nuvem' },
    { icon: Users, text: 'Sincronização com seu terapeuta' },
    { icon: Palette, text: 'Maior customização da interface' },
    { icon: FolderKanban, text: 'Recursos de organização' },
  ];

  const therapistFeatures = [
    { icon: Cloud, text: 'Backup automático na nuvem' },
    { icon: Users, text: 'Sincronização com pacientes' },
    { icon: FileBarChart, text: 'Geração automatizada de relatórios' },
    { icon: Palette, text: 'Maior customização da interface' },
    { icon: FolderKanban, text: 'Recursos de organização' },
  ];

  const features = userType === 'patient' ? patientFeatures : therapistFeatures;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-6" style={{ backgroundColor: '#F8FAFC' }}>
      <div className="w-full max-w-2xl">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={handleBack}
          style={{ color: primaryColor }}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>

        <Card style={{ borderColor: primaryColor, borderWidth: '2px' }}>
          <CardHeader className="text-center">
            <div
              className="mx-auto mb-4 w-20 h-20 rounded-full flex items-center justify-center"
              style={{ backgroundColor: lightColor }}
            >
              <Crown className="w-10 h-10" style={{ color: primaryColor }} />
            </div>
            <CardTitle className="text-2xl mb-2" style={{ color: '#1F2937' }}>
              ChainFree Premium
            </CardTitle>
            <CardDescription className="text-lg">
              Desbloqueie todo o potencial do aplicativo
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Preço */}
            <div className="text-center py-6 rounded-lg" style={{ backgroundColor: lightColor }}>
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-xl" style={{ color: '#6B7280' }}>R$</span>
                <span className="text-5xl font-bold" style={{ color: primaryColor }}>9,90</span>
                <span className="text-lg" style={{ color: '#6B7280' }}>/mês</span>
              </div>
              <p className="mt-2 text-sm" style={{ color: '#6B7280' }}>
                Cancele a qualquer momento
              </p>
            </div>

            {/* Vantagens */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-center" style={{ color: '#1F2937' }}>
                Vantagens Exclusivas
              </h3>
              <div className="space-y-3">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-4 rounded-lg border"
                      style={{ borderColor: '#E5E7EB', backgroundColor: 'white' }}
                    >
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: lightColor }}
                      >
                        <Icon className="w-5 h-5" style={{ color: primaryColor }} />
                      </div>
                      <span style={{ color: '#1F2937' }}>{feature.text}</span>
                      <Check className="w-5 h-5 ml-auto flex-shrink-0" style={{ color: '#10B981' }} />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Botão de Assinatura */}
            <Button
              className="w-full text-white py-6"
              style={{ backgroundColor: primaryColor }}
              onClick={handleSubscribe}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processando...
                </span>
              ) : (
                <>
                  <Crown className="w-5 h-5 mr-2" />
                  Assinar ChainFree Premium
                </>
              )}
            </Button>

            {/* Garantia */}
            <div className="text-center p-4 rounded-lg" style={{ backgroundColor: '#F0FDF4', borderLeft: '4px solid #10B981' }}>
              <p className="text-sm" style={{ color: '#065F46' }}>
                ✓ Garantia de 7 dias - Teste sem compromisso
              </p>
            </div>

            {/* Informações adicionais */}
            <div className="text-center text-xs" style={{ color: '#9CA3AF' }}>
              <p>Pagamento seguro e criptografado</p>
              <p className="mt-1">A assinatura renova automaticamente a cada mês</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
