import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import {
  Wallet,
  ShieldCheck,
  Heart,
  TrendingUp,
  CreditCard,
  ArrowDownRight,
  Sparkles,
  Lock,
} from 'lucide-react';

export default function KpiCards() {
  const {
    caixaOperacional,
    reservaProtegida,
    reservaIntacta,
    saldoCasamento,
    rendaJulia,
    rendaTotalMes,
    natanMetricsMes,
    totalDespesasFixasConfirmadas,
    despesasSemanasEstimadaMes,
    currentMonthInvoice,
    totalFaturasFuturasComprometidas,
    selectedMonth,
  } = useFinance();

  const faturaMesAtual = currentMonthInvoice ? Number(currentMonthInvoice.total) || 0 : 0;
  const totalDespesasMes = totalDespesasFixasConfirmadas + despesasSemanasEstimadaMes + faturaMesAtual;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
      {/* 1. Caixa Operacional (Débito) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow-lg relative overflow-hidden group hover:border-emerald-500/50 transition">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400">Caixa Operacional</span>
          <div className="p-2 rounded-xl bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
            <Wallet className="w-4 h-4" />
          </div>
        </div>
        <div className="my-2">
          <div className="text-2xl font-black tracking-tight text-white">
            R$ {caixaOperacional.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-emerald-400/90 font-medium flex items-center gap-1 mt-0.5">
            <span>● Saldo livre em débito</span>
          </div>
        </div>
        <div className="text-[10px] text-slate-400 border-t border-slate-800/80 pt-1.5">
          Cartão não é dinheiro; gaste apenas o que tem em conta.
        </div>
      </div>

      {/* 2. Reserva Protegida (Rescisão Natan) */}
      <div className="bg-gradient-to-b from-amber-950/40 to-slate-900/90 border border-amber-800/50 rounded-2xl p-4 flex flex-col justify-between shadow-lg relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl -z-10" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs font-semibold text-amber-300">Reserva Protegida</span>
          </div>
          <div className="p-2 rounded-xl bg-amber-900/50 text-amber-300 border border-amber-700/40">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>
        <div className="my-2">
          <div className="text-2xl font-black tracking-tight text-amber-300">
            R$ {reservaProtegida.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-amber-400/90 font-bold flex items-center gap-1 mt-0.5">
            {reservaIntacta ? (
              <span className="text-emerald-400">✓ R$ 10.000 100% Blindados</span>
            ) : (
              <span className="text-rose-400">⚠ Alerta: Reserva Movimentada</span>
            )}
          </div>
        </div>
        <div className="text-[10px] text-amber-200/80 border-t border-amber-800/40 pt-1.5 font-medium">
          ISOLADA: Nunca somar à renda operacional do mês.
        </div>
      </div>

      {/* 3. Envelope Casamento */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow-lg relative overflow-hidden group hover:border-pink-500/50 transition">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400">Objetivo Casamento</span>
          <div className="p-2 rounded-xl bg-pink-950/60 text-pink-400 border border-pink-800/40">
            <Heart className="w-4 h-4" />
          </div>
        </div>
        <div className="my-2">
          <div className="text-2xl font-black tracking-tight text-white">
            R$ {saldoCasamento.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-pink-400/90 font-medium flex items-center gap-1 mt-0.5">
            <span>Meta: R$ 10.000,00</span>
          </div>
        </div>
        <div className="text-[10px] text-slate-400 border-t border-slate-800/80 pt-1.5">
          Envelope independente da reserva de emergência.
        </div>
      </div>

      {/* 4. Renda Total do Mês (Júlia + Natan Líquido) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow-lg relative overflow-hidden group hover:border-indigo-500/50 transition">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400">Renda Total do Mês</span>
          <div className="p-2 rounded-xl bg-indigo-950/60 text-indigo-400 border border-indigo-800/40">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <div className="my-2">
          <div className="text-2xl font-black tracking-tight text-white">
            R$ {rendaTotalMes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-indigo-300 font-medium flex items-center gap-1 mt-0.5">
            <span>Júlia R$ 4.200 + Natan Líq. R$ {natanMetricsMes.lucroLiquido.toFixed(0)}</span>
          </div>
        </div>
        <div className="text-[10px] text-slate-400 border-t border-slate-800/80 pt-1.5">
          Faturamento não é lucro; computado apenas valor líquido.
        </div>
      </div>

      {/* 5. Despesas Totais Previstas do Mês */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow-lg relative overflow-hidden group hover:border-amber-500/50 transition">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400">Despesas em {selectedMonth}</span>
          <div className="p-2 rounded-xl bg-amber-950/60 text-amber-400 border border-amber-800/40">
            <ArrowDownRight className="w-4 h-4" />
          </div>
        </div>
        <div className="my-2">
          <div className="text-2xl font-black tracking-tight text-white">
            R$ {totalDespesasMes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-amber-400/90 font-medium flex items-center gap-1 mt-0.5">
            <span>Fixos + Mercado/Gasolina + Fatura</span>
          </div>
        </div>
        <div className="text-[10px] text-slate-400 border-t border-slate-800/80 pt-1.5">
          Fatura deste mês: R$ {faturaMesAtual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </div>
      </div>

      {/* 6. Comprometimento Futuro em Cartões */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow-lg relative overflow-hidden group hover:border-rose-500/50 transition">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400">Total Faturas Futuras</span>
          <div className="p-2 rounded-xl bg-rose-950/60 text-rose-400 border border-rose-800/40">
            <CreditCard className="w-4 h-4" />
          </div>
        </div>
        <div className="my-2">
          <div className="text-2xl font-black tracking-tight text-rose-400">
            R$ {totalFaturasFuturasComprometidas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-slate-300 font-medium flex items-center gap-1 mt-0.5">
            <span className="text-emerald-400 font-bold">↘ Reduzindo até Jul/27</span>
          </div>
        </div>
        <div className="text-[10px] text-slate-400 border-t border-slate-800/80 pt-1.5">
          Estoque antigo de parcelas sendo liquidado.
        </div>
      </div>
    </div>
  );
}
