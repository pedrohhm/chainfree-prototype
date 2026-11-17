import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router';

export default function PsychologicalTreatments() {
  return (
    <div className="p-4 w-full max-w-full overflow-x-hidden">
      <Link to="/patient/psychoeducation">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para Psicoeducação
        </Button>
      </Link>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl" style={{ color: '#1F2937' }}>
            Tratamentos Psicológicos para o TOC
          </CardTitle>
        </CardHeader>
        <CardContent className="prose max-w-none">
          <div className="space-y-4" style={{ color: '#6B7280' }}>
            <p>
              A psicoterapia é considerada um dos tratamentos mais eficazes para o TOC. A abordagem mais estudada 
              e com maior evidência científica é a Terapia Cognitivo-Comportamental (TCC).
            </p>
            
            <h3 className="text-xl font-semibold mt-6" style={{ color: '#1F2937' }}>
              Terapia Cognitivo-Comportamental (TCC)
            </h3>
            <p>
              A TCC para TOC envolve ajudar o paciente a entender seus pensamentos e comportamentos, e desenvolver 
              estratégias para modificá-los. O foco está em identificar e desafiar crenças distorcidas relacionadas 
              às obsessões.
            </p>
            
            <h3 className="text-xl font-semibold mt-6" style={{ color: '#1F2937' }}>
              Exposição e Prevenção de Resposta (EPR)
            </h3>
            <p>
              A EPR é a técnica central da TCC para TOC. Consiste em:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Exposição:</strong> Confrontar gradualmente situações, pensamentos ou objetos que provocam 
                ansiedade e obsessões, sem realizar a compulsão
              </li>
              <li>
                <strong>Prevenção de Resposta:</strong> Resistir ao impulso de realizar o comportamento compulsivo 
                após a exposição
              </li>
            </ul>
            
            <h3 className="text-xl font-semibold mt-6" style={{ color: '#1F2937' }}>Como funciona a EPR?</h3>
            <p>
              Com a prática repetida, a ansiedade diminui naturalmente ao longo do tempo (habituação), e a pessoa 
              aprende que as consequências temidas geralmente não ocorrem ou não são tão graves quanto imaginava.
            </p>
            
            <div className="bg-purple-50 p-4 rounded-lg mt-6" style={{ borderLeft: '4px solid #8B5CF6' }}>
              <p className="font-semibold" style={{ color: '#8B5CF6' }}>Importante:</p>
              <p>
                Os exercícios de EPR devem ser realizados com orientação de um profissional qualificado. O ChainFree 
                pode ajudar a registrar e acompanhar esses exercícios, mas não substitui o acompanhamento terapêutico.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
