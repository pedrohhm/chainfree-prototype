import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group';
import { Label } from '../../components/ui/label';
import { useApp } from '../../context/AppContext';
import { CheckCircle, Lock, ChevronRight, AlertCircle, RotateCcw } from 'lucide-react';

// ─── Data ───────────────────────────────────────────────────────────────────

const dim1Symptoms = [
  {
    id: 's1',
    text: 'Tenho obsessões de que eu posso me ferir (ex.: medo de ferir a si mesmo com objetos pontiagudos, medo de se jogar na frente de um carro).',
  },
  {
    id: 's2',
    text: 'Tenho obsessões de que vou ferir outras pessoas sem querer (ex.: medo de estar envolvido em acidente de carro, de ser responsável por uma catástrofe).',
  },
  {
    id: 's3',
    text: 'Tenho imagens violentas ou horrendas na cabeça (ex.: imagens de assassinatos, acidentes ou corpos desmembrados).',
  },
  {
    id: 's4',
    text: 'Verifico se não feri outros ou se outros não foram feridos (ex.: perguntar para se reassegurar, ligar para certificar que tudo está bem).',
  },
  {
    id: 's5',
    text: 'Preciso repetir atividades rotineiras para prevenir consequências terríveis relacionadas a pensamentos de violência ou agressão.',
  },
];

const severityQuestions = [
  {
    id: 'freq',
    text: 'Quanto do seu tempo é ocupado por estas obsessões e compulsões? Considere também o tempo gasto com comportamentos de esquiva.',
    options: [
      { value: 0, label: '0 — Nenhum' },
      { value: 1, label: '1 — Raramente (menos de 3 horas/semana)' },
      { value: 2, label: '2 — Ocasionalmente (mais de 3 h/sem, menos de 1 h/dia)' },
      { value: 3, label: '3 — Frequentemente (1 a 3 horas/dia)' },
      { value: 4, label: '4 — Quase sempre (3 a 8 horas/dia)' },
      { value: 5, label: '5 — Sempre (mais de 8 horas/dia)' },
    ],
  },
  {
    id: 'discomfort',
    text: 'Quanto incômodo (ansiedade, culpa, medo) estas obsessões e compulsões causam?',
    options: [
      { value: 0, label: '0 — Nenhum incômodo' },
      { value: 1, label: '1 — Mínimo' },
      { value: 2, label: '2 — Médio — algum incômodo, mas não muito' },
      { value: 3, label: '3 — Moderado — incomoda, mas ainda tolerável' },
      { value: 4, label: '4 — Grave — incomoda muito' },
      { value: 5, label: '5 — Extremo — incômodo quase constante e muito intenso' },
    ],
  },
  {
    id: 'interference',
    text: 'Quanto estas obsessões e compulsões interferem na sua vida familiar, social ou profissional?',
    options: [
      { value: 0, label: '0 — Nenhuma interferência' },
      { value: 1, label: '1 — Mínima — leve interferência, desempenho geralmente preservado' },
      { value: 2, label: '2 — Média — alguma interferência, desempenho afetado em algum grau' },
      { value: 3, label: '3 — Moderada — interferência bem definida, mas ainda tolerável' },
      { value: 4, label: '4 — Grave — grande interferência nas atividades' },
      { value: 5, label: '5 — Extrema — incapacitante' },
    ],
  },
];

const pendingDimensions = [
  'Obsessões Sexuais e Religiosas e Compulsões Relacionadas',
  'Obsessões e Compulsões de Simetria, Ordem, Contagem e Arranjo',
  'Obsessões de Contaminação e Compulsões de Limpeza',
  'Obsessões e Compulsões de Acumulação',
  'Obsessões e Compulsões Diversas',
];

type Step = 'intro' | 'checklist' | 'severity' | 'result';

// ─── Component ───────────────────────────────────────────────────────────────

export default function DYBOCS() {
  const { setYbocScore, ybocScore } = useApp();

  const [step, setStep] = useState<Step>('intro');
  const [checkedSymptoms, setCheckedSymptoms] = useState<Record<string, 'past' | 'current' | null>>({});
  const [severity, setSeverity] = useState<Record<string, number>>({});
  const [liveMessage, setLiveMessage] = useState('');

  const totalScore = Object.values(severity).reduce((s, v) => s + v, 0);
  const allSeverityAnswered = severityQuestions.every((q) => severity[q.id] !== undefined);

  const hasAnyCurrentSymptom = Object.values(checkedSymptoms).some((v) => v === 'current');

  const getSeverity = (score: number) => {
    if (score === 0) return { level: 'Ausente', color: '#10B981', bg: '#ECFDF5' };
    if (score <= 5) return { level: 'Leve', color: '#F59E0B', bg: '#FFFBEB' };
    if (score <= 10) return { level: 'Moderado', color: '#EF4444', bg: '#FEF2F2' };
    return { level: 'Grave', color: '#DC2626', bg: '#FEF2F2' };
  };

  const handleCalculate = () => {
    setYbocScore(totalScore);
    setLiveMessage(`Resultado calculado. Pontuação: ${totalScore} de 15 — ${getSeverity(totalScore).level}.`);
    setStep('result');
  };

  const handleReset = () => {
    setStep('intro');
    setCheckedSymptoms({});
    setSeverity({});
    setLiveMessage('');
  };

  const toggleSymptom = (id: string, value: 'past' | 'current') => {
    setCheckedSymptoms((prev) => ({
      ...prev,
      [id]: prev[id] === value ? null : value,
    }));
  };

  return (
    <div className="p-4 w-full max-w-full overflow-x-hidden">
      {/* Live region (RA10) */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {liveMessage}
      </div>

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start gap-3">
          <div className="min-w-0">
            <h1 className="text-xl font-bold leading-tight" style={{ color: '#1F2937' }}>
              Escala DY-BOCS
            </h1>
            <p className="text-sm mt-0.5" style={{ color: '#6B7280' }}>
              Escala Yale-Brown Dimensional de Sintomas Obsessivo-Compulsivos
            </p>
          </div>
        </div>

        {/* Auto-aplicável badge */}
        <div
          className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium"
          style={{ backgroundColor: '#EDE9FE', color: '#7C3AED' }}
          role="note"
          aria-label="Esta escala é auto-aplicável — preenchida pelo próprio paciente"
        >
          <CheckCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
          Auto-aplicável — preenchida por você mesmo
        </div>
      </div>

      {/* ── STEP: INTRO ─────────────────────────────────────────────────────── */}
      {step === 'intro' && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base" style={{ color: '#1F2937' }}>
                O que é a DY-BOCS?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm" style={{ color: '#374151' }}>
              <p>
                A <strong>Escala Yale-Brown Dimensional de Sintomas Obsessivo-Compulsivos (DY-BOCS)</strong> avalia
                a presença e a gravidade dos sintomas obsessivo-compulsivos organizados em seis dimensões clínicas.
              </p>
              <p>
                Para cada dimensão, você primeiro identifica quais sintomas esteve presente na última semana
                (ou no passado), e depois avalia a <strong>frequência</strong>, o <strong>incômodo</strong> e a{' '}
                <strong>interferência</strong> causados por esses sintomas.
              </p>
              <div
                className="p-3 rounded-lg flex gap-2"
                style={{ backgroundColor: '#FEF3C7', borderLeft: '4px solid #F59E0B' }}
              >
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#B45309' }} aria-hidden="true" />
                <p style={{ color: '#92400E' }}>
                  Esta escala é um instrumento de apoio ao acompanhamento clínico. Os resultados devem ser
                  discutidos com seu terapeuta. Não substitui uma avaliação profissional.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base" style={{ color: '#1F2937' }}>
                Definições importantes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm" style={{ color: '#374151' }}>
              <div>
                <p className="font-semibold mb-1">Obsessões</p>
                <p>
                  Pensamentos, medos ou imagens intrusivos e repetitivos. Persistem mesmo que você tente ignorá-los
                  ou suprimi-los.
                </p>
              </div>
              <div>
                <p className="font-semibold mb-1">Compulsões</p>
                <p>
                  Atos repetitivos, comportamentos ou rituais mentais que você sente que "tem que" realizar para
                  reduzir o desconforto causado pelas obsessões.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Dimensões disponíveis */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base" style={{ color: '#1F2937' }}>Dimensões da escala</CardTitle>
              <CardDescription>Disponível agora e em breve</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {/* Dim 1 — available */}
              <div
                className="flex items-center gap-3 p-3 rounded-lg min-h-[52px]"
                style={{ backgroundColor: '#EDE9FE' }}
              >
                <span
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{ backgroundColor: '#7C3AED', color: 'white' }}
                  aria-hidden="true"
                >1</span>
                <span className="text-sm font-medium" style={{ color: '#3B0764' }}>
                  Obsessões sobre Agressão, Violência, Desastres Naturais e Compulsões Relacionadas
                </span>
              </div>
              {/* Dims 2–6 — coming soon */}
              {pendingDimensions.map((dim, i) => (
                <div
                  key={dim}
                  className="flex items-center gap-3 p-3 rounded-lg min-h-[52px]"
                  style={{ backgroundColor: '#F9FAFB' }}
                  aria-label={`Dimensão ${i + 2}: ${dim} — em breve`}
                >
                  <span
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{ backgroundColor: '#E5E7EB', color: '#9CA3AF' }}
                    aria-hidden="true"
                  >{i + 2}</span>
                  <span className="text-sm flex-1" style={{ color: '#9CA3AF' }}>{dim}</span>
                  <Lock className="w-4 h-4 flex-shrink-0" style={{ color: '#9CA3AF' }} aria-hidden="true" />
                </div>
              ))}
            </CardContent>
          </Card>

          <Button
            className="w-full text-white min-h-[48px] text-base"
            style={{ backgroundColor: '#7C3AED' }}
            onClick={() => { setStep('checklist'); setLiveMessage('Iniciando lista de sintomas da Dimensão 1.'); }}
          >
            Iniciar Avaliação
            <ChevronRight className="w-4 h-4 ml-2" aria-hidden="true" />
          </Button>
        </div>
      )}

      {/* ── STEP: CHECKLIST ──────────────────────────────────────────────────── */}
      {step === 'checklist' && (
        <div className="space-y-4">
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium"
            style={{ backgroundColor: '#EDE9FE', color: '#7C3AED' }}
          >
            <span aria-hidden="true" className="font-bold">Dimensão 1</span>
            <span>— Agressão, Violência e Desastres Naturais</span>
          </div>

          <Card>
            <CardContent className="pt-4 pb-2">
              <p className="text-sm mb-4" style={{ color: '#374151' }}>
                <strong>Pergunta de rastreamento:</strong> Você já teve pensamentos, ideias, medos ou imagens
                intrusivos relacionados a se agredir ou agredir outras pessoas? E comportamentos realizados
                com o objetivo de reduzir o desconforto causado por esses pensamentos?
              </p>
              <p className="text-xs mb-3" style={{ color: '#6B7280' }}>
                Para cada sintoma abaixo, indique se esteve presente no passado ou na última semana (atual).
              </p>
            </CardContent>
          </Card>

          <fieldset aria-label="Lista de sintomas da Dimensão 1">
            <legend className="sr-only">
              Selecione os sintomas presentes: passado ou atual (última semana)
            </legend>
            <div className="space-y-3">
              {dim1Symptoms.map((symptom, idx) => (
                <Card key={symptom.id}>
                  <CardContent className="pt-4 pb-4">
                    <p className="text-sm mb-3" style={{ color: '#1F2937' }}>
                      <span className="font-semibold" style={{ color: '#7C3AED' }}>{idx + 1}. </span>
                      {symptom.text}
                    </p>
                    <div className="flex gap-3 flex-wrap">
                      {(['past', 'current'] as const).map((timing) => {
                        const label = timing === 'past' ? 'Passado' : 'Atual (última semana)';
                        const isChecked = checkedSymptoms[symptom.id] === timing;
                        return (
                          <button
                            key={timing}
                            type="button"
                            role="checkbox"
                            aria-checked={isChecked}
                            aria-label={`${label}: ${symptom.text}`}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-colors min-h-[48px]"
                            style={{
                              backgroundColor: isChecked
                                ? timing === 'current' ? '#EDE9FE' : '#F3F4F6'
                                : 'white',
                              borderColor: isChecked
                                ? timing === 'current' ? '#7C3AED' : '#6B7280'
                                : '#E5E7EB',
                              color: isChecked
                                ? timing === 'current' ? '#7C3AED' : '#374151'
                                : '#6B7280',
                            }}
                            onClick={() => toggleSymptom(symptom.id, timing)}
                          >
                            <span
                              className="w-4 h-4 rounded border flex items-center justify-center flex-shrink-0"
                              style={{
                                backgroundColor: isChecked ? (timing === 'current' ? '#7C3AED' : '#6B7280') : 'white',
                                borderColor: isChecked ? 'transparent' : '#D1D5DB',
                              }}
                              aria-hidden="true"
                            >
                              {isChecked && <CheckCircle className="w-3 h-3 text-white" />}
                            </span>
                            {label}
                          </button>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </fieldset>

          {/* Placeholder note */}
          <Card style={{ borderColor: '#D1D5DB', borderStyle: 'dashed' }}>
            <CardContent className="pt-4">
              <p className="text-xs text-center" style={{ color: '#9CA3AF' }}>
                Os demais sintomas desta dimensão (itens 6–15) estarão disponíveis em uma versão futura.
              </p>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1 min-h-[48px]"
              onClick={() => setStep('intro')}
            >
              Voltar
            </Button>
            <Button
              className="flex-1 text-white min-h-[48px]"
              style={{ backgroundColor: '#7C3AED' }}
              onClick={() => {
                setStep('severity');
                setLiveMessage('Avançando para avaliação de gravidade da Dimensão 1.');
              }}
            >
              Avaliar Gravidade
              <ChevronRight className="w-4 h-4 ml-2" aria-hidden="true" />
            </Button>
          </div>
        </div>
      )}

      {/* ── STEP: SEVERITY ──────────────────────────────────────────────────── */}
      {step === 'severity' && (
        <div className="space-y-4">
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium"
            style={{ backgroundColor: '#EDE9FE', color: '#7C3AED' }}
          >
            <span aria-hidden="true" className="font-bold">Dimensão 1</span>
            <span>— Avaliação de Gravidade</span>
          </div>

          {!hasAnyCurrentSymptom && (
            <div
              className="flex gap-2 p-3 rounded-lg text-sm"
              style={{ backgroundColor: '#ECFDF5', borderLeft: '4px solid #10B981' }}
              role="note"
            >
              <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-emerald-600" aria-hidden="true" />
              <p style={{ color: '#065F46' }}>
                Você não marcou sintomas atuais. Se preferir, pode responder abaixo considerando se há algum
                incômodo geral nesta dimensão, ou atribuir pontuação zero a todas as questões.
              </p>
            </div>
          )}

          <p className="text-sm" style={{ color: '#6B7280' }}>
            Responda as perguntas abaixo considerando os sintomas desta dimensão{' '}
            <strong>na última semana</strong>.
          </p>

          {severityQuestions.map((q, idx) => {
            const isAnswered = severity[q.id] !== undefined;
            return (
              <Card key={q.id}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <CardDescription className="mb-1 text-xs">Questão {idx + 1} de 3</CardDescription>
                      <CardTitle className="text-base leading-snug" style={{ color: '#1F2937' }}>
                        {q.text}
                      </CardTitle>
                    </div>
                    {isAnswered && (
                      <CheckCircle className="w-5 h-5 flex-shrink-0 mt-1" style={{ color: '#10B981' }} aria-label="Respondida" />
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={severity[q.id]?.toString()}
                    onValueChange={(v) => setSeverity((prev) => ({ ...prev, [q.id]: parseInt(v) }))}
                    aria-label={q.text}
                  >
                    <div className="space-y-2">
                      {q.options.map((opt) => (
                        <div
                          key={opt.value}
                          className="flex items-center gap-3 p-2 rounded-lg min-h-[48px] hover:bg-purple-50 transition-colors"
                        >
                          <RadioGroupItem
                            value={opt.value.toString()}
                            id={`${q.id}-${opt.value}`}
                            className="min-w-[20px] min-h-[20px]"
                          />
                          <Label
                            htmlFor={`${q.id}-${opt.value}`}
                            className="cursor-pointer flex-1 text-sm leading-snug"
                            style={{ color: '#374151' }}
                          >
                            {opt.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
            );
          })}

          {/* Score preview */}
          <Card style={{ backgroundColor: '#EDE9FE', borderColor: '#7C3AED' }}>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-sm" style={{ color: '#1F2937' }}>
                    Pontuação parcial (Dimensão 1):
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: '#6B7280' }}>
                    {Object.keys(severity).length}/{severityQuestions.length} respondidas
                  </p>
                </div>
                <span className="text-2xl font-bold" style={{ color: '#7C3AED' }} aria-live="polite">
                  {totalScore}/15
                </span>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1 min-h-[48px]"
              onClick={() => setStep('checklist')}
            >
              Voltar
            </Button>
            <Button
              className="flex-1 text-white min-h-[48px]"
              style={{ backgroundColor: allSeverityAnswered ? '#7C3AED' : '#9CA3AF' }}
              disabled={!allSeverityAnswered}
              aria-disabled={!allSeverityAnswered}
              onClick={handleCalculate}
            >
              Ver Resultado
            </Button>
          </div>

          {!allSeverityAnswered && (
            <p className="text-xs text-center" style={{ color: '#6B7280' }}>
              Responda todas as {severityQuestions.length} questões para calcular o resultado.
            </p>
          )}
        </div>
      )}

      {/* ── STEP: RESULT ─────────────────────────────────────────────────────── */}
      {step === 'result' && (
        <div className="space-y-4" aria-live="polite">
          <Card>
            <CardHeader>
              <CardTitle style={{ color: '#1F2937' }}>Resultado — Dimensão 1</CardTitle>
              <CardDescription>Obsessões sobre Agressão, Violência e Desastres Naturais</CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className="text-center py-8 rounded-xl mb-6"
                style={{ backgroundColor: getSeverity(totalScore).bg }}
              >
                <div
                  className="text-6xl font-bold mb-2"
                  style={{ color: getSeverity(totalScore).color }}
                  aria-label={`Pontuação total: ${totalScore}`}
                >
                  {totalScore}
                </div>
                <div className="text-sm mb-1" style={{ color: '#6B7280' }}>de 15 pontos</div>
                <div
                  className="text-xl font-semibold"
                  style={{ color: getSeverity(totalScore).color }}
                >
                  {getSeverity(totalScore).level}
                </div>
              </div>

              <div className="space-y-3 text-sm mb-6" style={{ color: '#374151' }}>
                <h3 className="font-semibold" style={{ color: '#1F2937' }}>Interpretação (Dimensão 1):</h3>
                <ul className="space-y-1.5" role="list">
                  {[
                    { range: '0', label: 'Ausente', color: '#10B981' },
                    { range: '1–5', label: 'Leve', color: '#F59E0B' },
                    { range: '6–10', label: 'Moderado', color: '#EF4444' },
                    { range: '11–15', label: 'Grave', color: '#DC2626' },
                  ].map((item) => (
                    <li key={item.range} className="flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: item.color }}
                        aria-hidden="true"
                      />
                      <span>
                        <strong>{item.range}:</strong> {item.label}
                        {totalScore ===
                          (item.range === '0' ? 0 : parseInt(item.range.split('–')[0])) ||
                        (item.range !== '0' &&
                          totalScore >= parseInt(item.range.split('–')[0]) &&
                          totalScore <= parseInt(item.range.split('–')[1]))
                          ? (
                            <span
                              className="ml-2 text-xs px-1.5 py-0.5 rounded-full"
                              style={{ backgroundColor: item.color + '20', color: item.color }}
                              aria-label="(sua pontuação)"
                            >
                              ← sua pontuação
                            </span>
                          )
                          : null}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Responses summary */}
              <div className="space-y-2 mb-6">
                <h3 className="text-sm font-semibold" style={{ color: '#1F2937' }}>Suas respostas:</h3>
                {severityQuestions.map((q, idx) => (
                  <div
                    key={q.id}
                    className="flex justify-between gap-2 text-sm p-2 rounded-lg"
                    style={{ backgroundColor: '#F9FAFB' }}
                  >
                    <span style={{ color: '#6B7280' }}>Q{idx + 1}</span>
                    <span className="flex-1 text-xs" style={{ color: '#374151' }}>
                      {q.text.substring(0, 55)}…
                    </span>
                    <span className="font-semibold flex-shrink-0" style={{ color: '#7C3AED' }}>
                      {severity[q.id] ?? '—'}/5
                    </span>
                  </div>
                ))}
              </div>

              {/* Pending dimensions */}
              <div
                className="p-3 rounded-lg text-sm mb-6"
                style={{ backgroundColor: '#F9FAFB', border: '1px dashed #D1D5DB' }}
              >
                <p className="font-medium mb-1" style={{ color: '#374151' }}>
                  Dimensões 2–6 (em desenvolvimento):
                </p>
                <ul className="space-y-1">
                  {pendingDimensions.map((dim) => (
                    <li key={dim} className="flex items-center gap-2 text-xs" style={{ color: '#9CA3AF' }}>
                      <Lock className="w-3 h-3 flex-shrink-0" aria-hidden="true" />
                      {dim}
                    </li>
                  ))}
                </ul>
              </div>

              <div
                className="p-3 rounded-lg flex gap-2 text-sm mb-6"
                style={{ backgroundColor: '#FEF3C7', borderLeft: '4px solid #F59E0B' }}
              >
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#B45309' }} aria-hidden="true" />
                <p style={{ color: '#92400E' }}>
                  Este resultado é baseado apenas na Dimensão 1 (versão parcial). Compartilhe-o com seu terapeuta
                  para uma avaliação completa.
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 min-h-[48px] gap-2"
                  onClick={handleReset}
                  aria-label="Refazer avaliação desde o início"
                >
                  <RotateCcw className="w-4 h-4" aria-hidden="true" />
                  Refazer
                </Button>
                <Button
                  className="flex-1 text-white min-h-[48px]"
                  style={{ backgroundColor: '#7C3AED' }}
                  onClick={() => window.history.back()}
                >
                  Voltar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
