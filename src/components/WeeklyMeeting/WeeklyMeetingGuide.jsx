import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import {
  FileCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  Calendar,
  AlertTriangle,
  Send,
} from 'lucide-react';
import { WEEKLY_MEETING_QUESTIONS } from '../../data/initialData';

export default function WeeklyMeetingGuide() {
  const {
    caixaOperacional,
    reservaProtegida,
    reservaIntacta,
    compromissoProximos7Dias,
    data,
    natanMetricsMes,
    currentGoal,
    saveMeeting,
  } = useFinance();

  const weekly = data.weeklyBudget || {};
  const [checkedQuestions, setCheckedQuestions] = useState({});
  const [notes, setNotes] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const toggleCheck = (id) => {
    setCheckedQuestions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const allChecked = WEEKLY_MEETING_QUESTIONS.every((q) => checkedQuestions[q.id]);

  const handleSave = (e) => {
    e.preventDefault();
    saveMeeting({
      dataReuniao: new Date().toLocaleDateString('pt-BR'),
      perguntasRespondidas: Object.keys(checkedQuestions).filter((k) => checkedQuestions[k]).length,
      anotacoes: notes,
      saldoDebitoNaData: caixaOperacional,
      reservaNaData: reservaProtegida,
      lucroNatanNaData: natanMetricsMes.lucroLiquido,
    });
    setSavedSuccess(true);
    setNotes('');
    setTimeout(() => setSavedSuccess(false), 5000);
  };

  // Respostas automáticas em tempo real para ajudar o casal
  const getAutoAnswer = (id) => {
    switch (id) {
      case 'q1':
        return `R$ ${caixaOperacional.toFixed(2)} em conta corrente.`;
      case 'q2':
        return `Aproximadamente R$ ${compromissoProximos7Dias.toFixed(2)} em faturas/fixos.`;
      case 'q3':
        return `Gasto atual de R$ ${(weekly.gastoAtualSemana || 0).toFixed(2)} (Teto R$ 300).`;
      case 'q4':
        return `Teto de R$ 100/semana acompanhado no teto semanal.`;
      case 'q5':
        return `R$ ${natanMetricsMes.faturamento.toFixed(2)} acumulado no mês.`;
      case 'q6':
        return `R$ ${natanMetricsMes.custos.toFixed(2)} em custos de operação.`;
      case 'q7':
        return `Lucro Líquido apurado: R$ ${natanMetricsMes.lucroLiquido.toFixed(2)}.`;
      case 'q8':
        return natanMetricsMes.lucroLiquido >= (currentGoal?.metaSemanal || 277)
          ? '✓ Sim, meta semanal batida!'
          : `Em andamento (Meta semanal: ~R$ ${currentGoal?.metaSemanal || 277}).`;
      case 'q9':
        return (data.newCreditPurchases || []).length === 0
          ? '✓ Nenhuma nova compra no cartão (Excelente!)'
          : `⚠️ Foram registradas ${(data.newCreditPurchases || []).length} compras recentes.`;
      case 'q10':
        return 'Faturas seguindo o cronograma de redução até Jul/27.';
      case 'q11':
        return reservaIntacta
          ? '✓ 100% INTACTA (R$ 10.000 preservados).'
          : '⚠️ ATENÇÃO: Saldo da reserva foi alterado!';
      case 'q12':
        return 'Verificar se alguma despesa fixada variou na semana.';
      default:
        return '';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-teal-950/60 via-slate-900 to-emerald-950/40 border border-teal-800/40 rounded-3xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-500 flex items-center justify-center text-white shadow-lg shadow-teal-500/20">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">Reunião Financeira Semanal (10–15 Minutos)</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Roteiro oficial da Seção 29: Alinhamento semanal de Júlia & Natan para manter o plano no trilho
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-emerald-400 font-bold">
              {Object.values(checkedQuestions).filter(Boolean).length} / 12 Respondidas
            </span>
          </div>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-700/60 text-emerald-300 text-sm font-semibold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>Ata da reunião semanal registrada e salva com sucesso!</span>
        </div>
      )}

      {/* Checklist das 12 Perguntas */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="font-extrabold text-white text-sm">
            Roteiro de Perguntas Obrigatórias
          </h3>
          <span className="text-xs text-slate-400">
            Marque cada pergunta conforme discutirem
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {WEEKLY_MEETING_QUESTIONS.map((q, idx) => {
            const isChecked = !!checkedQuestions[q.id];
            const autoAnswer = getAutoAnswer(q.id);
            return (
              <div
                key={q.id}
                onClick={() => toggleCheck(q.id)}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  isChecked
                    ? 'bg-emerald-950/30 border-emerald-700/50 text-slate-200'
                    : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {}}
                    className="mt-0.5 w-4 h-4 rounded text-emerald-500 bg-slate-900 border-slate-700 focus:ring-0 cursor-pointer"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">
                        {idx + 1}. {q.pergunta}
                      </span>
                    </div>
                    {autoAnswer && (
                      <div className="text-[11px] text-emerald-400 font-medium mt-1 bg-slate-900/80 px-2 py-1 rounded-lg border border-slate-800">
                        {autoAnswer}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Anotações e Decisões */}
        <form onSubmit={handleSave} className="space-y-3 pt-3 border-t border-slate-800 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Decisões, Acordos e Metas da Próxima Semana
            </label>
            <textarea
              rows="3"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Natan vai focar em 2 lotes de pudim na sexta-feira; mercado controlado com lista fechada; cartão Renner termina em 3 meses..."
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-teal-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-extrabold shadow-lg shadow-teal-600/30 transition flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>Salvar Ata da Reunião Semanal</span>
          </button>
        </form>
      </div>

      {/* Histórico de Reuniões Realizadas */}
      {(data.meetings || []).length > 0 && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3 text-xs">
          <h4 className="font-bold text-white">Histórico de Reuniões Concluídas</h4>
          <div className="space-y-2">
            {data.meetings.map((m) => (
              <div key={m.id} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-slate-400 text-[10px]">
                  <span>Data: {m.dataReuniao}</span>
                  <span className="text-emerald-400 font-bold">{m.perguntasRespondidas} perguntas respondidas</span>
                </div>
                {m.anotacoes && (
                  <p className="text-slate-200 text-xs">{m.anotacoes}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
