import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { BookMarked, Home, BookOpen, ClipboardList, Brain, Dumbbell, TrendingUp, Timer, HelpCircle } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../components/ui/accordion';

export default function PatientManual() {
  const sections = [
    {
      id: 'getting-started',
      title: 'Primeiros Passos',
      icon: Home,
      content: `O ChainFree é uma ferramenta de apoio complementar para pessoas com TOC. Para começar:

1. Navegue pelo menu lateral para acessar as diferentes funcionalidades
2. Comece pela seção de Psicoeducação para aprender mais sobre o TOC
3. Use o Mapeamento para registrar suas compulsões e obsessões
4. Registre exercícios de EPR conforme orientação do seu terapeuta
5. Acompanhe seu progresso ao longo do tempo

Lembre-se: o ChainFree não substitui o acompanhamento profissional!`,
    },
    {
      id: 'psychoeducation',
      title: 'Psicoeducação',
      icon: BookOpen,
      content: `A seção de Psicoeducação oferece três módulos informativos:

• O que é o TOC: Entenda o transtorno, suas características e como ele afeta a vida das pessoas
• Tratamentos Psicológicos: Conheça a Terapia Cognitivo-Comportamental e a técnica de EPR
• Tratamentos Psiquiátricos: Saiba sobre os medicamentos usados no tratamento

Ler esses conteúdos ajudará você a entender melhor sua condição e as opções de tratamento disponíveis.`,
    },
    {
      id: 'ybocs',
      title: 'Escala Y-BOCS',
      icon: ClipboardList,
      content: `A Escala Y-BOCS (Yale-Brown Obsessive Compulsive Scale) é uma ferramenta de avaliação dos sintomas do TOC.

Como usar:
1. Responda honestamente a cada pergunta
2. Considere como você tem se sentido nos últimos dias
3. Ao final, você verá uma pontuação e interpretação
4. Compartilhe os resultados com seu terapeuta

Esta é uma versão simplificada. Uma avaliação completa deve ser feita por um profissional.`,
    },
    {
      id: 'mapping',
      title: 'Mapeamento',
      icon: Brain,
      content: `O Mapeamento permite registrar suas compulsões e obsessões:

1. Clique em "Adicionar" para criar um novo registro
2. Escolha o tipo (limpeza, verificação, ordem, etc.)
3. Descreva detalhadamente a compulsão ou obsessão
4. Os registros ficarão organizados em cards

Benefícios:
• Aumenta a consciência sobre seus sintomas
• Ajuda a identificar padrões
• Facilita a comunicação com o terapeuta
• Serve de base para os exercícios de EPR`,
    },
    {
      id: 'epr',
      title: 'Exercícios EPR',
      icon: Dumbbell,
      content: `A Exposição e Prevenção de Resposta (EPR) é a técnica central no tratamento do TOC.

Como registrar exercícios:
1. Crie um exercício associado a uma compulsão mapeada
2. Defina a duração planejada
3. Descreva como você realizará o exercício
4. Use o temporizador durante a prática
5. Marque como concluído quando terminar

IMPORTANTE: Os exercícios de EPR devem ser realizados com orientação profissional. Não inicie por conta própria.`,
    },
    {
      id: 'progress',
      title: 'Tracker de Progresso',
      icon: TrendingUp,
      content: `Acompanhe a evolução dos seus sintomas ao longo do tempo:

Como usar:
1. Registre diariamente a intensidade dos seus sintomas (0-10)
2. Visualize a evolução no gráfico
3. Observe as tendências (melhora, piora ou estável)
4. Compartilhe os dados com seu terapeuta

Dicas:
• Seja honesto(a) nas avaliações
• Registre no mesmo horário todos os dias
• Não desanime com oscilações - a recuperação não é linear
• Celebre pequenas vitórias!`,
    },
    {
      id: 'timer',
      title: 'Temporizador',
      icon: Timer,
      content: `O temporizador é uma ferramenta para cronometrar sessões de EPR:

Como usar:
1. Defina um tempo usando os botões pré-definidos (5, 10, 15, 30 min)
2. Ou inicie do zero para cronometrar livremente
3. Clique em "Iniciar" antes de começar o exercício
4. Mantenha-se na exposição até o tempo acabar
5. A ansiedade naturalmente diminuirá (habituação)

O tempo de exposição deve ser definido com seu terapeuta.`,
    },
    {
      id: 'questions',
      title: 'Perguntas ao Terapeuta',
      icon: HelpCircle,
      content: `Mantenha contato com seu terapeuta entre as sessões:

Como funciona:
1. Escreva sua pergunta de forma clara e específica
2. O terapeuta receberá a pergunta
3. Você será notificado quando houver uma resposta
4. As perguntas e respostas ficam registradas para consulta

Lembre-se:
• Esta não é uma forma de atendimento emergencial
• Em caso de crise, procure ajuda presencial imediata
• Use para dúvidas sobre o tratamento, exercícios, etc.`,
    },
  ];

  return (
    <div className="p-4 w-full max-w-full overflow-x-hidden">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <BookMarked className="w-8 h-8" style={{ color: '#8B5CF6' }} />
          <h1 className="text-2xl" style={{ color: '#1F2937' }}>
            Manual do Usuário
          </h1>
        </div>
        <p style={{ color: '#6B7280' }}>
          Guia completo de uso do ChainFree para pacientes
        </p>
      </div>

      <Card className="mb-6" style={{ backgroundColor: '#F3E8FF', borderColor: '#8B5CF6' }}>
        <CardHeader>
          <CardTitle style={{ color: '#1F2937' }}>Bem-vindo ao ChainFree!</CardTitle>
          <CardDescription>
            Este manual explica como usar cada funcionalidade do aplicativo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm" style={{ color: '#6B7280' }}>
            O ChainFree foi desenvolvido para ser uma ferramenta de apoio complementar no tratamento do TOC. 
            Explore as seções abaixo para aprender a usar cada funcionalidade.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <Accordion type="single" collapsible className="w-full">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <AccordionItem key={section.id} value={section.id}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: '#F3E8FF' }}
                      >
                        <Icon className="w-5 h-5" style={{ color: '#8B5CF6' }} />
                      </div>
                      <span className="text-left" style={{ color: '#1F2937' }}>
                        {section.title}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pl-13 pr-4 pt-2">
                      <p className="text-sm whitespace-pre-line" style={{ color: '#6B7280' }}>
                        {section.content}
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </CardContent>
      </Card>

      <Card className="mt-8" style={{ borderColor: '#F59E0B', backgroundColor: '#FEF3C7' }}>
        <CardHeader>
          <CardTitle style={{ color: '#1F2937' }}>⚠️ Importante</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm" style={{ color: '#6B7280' }}>
            <li>• O ChainFree é uma ferramenta de apoio e NÃO substitui o acompanhamento profissional</li>
            <li>• Todas as atividades, especialmente EPR, devem ser orientadas por um terapeuta</li>
            <li>• Em caso de crise ou pensamentos de autolesão, procure ajuda imediata</li>
            <li>• Mantenha contato regular com seu profissional de saúde mental</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
