import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { Calendar, DollarSign, ArrowDown, ArrowUp, AlertCircle, CheckCircle } from 'lucide-react';

export default function BiweeklyView() {
  const { data, selectedMonth, currentMonthInvoice } = useFinance();
  const fixedExpenses = data.fixedExpenses || [];

  // 1ª Quinzena: dias 1 a 15
  // Júlia: R$ 2.400
  const rendaJuliaQ1 = 2400.00;
  const contasQ1 = fixedExpenses.filter((e) => e.diaVencimento <= 15);
  const totalContasQ1 = contasQ1.reduce((acc, curr) => acc + (Number(curr.valor) || 0), 0);
  
  // Faturas dos cartões da 1ª quinzena:
  // Renner dia 8 + Natan dia 11
  const faturaRennerQ1 = currentMonthInvoice && currentMonthInvoice.cartaoRenner !== null ? Number(currentMonthInvoice.cartaoRenner) || 0 : 0;
  const faturaNatanQ1 = currentMonthInvoice && currentMonthInvoice.cartaoNatan !== null ? Number(currentMonthInvoice.cartaoNatan) || 0 : 0;
  const faturasQ1 = faturaRennerQ1 + faturaNatanQ1;
  const mercadoGasolinaQ1 = 400 * 2; // ~2 semanas = R$ 800
  const totalCompromissosQ1 = totalContasQ1 + faturasQ1 + mercadoGasolinaQ1;
  const saldoLiquidoQ1 = rendaJuliaQ1 - totalCompromissosQ1;

  // 2ª Quinzena: dias 16 até o fim do mês
  // Júlia: R$ 1.800
  const rendaJuliaQ2 = 1800.00;
  const contasQ2 = fixedExpenses.filter((e) => e.diaVencimento > 15);
  const totalContasQ2 = contasQ2.reduce((acc, curr) => acc + (Number(curr.valor) || 0), 0);
  
  // Fatura Júlia dia 24
  const faturaJuliaQ2 = currentMonthInvoice ? Number(currentMonthInvoice.cartaoJulia) || 0 : 0;
  const mercadoGasolinaQ2 = 400 * 2; // ~2 semanas = R$ 800
  const totalCompromissosQ2 = totalContasQ2 + faturaJuliaQ2 + mercadoGasolinaQ2;
  const saldoLiquidoQ2 = rendaJuliaQ2 - totalCompromissosQ2;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-teal-950/60 text-teal-400 border border-teal-800/40">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-white text-sm">
              Fluxo de Caixa Quinzenal — Competência {selectedMonth}
            </h3>
            <p className="text-xs text-slate-400">
              Distribuição das entradas da Júlia (R$ 2.400 e R$ 1.800) vs vencimentos de cada quinzena
            </p>
          </div>
        </div>

        <div className="text-[11px] text-slate-400">
          Regra: As receitas do Natan completam o déficit de cada quinzena.
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* 1ª Quinzena */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="font-extrabold text-white text-sm">1ª Quinzena (Dias 1 a 15)</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40">
                Recebimento: R$ 2.400
              </span>
            </div>

            <div className="mt-3 space-y-2 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Entrada Salarial Júlia:</span>
                <span className="font-bold text-emerald-400">+ R$ 2.400,00</span>
              </div>

              <div className="flex justify-between text-slate-300">
                <span>Contas Fixas (Carro, Luz, Internet, Meninas...):</span>
                <span className="text-rose-400 font-mono">- R$ {totalContasQ1.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-slate-300">
                <span>Faturas (Renner dia 8 + Natan dia 11):</span>
                <span className="text-rose-400 font-mono">- R$ {faturasQ1.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-slate-300">
                <span>Provisão Mercado + Gasolina (2 sem.):</span>
                <span className="text-rose-400 font-mono">- R$ {mercadoGasolinaQ1.toFixed(2)}</span>
              </div>

              <div className="border-t border-slate-800 pt-2 flex justify-between font-bold text-xs">
                <span>Total Saídas Previstas:</span>
                <span className="text-white font-mono">R$ {totalCompromissosQ1.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div
            className={`p-3 rounded-xl border flex items-center justify-between text-xs font-bold ${
              saldoLiquidoQ1 >= 0
                ? 'bg-emerald-950/40 border-emerald-700/50 text-emerald-300'
                : 'bg-rose-950/40 border-rose-700/50 text-rose-300'
            }`}
          >
            <span>Balanço da 1ª Quinzena:</span>
            <span className="font-mono text-sm">
              {saldoLiquidoQ1 >= 0 ? `+ R$ ${saldoLiquidoQ1.toFixed(2)}` : `- R$ ${Math.abs(saldoLiquidoQ1).toFixed(2)}`}
            </span>
          </div>
          {saldoLiquidoQ1 < 0 && (
            <div className="text-[10px] text-amber-300 flex items-center gap-1">
              <AlertCircle className="w-3 h-3 flex-shrink-0" />
              <span>Déficit coberto pelo lucro da 1ª quinzena do Natan (~R$ {currentMonthInvoice?.cartaoNatan ? '1.200 a 2.750' : '600'}).</span>
            </div>
          )}
        </div>

        {/* 2ª Quinzena */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="font-extrabold text-white text-sm">2ª Quinzena (Dias 16 ao Fim)</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40">
                Recebimento: R$ 1.800
              </span>
            </div>

            <div className="mt-3 space-y-2 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Entrada Salarial Júlia:</span>
                <span className="font-bold text-emerald-400">+ R$ 1.800,00</span>
              </div>

              <div className="flex justify-between text-slate-300">
                <span>Contas Fixas (Condomínio dia 20, Financiamento dia 23):</span>
                <span className="text-rose-400 font-mono">- R$ {totalContasQ2.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-slate-300">
                <span>Fatura Júlia (Vence dia 24):</span>
                <span className="text-rose-400 font-mono">- R$ {faturaJuliaQ2.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-slate-300">
                <span>Provisão Mercado + Gasolina (2 sem.):</span>
                <span className="text-rose-400 font-mono">- R$ {mercadoGasolinaQ2.toFixed(2)}</span>
              </div>

              <div className="border-t border-slate-800 pt-2 flex justify-between font-bold text-xs">
                <span>Total Saídas Previstas:</span>
                <span className="text-white font-mono">R$ {totalCompromissosQ2.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div
            className={`p-3 rounded-xl border flex items-center justify-between text-xs font-bold ${
              saldoLiquidoQ2 >= 0
                ? 'bg-emerald-950/40 border-emerald-700/50 text-emerald-300'
                : 'bg-rose-950/40 border-rose-700/50 text-rose-300'
            }`}
          >
            <span>Balanço da 2ª Quinzena:</span>
            <span className="font-mono text-sm">
              {saldoLiquidoQ2 >= 0 ? `+ R$ ${saldoLiquidoQ2.toFixed(2)}` : `- R$ ${Math.abs(saldoLiquidoQ2).toFixed(2)}`}
            </span>
          </div>
          {saldoLiquidoQ2 < 0 && (
            <div className="text-[10px] text-amber-300 flex items-center gap-1">
              <AlertCircle className="w-3 h-3 flex-shrink-0" />
              <span>Necessidade de renda empreendedora do Natan para fechar a quinzena no azul.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
