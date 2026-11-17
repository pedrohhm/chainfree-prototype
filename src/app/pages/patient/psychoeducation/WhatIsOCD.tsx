import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router';

export default function WhatIsOCD() {
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
            O que é o TOC
          </CardTitle>
        </CardHeader>
        <CardContent className="prose max-w-none">
          <div className="space-y-4" style={{ color: '#6B7280' }}>
            <p>
              O Transtorno Obsessivo-Compulsivo (TOC) é um transtorno mental caracterizado pela presença de obsessões 
              e/ou compulsões que causam sofrimento significativo e interferem na vida diária da pessoa.
            </p>
            
            <h3 className="text-xl font-semibold mt-6" style={{ color: '#1F2937' }}>Obsessões</h3>
            <p>
              São pensamentos, imagens ou impulsos intrusivos, recorrentes e persistentes que causam ansiedade ou 
              desconforto intenso. A pessoa reconhece que esses pensamentos são produtos de sua própria mente, mas 
              tem dificuldade em controlá-los.
            </p>
            
            <h3 className="text-xl font-semibold mt-6" style={{ color: '#1F2937' }}>Compulsões</h3>
            <p>
              São comportamentos repetitivos (como lavar as mãos, verificar, contar) ou atos mentais (como rezar, 
              repetir palavras mentalmente) que a pessoa se sente compelida a executar em resposta a uma obsessão 
              ou de acordo com regras que devem ser rigidamente aplicadas.
            </p>
            
            <h3 className="text-xl font-semibold mt-6" style={{ color: '#1F2937' }}>Características</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>As obsessões e compulsões consomem tempo (mais de uma hora por dia)</li>
              <li>Causam sofrimento significativo</li>
              <li>Interferem na rotina, no trabalho ou nas relações sociais</li>
              <li>A pessoa reconhece que são excessivas ou irracionais</li>
            </ul>
            
            <div className="bg-purple-50 p-4 rounded-lg mt-6" style={{ borderLeft: '4px solid #8B5CF6' }}>
              <p className="font-semibold" style={{ color: '#8B5CF6' }}>Lembre-se:</p>
              <p>
                O TOC é um transtorno tratável. Com o tratamento adequado, que pode incluir terapia cognitivo-comportamental 
                e, em alguns casos, medicação, é possível reduzir significativamente os sintomas e melhorar a qualidade de vida.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
