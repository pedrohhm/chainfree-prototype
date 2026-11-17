import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { BookMarked, Home, Users, MessageSquare, FileEdit, FileText } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../components/ui/accordion';

export default function TherapistManual() {
  const sections = [
    {
      id: 'getting-started',
      title: 'Visão Geral',
      icon: Home,
      content: `O ChainFree para Terapeutas oferece ferramentas para acompanhar remotamente o progresso dos seus pacientes e facilitar a comunicação entre sessões.

Funcionalidades principais:
1. Visualizar dados dos pacientes (compulsões, exercícios EPR, progresso)
2. Responder perguntas enviadas pelos pacientes
3. Criar notas e sugestões de tratamento
4. Gerar relatórios de evolução

Use o menu lateral para navegar entre as diferentes seções.`,
    },
    {
      id: 'patients',
      title: 'Visualizar Pacientes',
      icon: Users,
      content: `A seção de Pacientes permite acompanhar o progresso de cada paciente:

Como usar:
1. Veja a lista de todos os pacientes ativos
2. Clique em um paciente para ver detalhes
3. Navegue pelas abas:
   • Compulsões: veja as compulsões mapeadas pelo paciente
   • Exercícios EPR: acompanhe os exercícios registrados e concluídos
   • Progresso: visualize gráficos e estatísticas de evolução

Benefícios:
• Acompanhar a adesão ao tratamento
• Identificar padrões e tendências
• Preparar-se melhor para as sessões presenciais
• Ajustar o plano de tratamento conforme necessário`,
    },
    {
      id: 'questions',
      title: 'Perguntas dos Pacientes',
      icon: MessageSquare,
      content: `Mantenha comunicação com seus pacientes entre as sessões:

Como funciona:
1. As perguntas enviadas pelos pacientes aparecem como "Pendentes"
2. Clique em "Responder" para enviar sua orientação
3. As respostas ficam registradas no histórico
4. Os pacientes são notificados quando você responde

Dicas:
• Responda de forma clara e objetiva
• Utilize linguagem acessível
• Se a questão for complexa, oriente o paciente a aguardar a próxima sessão
• Esta não é uma ferramenta de atendimento emergencial

Lembre aos pacientes que questões urgentes requerem atendimento presencial.`,
    },
    {
      id: 'notes',
      title: 'Notas e Sugestões',
      icon: FileEdit,
      content: `Registre observações e recomendações para seus pacientes:

Como usar:
1. Clique em "Nova Nota" para criar uma anotação
2. Selecione o paciente
3. Adicione um título descritivo
4. Escreva suas observações, sugestões ou recomendações
5. As notas ficam organizadas por data

Aplicações:
• Registrar observações sobre o progresso
• Sugerir exercícios EPR específicos
• Documentar ajustes no plano de tratamento
• Compartilhar recomendações entre sessões
• Manter histórico de intervenções

Essas notas podem ser compartilhadas com o paciente ou usadas apenas para seu registro clínico.`,
    },
    {
      id: 'reports',
      title: 'Gerar Relatórios',
      icon: FileText,
      content: `Crie relatórios de evolução dos pacientes:

Como gerar:
1. Selecione o paciente
2. Escolha o período (semana, mês, trimestre ou todo o período)
3. Clique em "Gerar Relatório"
4. Revise as informações apresentadas
5. Faça download em PDF se necessário

Informações incluídas:
• Dados demográficos do paciente
• Número de compulsões mapeadas
• Exercícios EPR concluídos
• Estatísticas de progresso
• Gráficos de evolução dos sintomas
• Espaço para observações clínicas

Use os relatórios para:
• Apresentar evolução ao paciente
• Documentação clínica
• Compartilhar com outros profissionais (com consentimento)
• Avaliar eficácia do tratamento`,
    },
  ];

  return (
    <div className="p-4 w-full max-w-full overflow-x-hidden">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <BookMarked className="w-8 h-8" style={{ color: '#3B82F6' }} />
          <h1 className="text-2xl" style={{ color: '#1F2937' }}>
            Manual do Terapeuta
          </h1>
        </div>
        <p style={{ color: '#6B7280' }}>
          Guia completo de uso do ChainFree para profissionais
        </p>
      </div>

      <Card className="mb-6" style={{ backgroundColor: '#DBEAFE', borderColor: '#3B82F6' }}>
        <CardHeader>
          <CardTitle style={{ color: '#1F2937' }}>Bem-vindo(a) ao ChainFree!</CardTitle>
          <CardDescription>
            Ferramentas para aprimorar o acompanhamento dos seus pacientes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm" style={{ color: '#6B7280' }}>
            O ChainFree foi desenvolvido para complementar o atendimento presencial, permitindo acompanhar 
            remotamente o progresso dos pacientes, manter comunicação entre sessões e gerar relatórios de evolução.
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
                        style={{ backgroundColor: '#DBEAFE' }}
                      >
                        <Icon className="w-5 h-5" style={{ color: '#3B82F6' }} />
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

      <Card className="mt-8" style={{ borderColor: '#3B82F6' }}>
        <CardHeader>
          <CardTitle style={{ color: '#1F2937' }}>Considerações Importantes</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm" style={{ color: '#6B7280' }}>
            <li>• O ChainFree é uma ferramenta complementar e não substitui as sessões presenciais</li>
            <li>• Mantenha a confidencialidade e siga as normas éticas da profissão</li>
            <li>• As respostas às perguntas não constituem atendimento emergencial</li>
            <li>• Oriente os pacientes sobre o uso adequado da plataforma</li>
            <li>• Use os relatórios para documentação clínica e avaliação de progresso</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
