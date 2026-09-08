import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import {
  HelpCircle,
  TrendingUp,
  CreditCard,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';

export default function QuickQuestions({ onNavigateToSimulator, onNavigateToCards, onNavigateToEntrepreneur }) {
  const {
    caixaOperacional,
    reservaProtegida,
    reservaIntacta,
    compromissoProximos7Dias,
    natanMetricsMes,
    currentGoal,
    selectedMonth,
    totalFaturasFuturasComprometidas,
    totalDespesasFixasConfirmadas,
    rendaJulia,
  } = useFinance();

  // Cálculo da necessidade adicional do mês:
  // Necessidade = (Despesas fixas + 4 semanas de R$ 400 + Fatura do mês) - Renda Júlia
  const despesasSemanas = 1600;
  const faturaMes = selectedMonth === 'Out/26' ? 4003.48 : selectedMonth === 'Set/26' ? 2358.80 : 3473.17;
  const necessidadeMes = totalDespesasFixasConfirmadas + despesasSemanas + faturaMes - rendaJulia;
  const metaLiquida = currentGoal ? currentGoal.metaLiquida : 1200;
  const lucroAtual = natanMetricsMes.lucroLiquido;
  const faltaParaMeta = Math.max(0, metaLiquida - lucroAtual);

  const saldoRealmenteDisponivel = Math.max(0, caixaOperacional - compromissoProximos7Dias);

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-indigo-950 text-indigo-400 border border-indigo-800/50">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-white text-base tracking-tight">
              Perguntas Centrais do Casal (Respostas Rápidas)
            </h3>
            <p className="text-xs text-slate-400">
              Diagnóstico imediato conforme o Princípio Final do Sistema (Seção 50)
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-xs">
        {/* Pergunta 1 */}
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 transition">
          <div>
            <div className="text-slate-400 font-medium mb-1">Pergunta 1:</div>
            <div className="text-sm font-bold text-white mb-2">
              "Quanto posso realmente gastar hoje?"
            </div>
            <div className="space-y-1.5 text-slate-300">
              <div className="flex justify-between">
                <span>Saldo em Débito:</span>
                <span className="font-bold text-white">R$ {caixaOperacional.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-amber-300/90">
                <span>Compromissos próx. 7 dias:</span>
                <span>- R$ {compromissoProximos7Dias.toFixed(2)}</span>
              </div>
              <div className="border-t border-slate-800 pt-1.5 flex justify-between font-bold text-emerald-400">
                <span>Margem livre de risco:</span>
                <span>R$ {saldoRealmenteDisponivel.toFixed(2)}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onNavigateToSimulator}
            className="mt-3 w-full py-2 px-3 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 font-semibold border border-emerald-500/30 flex items-center justify-center gap-1.5 transition"
          >
            <span>Testar uma compra no Simulador</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Pergunta 2 */}
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 transition">
          <div>
            <div className="text-slate-400 font-medium mb-1">Pergunta 2:</div>
            <div className="text-sm font-bold text-white mb-2">
              "Quanto o Natan realmente lucrou e quanto falta?"
            </div>
            <div className="space-y-1.5 text-slate-300">
              <div className="flex justify-between">
                <span>Faturamento bruto:</span>
                <span className="text-slate-200 font-semibold">R$ {natanMetricsMes.faturamento.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-rose-300/80">
                <span>Custos totais:</span>
                <span>- R$ {natanMetricsMes.custos.toFixed(2)}</span>
              </div>
              <div className="border-t border-slate-800 pt-1.5 flex justify-between font-bold text-indigo-400">
                <span>Lucro Líquido Real:</span>
                <span>R$ {lucroAtual.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-400 text-[11px]">
                <span>Meta de {selectedMonth}:</span>
                <span>R$ {metaLiquida.toFixed(2)} (falta R$ {faltaParaMeta.toFixed(2)})</span>
              </div>
            </div>
          </div>
          <button
            onClick={onNavigateToEntrepreneur}
            className="mt-3 w-full py-2 px-3 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 font-semibold border border-indigo-500/30 flex items-center justify-center gap-1.5 transition"
          >
            <span>Ver Métricas & Registrar Vendas</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Pergunta 3 */}
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 transition">
          <div>
            <div className="text-slate-400 font-medium mb-1">Pergunta 3:</div>
            <div className="text-sm font-bold text-white mb-2">
              "Estamos reduzindo o comprometimento futuro?"
            </div>
            <div className="space-y-1.5 text-slate-300">
              <div className="flex justify-between items-center">
                <span>Status da Reserva R$ 10k:</span>
                <span className={`font-bold ${reservaIntacta ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {reservaIntacta ? '100% INTACTA' : 'VIOLADA'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Novas parcelas feitas:</span>
                <span className="font-bold text-emerald-400">0 novas (Congelado)</span>
              </div>
              <div className="border-t border-slate-800 pt-1.5 flex justify-between font-bold text-rose-400">
                <span>Total Faturas Restantes:</span>
                <span>R$ {totalFaturasFuturasComprometidas.toFixed(2)}</span>
              </div>
              <div className="text-[11px] text-emerald-300/80">
                ✓ Em Jul/27 restará apenas R$ 148,56 de faturas.
              </div>
            </div>
          </div>
          <button
            onClick={onNavigateToCards}
            className="mt-3 w-full py-2 px-3 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 font-semibold border border-rose-500/30 flex items-center justify-center gap-1.5 transition"
          >
            <span>Ver Gráfico de Queda das Faturas</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
