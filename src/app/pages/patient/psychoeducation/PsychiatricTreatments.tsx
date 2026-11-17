import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router';

export default function PsychiatricTreatments() {
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
            Tratamentos Psiquiátricos para o TOC
          </CardTitle>
        </CardHeader>
        <CardContent className="prose max-w-none">
          <div className="space-y-4" style={{ color: '#6B7280' }}>
            <p>
              O tratamento medicamentoso pode ser uma opção importante para muitas pessoas com TOC, especialmente 
              quando os sintomas são graves ou quando a psicoterapia sozinha não é suficiente.
            </p>
            
            <h3 className="text-xl font-semibold mt-6" style={{ color: '#1F2937' }}>
              Inibidores Seletivos de Recaptação de Serotonina (ISRS)
            </h3>
            <p>
              Os medicamentos mais comumente prescritos para TOC são os ISRS, que incluem:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Fluoxetina</li>
              <li>Sertralina</li>
              <li>Paroxetina</li>
              <li>Fluvoxamina</li>
              <li>Escitalopram</li>
            </ul>
            
            <h3 className="text-xl font-semibold mt-6" style={{ color: '#1F2937' }}>
              Antidepressivos Tricíclicos
            </h3>
            <p>
              A Clomipramina é um antidepressivo tricíclico que também demonstrou eficácia no tratamento do TOC 
              e pode ser considerada quando os ISRS não são eficazes.
            </p>
            
            <h3 className="text-xl font-semibold mt-6" style={{ color: '#1F2937' }}>Considerações Importantes</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Os medicamentos geralmente levam de 8 a 12 semanas para mostrar efeito completo</li>
              <li>As doses para TOC são frequentemente maiores do que as usadas para depressão</li>
              <li>A combinação de medicação com psicoterapia (especialmente TCC/EPR) costuma ser mais eficaz</li>
              <li>Nunca interrompa a medicação sem orientação médica</li>
            </ul>
            
            <div className="bg-purple-50 p-4 rounded-lg mt-6" style={{ borderLeft: '4px solid #8B5CF6' }}>
              <p className="font-semibold" style={{ color: '#8B5CF6' }}>Atenção:</p>
              <p>
                Apenas um médico psiquiatra pode prescrever e ajustar medicamentos. Nunca se automedique ou altere 
                doses sem orientação profissional. Este conteúdo é apenas informativo e não substitui uma consulta médica.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
