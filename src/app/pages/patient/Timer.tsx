import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Timer as TimerIcon, Play, Pause, RotateCcw } from 'lucide-react';

export default function Timer() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return {
      hours: hrs.toString().padStart(2, '0'),
      minutes: mins.toString().padStart(2, '0'),
      seconds: secs.toString().padStart(2, '0'),
    };
  };

  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
  };

  const { hours, minutes, seconds } = formatTime(time);

  const presetTimes = [
    { label: '5 min', seconds: 300 },
    { label: '10 min', seconds: 600 },
    { label: '15 min', seconds: 900 },
    { label: '30 min', seconds: 1800 },
  ];

  const setPresetTime = (seconds: number) => {
    setTime(seconds);
    setIsRunning(false);
  };

  return (
    <div className="p-4 w-full max-w-full overflow-x-hidden">
      <div className="mb-6">
        <h1 className="text-2xl mb-2" style={{ color: '#1F2937' }}>
          Temporizador EPR
        </h1>
        <p style={{ color: '#6B7280' }}>
          Cronômetro para sessões de Exposição e Prevenção de Resposta
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card className="mb-6">
          <CardHeader className="text-center">
            <div className="mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: '#F3E8FF' }}>
              <TimerIcon className="w-10 h-10" style={{ color: '#8B5CF6' }} />
            </div>
            <CardTitle className="text-xl" style={{ color: '#1F2937' }}>
              Tempo de Exposição
            </CardTitle>
            <CardDescription>
              Use o temporizador durante seus exercícios de EPR
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="text-7xl font-bold tabular-nums" style={{ color: '#8B5CF6' }}>
                  {hours}
                </div>
                <div className="text-7xl font-bold" style={{ color: '#8B5CF6' }}>:</div>
                <div className="text-7xl font-bold tabular-nums" style={{ color: '#8B5CF6' }}>
                  {minutes}
                </div>
                <div className="text-7xl font-bold" style={{ color: '#8B5CF6' }}>:</div>
                <div className="text-7xl font-bold tabular-nums" style={{ color: '#8B5CF6' }}>
                  {seconds}
                </div>
              </div>
              <div className="flex items-center gap-2 justify-center text-sm" style={{ color: '#6B7280' }}>
                <span>Horas</span>
                <span className="mx-4">Minutos</span>
                <span>Segundos</span>
              </div>
            </div>

            <div className="flex gap-4 justify-center mb-6">
              <Button
                size="lg"
                onClick={handleStartPause}
                style={{ backgroundColor: isRunning ? '#F59E0B' : '#8B5CF6' }}
                className="text-white w-32"
              >
                {isRunning ? (
                  <>
                    <Pause className="w-5 h-5 mr-2" />
                    Pausar
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 mr-2" />
                    Iniciar
                  </>
                )}
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={handleReset}
                className="w-32"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Resetar
              </Button>
            </div>

            <div className="border-t pt-6" style={{ borderColor: '#E5E7EB' }}>
              <p className="text-sm mb-3 text-center" style={{ color: '#6B7280' }}>
                Tempos pré-definidos:
              </p>
              <div className="grid grid-cols-4 gap-2">
                {presetTimes.map((preset) => (
                  <Button
                    key={preset.seconds}
                    variant="outline"
                    onClick={() => setPresetTime(preset.seconds)}
                    disabled={isRunning}
                    style={{ borderColor: time === preset.seconds ? '#8B5CF6' : '#E5E7EB' }}
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card style={{ borderColor: '#8B5CF6' }}>
          <CardHeader>
            <CardTitle style={{ color: '#1F2937' }}>Como usar</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3 text-sm" style={{ color: '#6B7280' }}>
              <li className="flex items-start gap-2">
                <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs" style={{ backgroundColor: '#8B5CF6' }}>1</span>
                <span>Escolha um exercício de EPR conforme orientação do seu terapeuta</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs" style={{ backgroundColor: '#8B5CF6' }}>2</span>
                <span>Defina um tempo (use os botões pré-definidos ou inicie do zero)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs" style={{ backgroundColor: '#8B5CF6' }}>3</span>
                <span>Exponha-se à situação que causa ansiedade sem realizar a compulsão</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs" style={{ backgroundColor: '#8B5CF6' }}>4</span>
                <span>Continue até o tempo acabar, mesmo com ansiedade (ela diminuirá naturalmente)</span>
              </li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
