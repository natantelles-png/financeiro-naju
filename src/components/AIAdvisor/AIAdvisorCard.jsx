import React, { useState, useMemo } from 'react';
import { useFinance } from '../../context/FinanceContext';
import {
  Sparkles,
  Bot,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Key,
  Send,
  HelpCircle,
  Lightbulb,
} from 'lucide-react';

export default function AIAdvisorCard() {
  const {
    caixaOperacional,
    reservaProtegida,
    reservaIntacta,
    compromissoProximos7Dias,
    natanMetricsMes,
    currentGoal,
    selectedMonth,
    statusSemaforo,
    data,
  } = useFinance();

  const [customQuestion, setCustomQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loadingAi, setLoadingAi] = useState(false);

  const tetoSemanal = data.weeklyBudget?.tetoSemanal || 400;
  const gastoSemana = data.weeklyBudget?.gastoAtualSemana || 0;
  const sobraSemana = tetoSemanal - gastoSemana;

  const metaLiquida = currentGoal ? currentGoal.metaLiquida : 1200;
  const lucroAtual = natanMetricsMes.lucroLiquido;
  const faltaMeta = Math.max(0, metaLiquida - lucroAtual);

  // Motor Analítico Local Especialista NaJu (Funciona sem chave de API!)
  const nativeDiagnostic = useMemo(() => {
    const bullets = [];
    let priorityAction = '';
    let healthBadge = 'Ótimo';

    // 1. Diagnóstico do Caixa e Compromissos
    if (caixaOperacional < compromissoProximos7Dias) {
      bullets.push(
        `🚨 Atenção de Caixa: O saldo em débito (R$ ${caixaOperacional.toFixed(2)}) é inferior às contas previstas para os próximos 7 dias (~R$ ${compromissoProximos7Dias.toFixed(2)}).`
      );
      priorityAction = 'Natan precisa priorizar faturamento líquido rápido (corridas Uber no pico ou entrega de pudins) para cobrir o vencimento imediato.';
      healthBadge = 'Alerta de Fluxo';
    } else {
      bullets.push(
        `✅ Contas da semana cobertas com segurança pelo saldo em débito disponível.`
      );
    }

    // 2. Diagnóstico da Meta do Natan
    if (lucroAtual >= metaLiquida) {
      bullets.push(
        `🎉 Meta de ${selectedMonth} batida! Lucro líquido de R$ ${lucroAtual.toFixed(2)} supera a meta de R$ ${metaLiquida.toFixed(2)}. Regra: Não gaste a sobra; direcione para reserva ou casamento.`
      );
    } else {
      const ritmoSemanalEsperado = currentGoal?.metaSemanal || 277;
      bullets.push(
        `🎯 Meta do Natan: Lucro atual de R$ ${lucroAtual.toFixed(2)} de R$ ${metaLiquida.toFixed(2)} (faltam R$ ${faltaMeta.toFixed(2)}). Meta semanal ideal: ~R$ ${ritmoSemanalEsperado}/semana.`
      );
      if (!priorityAction) {
        priorityAction = `Manter o ritmo de R$ ${ritmoSemanalEsperado} líquidos por semana. Atividades de maior retorno por hora (como pudins a R$ 47/h) aceleram o atingimento.`;
      }
    }

    // 3. Teto de Mercado/Gasolina
    if (sobraSemana < 0) {
      bullets.push(
        `⚠️ Teto Semanal estourado em R$ ${Math.abs(sobraSemana).toFixed(2)}. Segurar compras supérfluas até domingo.`
      );
    } else {
      bullets.push(
        `🛒 Mercado & Gasolina: Restam R$ ${sobraSemana.toFixed(2)} do teto de R$ 400 para esta semana.`
      );
    }

    // 4. Reserva
    if (reservaIntacta) {
      bullets.push(`🛡️ Reserva de R$ 10.000 da rescisão segue 100% blindada.`);
    }

    return {
      bullets,
      priorityAction,
      healthBadge,
    };
  }, [
    caixaOperacional,
    compromissoProximos7Dias,
    lucroAtual,
    metaLiquida,
    faltaMeta,
    selectedMonth,
    sobraSemana,
    reservaIntacta,
    currentGoal,
  ]);

  const handleAskQuestion = async (e) => {
    e.preventDefault();
    if (!customQuestion.trim()) return;

    const userPrompt = customQuestion;
    setCustomQuestion('');
    setLoadingAi(true);

    const newChat = [...chatHistory, { sender: 'user', text: userPrompt }];
    setChatHistory(newChat);

    try {
      const systemPrompt = `Você é o consultor financeiro de Júlia e Natan no app Financeiro NaJu.
Dados reais atuais do casal:
- Saldo em Débito: R$ ${caixaOperacional.toFixed(2)}
- Reserva Protegida de Rescisão: R$ ${reservaProtegida.toFixed(2)} (Regra: NUNCA usar para despesas diárias)
- Faturas futuras diminuem até Julho/27 (pico em Out/26 de R$ 4.003). Regra: NÃO fazer novas compras parceladas.
- Renda Júlia: R$ 4.200 (R$ 2.400 1ª quinzena / R$ 1.800 2ª quinzena).
- Lucro Líquido realizado do Natan no mês: R$ ${natanMetricsMes.lucroLiquido.toFixed(2)} (Meta: R$ ${metaLiquida.toFixed(2)}). Faturamento não é lucro!
- Teto semanal mercado+gasolina: R$ 400 (Restam R$ ${sobraSemana.toFixed(2)}).
Seja prático, motivador, conciso e dê respostas diretas em português brasileiro.`;

      const response = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `${systemPrompt}\n\nPergunta do casal: ${userPrompt}`
        }),
      });

      if (!response.ok) throw new Error('Falha na API');

      const data = await response.json();
      const aiReply = data.result || 'Não consegui processar a resposta. Tente novamente.';

      setChatHistory([...newChat, { sender: 'ai', text: aiReply }]);
    } catch (err) {
      setChatHistory([
        ...newChat,
        {
          sender: 'ai',
          text: `Erro de conexão com o servidor. Motor local de fallback: Mantenha as compras congeladas no cartão e foque no lucro líquido!`,
        },
      ]);
    }

    setLoadingAi(false);
  };

  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-teal-950/40 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
      {/* Topo com Título e Status de IA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-teal-500/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-white text-sm">Consultor IA Financeiro NaJu</h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-bold border border-teal-500/30">
                Seguro & Privado
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Resumos executivos e recomendações automáticas para Júlia & Natan
            </p>
          </div>
        </div>
      </div>

      {/* Resumo e Ação Recomendada pela IA */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Bullets de Diagnóstico */}
        <div className="md:col-span-7 bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-2 text-xs">
          <div className="flex items-center justify-between pb-1 border-b border-slate-800/80">
            <span className="font-extrabold text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              <span>Resumo Executivo da Semana</span>
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
              {nativeDiagnostic.healthBadge}
            </span>
          </div>
          <ul className="space-y-1.5 text-slate-300">
            {nativeDiagnostic.bullets.map((b, idx) => (
              <li key={idx} className="flex items-start gap-1.5 leading-relaxed">
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Ação Imediata Recomendada */}
        <div className="md:col-span-5 bg-teal-950/30 border border-teal-800/40 rounded-2xl p-4 flex flex-col justify-between space-y-2 text-xs">
          <div>
            <div className="font-extrabold text-teal-300 flex items-center gap-1.5 mb-1.5">
              <Lightbulb className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>Prioridade Número 1 da Semana:</span>
            </div>
            <p className="text-slate-200 leading-relaxed text-[11px]">
              {nativeDiagnostic.priorityAction}
            </p>
          </div>

          <div className="pt-2 border-t border-teal-800/40 text-[10px] text-teal-400 font-medium">
            Fórmula: Gastos no débito + meta de lucro atingida = Alívio financeiro.
          </div>
        </div>
      </div>

      {/* Chat / Pergunta Rápida para a IA */}
      <div className="pt-2 border-t border-slate-800 space-y-2 text-xs">
        {chatHistory.length > 0 && (
          <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
            {chatHistory.map((msg, i) => (
              <div
                key={i}
                className={`p-2.5 rounded-xl ${
                  msg.sender === 'user'
                    ? 'bg-indigo-950/60 border border-indigo-800/50 text-indigo-200 ml-4'
                    : 'bg-slate-950/80 border border-slate-800 text-slate-200 mr-4'
                }`}
              >
                <span className="font-bold text-[10px] block opacity-70 mb-0.5">
                  {msg.sender === 'user' ? 'Júlia & Natan:' : 'Consultor IA:'}
                </span>
                <p className="leading-relaxed text-[11px] whitespace-pre-wrap">{msg.text}</p>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleAskQuestion} className="flex gap-2">
          <input
            type="text"
            value={customQuestion}
            onChange={(e) => setCustomQuestion(e.target.value)}
            placeholder="Pergunte à IA: 'Compensa produzir 60 pudins?' ou 'Como cobrir a fatura de Outubro?'"
            className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-teal-500"
          />
          <button
            type="submit"
            disabled={loadingAi}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-600 to-indigo-600 hover:from-teal-500 hover:to-indigo-500 text-white font-bold text-xs transition flex items-center gap-1.5 disabled:opacity-50"
          >
            {loadingAi ? <Sparkles className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">Consultar IA</span>
          </button>
        </form>
      </div>
    </div>
  );
}
