import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import {
  TrendingUp,
  Clock,
  Percent,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Flame,
  PlusCircle,
  Trash2,
  Award,
} from 'lucide-react';
import ActivityForm from './ActivityForm';

export default function EntrepreneurDashboard() {
  const {
    natanMetricsMes,
    currentGoal,
    selectedMonth,
    progressoMetaPercent,
    diferencaMeta,
    updateGoal,
    natanLogs,
    deleteEntrepreneurLog,
  } = useFinance();

  const [showNewActivityModal, setShowNewActivityModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState(false);
  const [newGoalValue, setNewGoalValue] = useState(currentGoal ? currentGoal.metaLiquida : 1200);

  const metaLiquida = currentGoal ? currentGoal.metaLiquida : 1200;
  const metaSemanal = currentGoal ? currentGoal.metaSemanal : 277;
  const metaQuinzenal = currentGoal ? currentGoal.metaQuinzenal : 600;

  const handleSaveGoal = () => {
    updateGoal(selectedMonth, newGoalValue);
    setEditingGoal(false);
  };

  const isPositiveScenario = natanMetricsMes.lucroLiquido >= metaLiquida;
  const isCriticalScenario = natanMetricsMes.lucroLiquido < metaLiquida * 0.5 && selectedMonth === 'Out/26';

  return (
    <div className="space-y-6">
      {/* Banner Principal do Empreendedorismo */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-900 border border-indigo-800/50 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white">Empreendedorismo Natan</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
                  Uber • Pudins • Doces
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Regra Central (Seção 16): A unidade de medida é <strong>LUCRO LÍQUIDO</strong> (Faturamento menos todos os custos).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowNewActivityModal(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/20 transition flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Lançar Corrida / Venda Diária</span>
            </button>
          </div>
        </div>

        {/* 4 Indicadores Chave de Desempenho */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6">
          {/* Faturamento Bruto */}
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-3.5">
            <div className="text-[11px] text-slate-400 font-semibold mb-1">Faturamento Bruto</div>
            <div className="text-xl font-black text-white">
              R$ {natanMetricsMes.faturamento.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Total que entrou</div>
          </div>

          {/* Custos Operacionais */}
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-3.5">
            <div className="text-[11px] text-slate-400 font-semibold mb-1">Custos Totais</div>
            <div className="text-xl font-black text-rose-400">
              - R$ {natanMetricsMes.custos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Combustível, taxas, insumos</div>
          </div>

          {/* Lucro Líquido Real */}
          <div className="bg-gradient-to-b from-indigo-950/40 to-slate-950 border border-indigo-700/50 rounded-2xl p-3.5">
            <div className="text-[11px] text-indigo-300 font-bold mb-1">Lucro Líquido Real</div>
            <div className="text-xl font-black text-indigo-300">
              R$ {natanMetricsMes.lucroLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <div className="text-[10px] text-emerald-400 font-medium mt-0.5">O que realmente sobra</div>
          </div>

          {/* Eficiência / Lucro por Hora */}
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-3.5">
            <div className="text-[11px] text-slate-400 font-semibold mb-1">Eficiência (R$ / Hora)</div>
            <div className="text-xl font-black text-amber-400">
              R$ {natanMetricsMes.lucroPorHora.toFixed(2)}/h
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              {natanMetricsMes.horas.toFixed(1)}h trabalhadas ({natanMetricsMes.margemLiquida.toFixed(1)}% margem)
            </div>
          </div>
        </div>
      </div>

      {/* Seção de Metas: Mensal, Semanal e Quinzenal */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              <h3 className="font-extrabold text-white text-sm">
                Acompanhamento da Meta Líquida de {selectedMonth}
              </h3>
            </div>
            <p className="text-xs text-slate-400">
              Metas dinâmicas planejadas para cobrir a transição das faturas
            </p>
          </div>

          <div className="flex items-center gap-2">
            {editingGoal ? (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={newGoalValue}
                  onChange={(e) => setNewGoalValue(e.target.value)}
                  className="w-28 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-700 text-white font-bold text-xs"
                />
                <button
                  onClick={handleSaveGoal}
                  className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
                >
                  Salvar
                </button>
                <button
                  onClick={() => setEditingGoal(false)}
                  className="px-2 py-1 rounded-lg bg-slate-800 text-slate-400 text-xs"
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setNewGoalValue(metaLiquida);
                  setEditingGoal(true);
                }}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-semibold transition"
              >
                Ajustar Meta (Seção 17)
              </button>
            )}
          </div>
        </div>

        {/* Barra de Progresso da Meta */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-slate-300">
              Realizado Líquido: R$ {natanMetricsMes.lucroLiquido.toFixed(2)}
            </span>
            <span className="text-indigo-400">
              Meta do Mês: R$ {metaLiquida.toFixed(2)} ({progressoMetaPercent}%)
            </span>
          </div>
          <div className="w-full h-3.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800 p-0.5">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                progressoMetaPercent >= 100
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                  : 'bg-gradient-to-r from-indigo-500 to-purple-500'
              }`}
              style={{ width: `${Math.min(100, progressoMetaPercent)}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-slate-400">
            <span>
              {diferencaMeta >= 0 ? (
                <span className="text-emerald-400 font-bold">
                  ✓ Meta superada em +R$ {diferencaMeta.toFixed(2)}!
                </span>
              ) : (
                <span>Faltam R$ {Math.abs(diferencaMeta).toFixed(2)} para bater a meta mensal</span>
              )}
            </span>
            <span>Meta Semanal: ~R$ {metaSemanal} | Meta Quinzenal: ~R$ {metaQuinzenal}</span>
          </div>
        </div>

        {/* Cenário Crítico vs Cenário Positivo (Seções 32 e 33) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs">
            <span className="font-bold text-amber-300 flex items-center gap-1 mb-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Diretriz Se o Natan Não Atingir a Meta (Seção 32)</span>
            </span>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              NÃO usar a reserva de emergência automaticamente! Analisar custos de combustível, aumentar a atividade de maior retorno por hora (ex: pudim sob encomenda) e conter despesas supérfluas.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs">
            <span className="font-bold text-emerald-400 flex items-center gap-1 mb-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Diretriz Se o Natan Superar a Meta (Seção 33)</span>
            </span>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              O excedente NÃO deve virar consumo! Prioridade máxima: abastecer o caixa operacional e engordar o envelope do Casamento / Reserva futura.
            </p>
          </div>
        </div>
      </div>

      {/* Histórico dos Lançamentos Diários */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="font-extrabold text-white text-sm">
            Registro das Atividades Empreendedoras
          </h3>
          <span className="text-xs text-slate-400">
            {natanLogs.length} atividades registradas
          </span>
        </div>

        {natanLogs.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            Nenhuma atividade registrada ainda. Clique em "Lançar Corrida / Venda Diária" para começar.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 uppercase text-[10px]">
                  <th className="py-2.5 px-3">Data</th>
                  <th className="py-2.5 px-3">Atividade</th>
                  <th className="py-2.5 px-3">Faturamento</th>
                  <th className="py-2.5 px-3">Custos</th>
                  <th className="py-2.5 px-3 font-bold text-emerald-400">Lucro Líquido</th>
                  <th className="py-2.5 px-3">Horas</th>
                  <th className="py-2.5 px-3">R$/Hora</th>
                  <th className="py-2.5 px-3 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {natanLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/30 transition">
                    <td className="py-3 px-3 font-medium text-slate-400">{log.data}</td>
                    <td className="py-3 px-3 font-bold text-white flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-indigo-500" />
                      <span>{log.atividade}</span>
                    </td>
                    <td className="py-3 px-3 font-mono font-semibold text-slate-200">
                      R$ {Number(log.faturamento).toFixed(2)}
                    </td>
                    <td className="py-3 px-3 font-mono text-rose-400">
                      - R$ {Number(log.custosTotais).toFixed(2)}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-emerald-400 text-sm">
                      R$ {Number(log.lucroLiquido).toFixed(2)}
                    </td>
                    <td className="py-3 px-3 text-slate-300">{log.horasTrabalhadas}h</td>
                    <td className="py-3 px-3 font-mono text-amber-400 font-semibold">
                      R$ {Number(log.lucroPorHora).toFixed(2)}/h
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => deleteEntrepreneurLog(log.id)}
                        className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition"
                        title="Excluir lançamento"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de Nova Atividade */}
      {showNewActivityModal && (
        <ActivityForm onClose={() => setShowNewActivityModal(false)} />
      )}
    </div>
  );
}
