import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import {
  Wallet,
  ShoppingCart,
  TrendingUp,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  HelpCircle,
  Calendar,
  Edit3,
  Check,
  X,
  AlertCircle,
  CheckCircle2,
  Tag,
  DollarSign,
  Layers,
} from 'lucide-react';
import VoiceInputBar from '../VoiceAssistant/VoiceInputBar';
import AIAdvisorCard from '../AIAdvisor/AIAdvisorCard';
import ProjectionsChart from '../Projections/ProjectionsChart';

export default function QuickDailyView({ onSwitchToFullMode, onNavigateToSimulator }) {
  const {
    caixaOperacional,
    saldoReservaCorretora,
    rendimentoEstimadoReserva,
    natanMetricsMes,
    currentGoal,
    selectedMonth,
    currentMonthInvoice,
    data,
    updateAccountBalance,
    confirmarVendaLavaLouca,
    receberRescisaoReal,
    totalContasJaPagasSetembro,
    totalContasQueFaltamPagar,
  } = useFinance();

  const [editingBalance, setEditingBalance] = useState(false);
  const [newBalanceInput, setNewBalanceInput] = useState(caixaOperacional.toString());
  const [showRescisaoModal, setShowRescisaoModal] = useState(false);
  const [rescisaoInput, setRescisaoInput] = useState('10000.00');

  // Quinzena ativa (1 = Dias 1 a 15 | 2 = Dias 16 ao Fim)
  const currentDay = new Date().getDate();
  const [selectedQuinzena, setSelectedQuinzena] = useState(currentDay <= 15 ? 1 : 2);

  const weekly = data.weeklyBudget || {};
  const tetoSemanal = weekly.tetoSemanal || 400;
  const gastoSemanal = weekly.gastoAtualSemana || 0;
  const saldoSemanal = tetoSemanal - gastoSemanal;
  const percentualSemana = Math.min(100, Math.round((gastoSemanal / tetoSemanal) * 100));

  const metaLiquida = currentGoal ? currentGoal.metaLiquida : 1200;
  const lucroAtual = natanMetricsMes.lucroLiquido;
  const percentualMeta = metaLiquida > 0 ? Math.min(100, Math.round((lucroAtual / metaLiquida) * 100)) : 0;

  const handleSaveBalance = () => {
    updateAccountBalance('conta_corrente', Number(newBalanceInput) || 0);
    setEditingBalance(false);
  };

  const handleConfirmarRescisao = (e) => {
    e.preventDefault();
    receberRescisaoReal(Number(rescisaoInput) || 10000);
    setShowRescisaoModal(false);
  };

  const metaLavaLouca = (data.shortTermGoals || []).find((g) => g.id === 'meta_lava_louca');
  const lavaLoucaVendida = metaLavaLouca?.status === 'CONCLUIDO';

  // Cálculos Quinzenais com base no cenário real confirmado:
  // 1ª Quinzena: Júlia dia 5 (R$ 2.400) + Natan dia 15 (R$ 2.400) = R$ 4.800 de entradas em Setembro!
  // Contas já pagas: Casa 1 (R$ 1.150) + Luz (R$ 200) + Internet (R$ 70) + Meninas (R$ 250) = R$ 1.670 já pagos!
  // Faltam vencer na 1ª quinzena: Academia (R$ 140) + Terapia (R$ 110) = R$ 250 + 2 semanas de mercado/gasolina (~R$ 800)
  const entradasQ1Setembro = 2400.00 + 2400.00 + (lavaLoucaVendida ? 700 : 0);
  const pendenciasQ1 = 140.00 + 110.00 + 800.00; // Academia, terapia, mercado/gasolina
  const sobraEsperadaQ1 = entradasQ1Setembro - (1670.00 + pendenciasQ1); // ~R$ 2.080 de sobra que apoia a 2ª quinzena!

  // 2ª Quinzena: Júlia dia 20 (R$ 1.800)
  // Contas: Condomínio (R$ 400 dia 20) + Financiamento 2 (R$ 790 dia 23) + Fatura Júlia (R$ 2.358,80 dia 24) + Mercado/Gasolina (R$ 800)
  // Total saídas 2ª quinzena: R$ 4.348,80
  // Cobertura: R$ 1.800 (Júlia) + Sobra do salário do Natan (R$ 2.080 da 1ª quinzena) + Renda Empreendedorismo Natan!
  const totalSaidasQ2 = 400.00 + 790.00 + 2358.80 + 800.00;
  const diferencaQ2 = totalSaidasQ2 - 1800.00; // R$ 2.548,80 coberto pelo salário do Natan de 15/09

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fadeIn">
      {/* 1. Barra de Entrada Rápida por Voz / Texto no Topo */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Lançamento em 3 Segundos (Áudio ou Texto)</span>
          </span>
          <button
            onClick={onNavigateToSimulator}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Posso Gastar Isso?</span>
          </button>
        </div>
        <VoiceInputBar />
      </div>

      {/* 2. Destaque do Saldo Real, Reserva na Corretora e Meta da Lava-Louça */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Débito Livre Real */}
        <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-4 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Débito Livre Hoje</span>
            <div className="flex items-center gap-1">
              {!editingBalance && (
                <button
                  onClick={() => {
                    setNewBalanceInput(caixaOperacional.toString());
                    setEditingBalance(true);
                  }}
                  className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
                  title="Editar saldo real em conta"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              )}
              <div className="p-1.5 rounded-xl bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                <Wallet className="w-4 h-4" />
              </div>
            </div>
          </div>

          <div className="my-2">
            {editingBalance ? (
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-400">R$</span>
                <input
                  type="number"
                  step="0.01"
                  value={newBalanceInput}
                  onChange={(e) => setNewBalanceInput(e.target.value)}
                  className="w-full px-2 py-1 bg-slate-950 border border-emerald-500 rounded-xl text-white font-black text-lg focus:outline-none"
                  autoFocus
                />
                <button onClick={handleSaveBalance} className="p-1 bg-emerald-600 rounded-lg text-white">
                  <Check className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => setEditingBalance(false)} className="p-1 bg-slate-800 rounded-lg text-slate-400">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <>
                <div className="text-2xl font-black text-white">
                  R$ {caixaOperacional.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <div className="text-[11px] font-bold text-emerald-400 mt-0.5">
                  ✓ Livre para gastos imediatos
                </div>
              </>
            )}
          </div>

          <div className="text-[10px] text-slate-400 pt-1.5 border-t border-slate-800">
            Contas de início de mês (R$ 1.670) já foram pagas!
          </div>
        </div>

        {/* Card 2: Reserva Blindada na Corretora */}
        <div className="bg-gradient-to-b from-amber-950/30 to-slate-900 border border-amber-800/40 rounded-3xl p-4 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-300 uppercase">Reserva Corretora</span>
            <div className="p-1.5 rounded-xl bg-amber-900/50 text-amber-300 border border-amber-700/40">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>

          <div className="my-2">
            <div className="text-2xl font-black text-amber-300">
              R$ {saldoReservaCorretora.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <div className="text-[11px] font-bold text-emerald-400 mt-0.5">
              + ~R$ {rendimentoEstimadoReserva.toFixed(2)}/mês (1% ao mês)
            </div>
          </div>

          <div className="text-[10px] text-amber-200/80 pt-1.5 border-t border-amber-800/40 font-medium">
            Rescisão (~R$ 10k) cai ~21/09 e somará aqui!
          </div>
        </div>

        {/* Card 3: Meta Curto Prazo (Lava-Louça) */}
        <div className={`border rounded-3xl p-4 shadow-xl flex flex-col justify-between transition ${
          lavaLoucaVendida
            ? 'bg-emerald-950/30 border-emerald-700/50'
            : 'bg-slate-900/95 border-slate-800'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 uppercase">Meta Esta Semana</span>
            <div className="p-1.5 rounded-xl bg-purple-950/60 text-purple-300 border border-purple-800/40">
              <Tag className="w-4 h-4" />
            </div>
          </div>

          <div className="my-2">
            <div className="text-2xl font-black text-white">
              R$ 700,00
            </div>
            <div className="text-[11px] text-slate-300 font-medium mt-0.5">
              Venda Lava-Louça (até sexta)
            </div>
          </div>

          <div className="pt-1.5 border-t border-slate-800">
            {lavaLoucaVendida ? (
              <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>R$ 700 Injetados no Caixa!</span>
              </span>
            ) : (
              <button
                onClick={confirmarVendaLavaLouca}
                className="w-full py-1 px-2 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 font-bold text-[10px] border border-emerald-500/40 transition flex items-center justify-center gap-1"
              >
                <span>Confirmar Venda (+R$ 700)</span>
              </button>
            )}
          </div>
        </div>

        {/* Card 4: Teto Semanal (R$ 400 Mercado + Gasolina) */}
        <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-4 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Teto Semanal (R$ 400)</span>
            <div className="p-1.5 rounded-xl bg-amber-950/60 text-amber-400 border border-amber-800/40">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>

          <div className="my-2">
            <div className="text-2xl font-black text-white">
              R$ {saldoSemanal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <div className="text-[11px] font-bold text-amber-400 mt-0.5">
              Sobra para Mercado/Gasolina
            </div>
          </div>

          <div className="pt-1.5 border-t border-slate-800 text-[10px] text-slate-400">
            Gasto na semana: R$ {gastoSemanal.toFixed(2)}
          </div>
        </div>
      </div>

      {/* 3. PAINEL QUINZENAL CALIBRADO COM AS DATAS REAIS */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-950/60 text-teal-400 border border-teal-800/40">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-sm">
                Fluxo Quinzenal Real — Júlia (Dias 5 e 20) & Natan (Dia 15)
              </h3>
              <p className="text-xs text-slate-400">
                Visualização exata conforme os dias de recebimento e vencimentos
              </p>
            </div>
          </div>

          {/* Seletor de Quinzena */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-2xl border border-slate-800 text-xs">
            <button
              onClick={() => setSelectedQuinzena(1)}
              className={`px-3 py-1.5 rounded-xl font-bold transition ${
                selectedQuinzena === 1
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              1ª Quinzena (Dias 1 a 15)
            </button>
            <button
              onClick={() => setSelectedQuinzena(2)}
              className={`px-3 py-1.5 rounded-xl font-bold transition ${
                selectedQuinzena === 2
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              2ª Quinzena (Dias 16 ao Fim)
            </button>
          </div>
        </div>

        {/* 1ª Quinzena: Dia 1 ao 15 */}
        {selectedQuinzena === 1 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs animate-fadeIn">
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2.5">
              <span className="font-bold text-white block pb-1 border-b border-slate-800">
                Entradas da 1ª Quinzena (Setembro)
              </span>
              <div className="space-y-1.5 text-slate-300">
                <div className="flex justify-between">
                  <span>Júlia (Recebido Dia 05):</span>
                  <span className="font-bold text-emerald-400">+ R$ 2.400,00</span>
                </div>
                <div className="flex justify-between">
                  <span>Natan (Último Salário Dia 15):</span>
                  <span className="font-bold text-emerald-400">+ R$ 2.400,00</span>
                </div>
                {lavaLoucaVendida && (
                  <div className="flex justify-between text-purple-300">
                    <span>Venda da Lava-Louça:</span>
                    <span className="font-bold text-emerald-400">+ R$ 700,00</span>
                  </div>
                )}
                <div className="border-t border-slate-800 pt-1.5 flex justify-between font-bold text-white">
                  <span>Total Entradas 1ª Quinzena:</span>
                  <span className="font-mono text-emerald-400">R$ {entradasQ1Setembro.toFixed(2)}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                <span className="text-emerald-400 font-bold block mb-0.5">✓ Contas já quitadas no início do mês:</span>
                Casa 1 (R$ 1.150), Energia (R$ 200), Internet (R$ 70), Meninas (R$ 250) = <strong>R$ 1.670,00 pagos</strong>.
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between space-y-3">
              <div>
                <span className="font-bold text-slate-300 block mb-1">O que resta vencer até dia 15:</span>
                <ul className="space-y-1 text-slate-300 text-[11px]">
                  <li className="flex justify-between">
                    <span>Academia (Dia 15):</span>
                    <span className="font-mono">R$ 140,00</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Terapia (Dia 15):</span>
                    <span className="font-mono">R$ 110,00</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Provisão Mercado/Gasolina (2 sem.):</span>
                    <span className="font-mono">R$ 800,00</span>
                  </li>
                </ul>
              </div>

              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-700/50 text-emerald-300">
                <div className="text-[11px] font-semibold">Sobra Real da 1ª Quinzena:</div>
                <div className="text-lg font-black font-mono mt-0.5">+ R$ {sobraEsperadaQ1.toFixed(2)}</div>
                <div className="text-[10px] text-slate-400 mt-1">
                  Essa sobra é a ponte de ouro que garante a quitação da fatura da Júlia no dia 24/09!
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* 2ª Quinzena: Dia 16 ao Fim */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs animate-fadeIn">
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2.5">
              <span className="font-bold text-white block pb-1 border-b border-slate-800">
                Entradas da 2ª Quinzena (Setembro)
              </span>
              <div className="space-y-1.5 text-slate-300">
                <div className="flex justify-between">
                  <span>Júlia (Recebimento Dia 20):</span>
                  <span className="font-bold text-emerald-400">+ R$ 1.800,00</span>
                </div>
                <div className="flex justify-between text-indigo-300">
                  <span>Sobra do Salário do Natan (de 15/09):</span>
                  <span className="font-bold text-emerald-400">+ R$ {sobraEsperadaQ1.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-amber-300 font-medium">
                  <span>Rescisão Natan (~21/09):</span>
                  <span className="font-bold text-amber-300">R$ ~10.000 (Vai para Reserva!)</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 text-[10px] text-amber-300/90 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                <span>A rescisão de ~21/09 é 100% blindada e vai para a reserva, sem pagar faturas com ela.</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between space-y-3">
              <div>
                <span className="font-bold text-white block mb-1">Contas a pagar na 2ª Quinzena:</span>
                <ul className="space-y-1 text-slate-300 text-[11px]">
                  <li className="flex justify-between">
                    <span>Condomínio (Dia 20):</span>
                    <span className="font-mono text-rose-400">- R$ 400,00</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Financiamento Imóvel 2 (Dia 23):</span>
                    <span className="font-mono text-rose-400">- R$ 790,00</span>
                  </li>
                  <li className="flex justify-between font-bold text-white">
                    <span>Fatura Cartão Júlia (Dia 24):</span>
                    <span className="font-mono text-rose-400">- R$ 2.358,80</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Provisão Mercado/Gasolina (2 sem.):</span>
                    <span className="font-mono text-rose-400">- R$ 800,00</span>
                  </li>
                </ul>
              </div>

              <div className="p-3 rounded-xl bg-teal-950/40 border border-teal-700/50 text-teal-300">
                <div className="text-[11px] font-semibold">Equação da Fatura de 24/09:</div>
                <p className="text-[11px] text-slate-200 mt-1 leading-relaxed">
                  Os R$ 1.800 da Júlia do dia 20 + a sobra do salário do Natan (de 15/09) cobrem integralmente a fatura de R$ 2.358,80 sem precisar recorrer à reserva!
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. Consultor IA NaJu */}
      <AIAdvisorCard />

      {/* 5. Gráfico de Projeções de Faturas & Metas */}
      <ProjectionsChart />

      {/* Banner para Modo Estratégico */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div>
          <span className="font-bold text-white block">Quer ver tabelas completas até 2027 ou cadastrar despesas?</span>
          <span className="text-slate-400">
            Acesse o Modo Estratégico para ver todos os detalhes das 50 seções do Manual.
          </span>
        </div>
        <button
          onClick={onSwitchToFullMode}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition flex items-center justify-center gap-1.5 flex-shrink-0"
        >
          <span>Abrir Modo Completo</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Modal para Calibrar Rescisão no dia 21/09 */}
      {showRescisaoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-black text-white text-base">Confirmar Valor da Rescisão Natan</h3>
              <button onClick={() => setShowRescisaoModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-400">
              Conforme alinhado, quando a rescisão cair no dia 21/09, digite o valor exato com cada centavo:
            </p>
            <form onSubmit={handleConfirmarRescisao} className="space-y-3">
              <div>
                <label className="block text-slate-300 text-xs font-bold mb-1">Valor Líquido Recebido (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  value={rescisaoInput}
                  onChange={(e) => setRescisaoInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-black text-base"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRescisaoModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                >
                  Confirmar e Blindar na Reserva
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
