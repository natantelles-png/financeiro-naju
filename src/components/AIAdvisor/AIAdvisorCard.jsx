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
  const [geminiApiKey, setGeminiApiKey] = useState(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return localStorage.getItem('GEMINI_API_KEY') || '';
      }
    } catch (e) {
      return '';
    }
    return '';
  });
  const [showKeyInput, setShowKeyInput] = useState(false);
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

    // Se possui chave do Gemini configurada, chama a API Gemini 1.5 Flash
    if (geminiApiKey.trim()) {
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

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey.trim()}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    { text: `${systemPrompt}\n\nPergunta do casal: ${userPrompt}` },
                  ],
                },
              ],
            }),
          }
        );

        const data = await response.json();
        const aiReply =
          data?.candidates?.[0]?.content?.parts?.[0]?.text ||
          'Não consegui processar a resposta da API Gemini. Verifique sua chave.';

        setChatHistory([...newChat, { sender: 'ai', text: aiReply }]);
      } catch (err) {
        setChatHistory([
          ...newChat,
          {
            sender: 'ai',
            text: `Erro ao conectar com a API Gemini (${err.message}). Respondendo com o motor local: Mantenha as compras congeladas no cartão e foque no lucro líquido do Natan!`,
          },
        ]);
      }
    } else {
      // Resposta inteligente do motor local sem API key!
      let respostaLocal = '';
      const pLower = userPrompt.toLowerCase();

      if (pLower.includes('pudim') || pLower.includes('lote')) {
        respostaLocal = `🍮 Análise do Negócio de Pudim: Cada lote de 30 unidades gera R$ 195 de lucro líquido com margem de 65% e eficiência de R$ 47,50 por hora trabalhada. É a atividade mais rentável por hora do Natan! Vender 2 lotes por semana adiciona ~R$ 1.560 líquidos/mês no orçamento.`;
      } else if (pLower.includes('uber') || pLower.includes('gasolina')) {
        respostaLocal = `🚗 Análise do Uber: O combustível representa em média 25% a 30% do faturamento. Fature sempre visando o lucro líquido (faturamento menos gasolina). Atualmente sua eficiência média no Uber é de R$ ${natanMetricsMes.lucroPorHora.toFixed(2)} por hora.`;
      } else if (pLower.includes('reserva') || pLower.includes('10.000') || pLower.includes('10000')) {
        respostaLocal = `🛡️ Reserva Blindada: Os R$ 10.000 da rescisão continuam 100% protegidos. A regra de ouro é nunca utilizá-los para cobrir contas mensais de mercado ou cartão.`;
      } else if (pLower.includes('cartao') || pLower.includes('parcela')) {
        respostaLocal = `💳 Cartões de Crédito: A maior oportunidade do casal é a redução de R$ 4.003 em Outubro para R$ 148 em Julho. O compromisso é não criar nenhuma nova compra parcelada para desfrutar do alívio financeiro.`;
      } else {
        respostaLocal = `💡 Diagnóstico NaJu: Com base nos seus números de ${selectedMonth}, o foco principal agora é: ${nativeDiagnostic.priorityAction}. Seu débito livre é de R$ ${caixaOperacional.toFixed(2)} e restam R$ ${sobraSemana.toFixed(2)} do teto da semana.`;
      }

      setChatHistory([...newChat, { sender: 'ai', text: respostaLocal }]);
    }

    setLoadingAi(false);
  };

  const handleSaveApiKey = (e) => {
    e.preventDefault();
    localStorage.setItem('GEMINI_API_KEY', geminiApiKey.trim());
    setShowKeyInput(false);
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
                {geminiApiKey ? 'Gemini 1.5 Ativo' : 'Motor Especialista Local (Gratuito)'}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Resumos executivos e recomendações automáticas para Júlia & Natan
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowKeyInput(!showKeyInput)}
          className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center gap-1.5 transition self-start sm:self-auto"
          title="Configurar chave de IA opcional"
        >
          <Key className="w-3 h-3 text-amber-400" />
          <span>{geminiApiKey ? 'Chave de IA Configurada' : 'Adicionar Chave IA (Opcional)'}</span>
        </button>
      </div>

      {/* Input Opcional de Chave de API */}
      {showKeyInput && (
        <form onSubmit={handleSaveApiKey} className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-2 text-xs animate-fadeIn">
          <div className="flex justify-between items-center text-slate-300 font-semibold">
            <span>Chave Google Gemini API (Opcional / Gratuita):</span>
            <span className="text-[10px] text-emerald-400 font-normal">
              * O app já funciona 100% sem chave!
            </span>
          </div>
          <div className="flex gap-2">
            <input
              type="password"
              placeholder="Cole sua API Key do Google AI Studio..."
              value={geminiApiKey}
              onChange={(e) => setGeminiApiKey(e.target.value)}
              className="flex-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono"
            />
            <button
              type="submit"
              className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
            >
              Salvar
            </button>
          </div>
        </form>
      )}

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
