import React, { useState, useEffect, useRef } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { parseNaturalLanguageInput } from '../../utils/voiceParser';
import {
  Mic,
  MicOff,
  Send,
  Sparkles,
  CheckCircle2,
  X,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';

export default function VoiceInputBar() {
  const { addWeeklyExpense, addEntrepreneurLog, recordCreditPurchaseWarning } = useFinance();

  const [isListening, setIsListening] = useState(false);
  const [transcriptText, setTranscriptText] = useState('');
  const [interpretedAction, setInterpretedAction] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [speechSupported, setSpeechSupported] = useState(true);

  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'pt-BR';

      recognition.onresult = (event) => {
        const spoken = event.results[0][0].transcript;
        setTranscriptText(spoken);
        const parsed = parseNaturalLanguageInput(spoken);
        setInterpretedAction(parsed);
        setIsListening(false);
      };

      recognition.onerror = (err) => {
        console.warn('Erro no reconhecimento de voz:', err);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } else {
      setSpeechSupported(false);
    }
  }, []);

  const startListening = () => {
    if (!recognitionRef.current) {
      alert('Reconhecimento de voz não suportado neste navegador. Digite no campo abaixo.');
      return;
    }

    try {
      setTranscriptText('');
      setInterpretedAction(null);
      setSuccessMessage('');
      setIsListening(true);
      recognitionRef.current.start();
    } catch (e) {
      console.warn('Erro ao iniciar:', e);
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const handleManualTextChange = (e) => {
    const txt = e.target.value;
    setTranscriptText(txt);
    if (txt.trim().length > 3) {
      const parsed = parseNaturalLanguageInput(txt);
      setInterpretedAction(parsed);
    } else {
      setInterpretedAction(null);
    }
  };

  const handleConfirmAction = () => {
    if (!interpretedAction) return;

    if (interpretedAction.type === 'WEEKLY_EXPENSE') {
      addWeeklyExpense({
        descricao: `${interpretedAction.categoria} (voz)`,
        valor: interpretedAction.valor,
        categoria: interpretedAction.categoria,
      });
      setSuccessMessage(`✅ R$ ${interpretedAction.valor.toFixed(2)} registrado em ${interpretedAction.categoria} com sucesso!`);
    } else if (interpretedAction.type === 'ENTREPRENEUR_LOG') {
      addEntrepreneurLog({
        data: new Date().toISOString().split('T')[0],
        atividade: interpretedAction.categoria,
        faturamento: interpretedAction.faturamento,
        combustivel: interpretedAction.combustivel || 0,
        insumos: interpretedAction.insumos || 0,
        embalagens: 0,
        taxas: 0,
        manutencao: 0,
        outrosCustos: 0,
        horasTrabalhadas: interpretedAction.horasTrabalhadas || 0,
        observacoes: 'Lançado via comando rápido de voz',
      });
      setSuccessMessage(`✅ ${interpretedAction.categoria} lançado! +R$ ${interpretedAction.lucroLiquido.toFixed(2)} de Lucro Líquido somado ao caixa!`);
    } else if (interpretedAction.type === 'CREDIT_WARNING') {
      recordCreditPurchaseWarning({
        descricao: 'Compra rápida cartão',
        valor: interpretedAction.valor,
        parcelado: interpretedAction.isParcelado,
      });
      setSuccessMessage(`⚠️ Compra no cartão registrada nos alertas de fatura futura.`);
    }

    setTranscriptText('');
    setInterpretedAction(null);
    setTimeout(() => setSuccessMessage(''), 5000);
  };

  return (
    <div className="w-full space-y-3">
      {/* Barra de Entrada de Áudio / Texto Rápido */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/60 border border-slate-700/80 rounded-2xl p-3 shadow-xl relative">
        <div className="flex items-center gap-2">
          {/* Botão de Microfone de Alta Evidência */}
          <button
            type="button"
            onClick={isListening ? stopListening : startListening}
            className={`p-3 rounded-xl font-bold flex items-center gap-2 transition-all transform active:scale-95 ${
              isListening
                ? 'bg-rose-600 text-white animate-pulse shadow-lg shadow-rose-600/40 ring-4 ring-rose-500/30'
                : 'bg-gradient-to-tr from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white shadow-lg shadow-emerald-500/20'
            }`}
            title={isListening ? 'Clique para parar' : 'Aperte e fale'}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            <span className="text-xs hidden sm:inline">
              {isListening ? 'Ouvindo...' : 'Falar em Áudio'}
            </span>
          </button>

          {/* Campo de Texto Rápido (fallback / digitação livre) */}
          <div className="relative flex-1">
            <input
              type="text"
              value={transcriptText}
              onChange={handleManualTextChange}
              placeholder={
                isListening
                  ? 'Fale agora: "Gastei 45 no mercado" ou "Fiz 250 no Uber com 50 de gasolina"'
                  : 'Fale no microfone ou digite: "Gastei 60 na gasolina", "Vendi 30 pudins"...'
              }
              className={`w-full py-2.5 px-3.5 rounded-xl bg-slate-950 border text-white text-xs font-medium focus:outline-none transition ${
                isListening
                  ? 'border-rose-500 ring-1 ring-rose-500 bg-rose-950/20 placeholder-rose-300'
                  : 'border-slate-700 focus:border-indigo-500'
              }`}
            />
            {transcriptText && (
              <button
                onClick={() => {
                  setTranscriptText('');
                  setInterpretedAction(null);
                }}
                className="absolute right-2.5 top-2.5 text-slate-500 hover:text-slate-300"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Mensagem de Sucesso */}
        {successMessage && (
          <div className="mt-2 p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-700/60 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Card de Pré-visualização da Interpretação (Confirmação com 1 toque) */}
        {interpretedAction && (
          <div className="mt-3 p-3 rounded-xl bg-slate-950 border border-indigo-700/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fadeIn">
            <div className="flex items-start gap-2 text-xs">
              <Sparkles className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-white flex items-center gap-1.5">
                  <span>{interpretedAction.actionTitle}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {interpretedAction.categoria}
                  </span>
                </div>
                <div className="text-slate-300 text-[11px] mt-0.5">
                  {interpretedAction.resumo}
                </div>
              </div>
            </div>

            {interpretedAction.type !== 'UNKNOWN' ? (
              <button
                onClick={handleConfirmAction}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs shadow-md shadow-emerald-600/30 transition flex items-center justify-center gap-1.5 flex-shrink-0"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Confirmar & Salvar</span>
              </button>
            ) : (
              <div className="text-[10px] text-amber-400 italic">
                Não compreendido. Tente falar novamente com mais clareza.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Exemplos de Fala Rápida para o casal */}
      <div className="hidden sm:flex items-center gap-2 text-[11px] text-slate-400 overflow-x-auto pb-1">
        <span className="text-slate-500 font-semibold flex-shrink-0">Exemplos de voz:</span>
        <button
          onClick={() => {
            const txt = 'Gastei 85 no mercado';
            setTranscriptText(txt);
            setInterpretedAction(parseNaturalLanguageInput(txt));
          }}
          className="px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 whitespace-nowrap"
        >
          "Gastei 85 no mercado"
        </button>
        <button
          onClick={() => {
            const txt = 'Coloquei 60 de gasolina';
            setTranscriptText(txt);
            setInterpretedAction(parseNaturalLanguageInput(txt));
          }}
          className="px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 whitespace-nowrap"
        >
          "Coloquei 60 de gasolina"
        </button>
        <button
          onClick={() => {
            const txt = 'Fiz 280 no Uber com 60 de gasolina em 6 horas';
            setTranscriptText(txt);
            setInterpretedAction(parseNaturalLanguageInput(txt));
          }}
          className="px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 whitespace-nowrap"
        >
          "Fiz 280 no Uber com 60 de gasolina em 6 horas"
        </button>
        <button
          onClick={() => {
            const txt = 'Vendi 1 lote de pudim por 300 reais';
            setTranscriptText(txt);
            setInterpretedAction(parseNaturalLanguageInput(txt));
          }}
          className="px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 whitespace-nowrap"
        >
          "Vendi 1 lote de pudim"
        </button>
      </div>
    </div>
  );
}
