import React from 'react';
import { useFinance } from '../context/FinanceContext';
import {
  Wallet,
  ShieldCheck,
  CreditCard,
  TrendingUp,
  HelpCircle,
  Calendar,
  Layers,
  Heart,
  FileCheck,
  Zap,
  SlidersHorizontal,
  Download,
} from 'lucide-react';

export default function Navbar({ appMode, setAppMode, activeTab, setActiveTab, onOpenBackup }) {
  const {
    caixaOperacional,
    reservaProtegida,
    reservaIntacta,
    statusSemaforo,
    selectedMonth,
    setSelectedMonth,
    data,
  } = useFinance();

  const fullNavItems = [
    { id: 'dashboard', label: 'Dashboard Geral', icon: Layers },
    { id: 'simulator', label: 'Posso Gastar Isso?', icon: HelpCircle, highlight: true },
    { id: 'cards', label: 'Cartões & Queda das Faturas', icon: CreditCard },
    { id: 'entrepreneur', label: 'Empreendedorismo Natan', icon: TrendingUp },
    { id: 'pudding', label: 'Fábrica de Pudins', icon: Heart },
    { id: 'cashflow', label: 'Fluxo Quinzenal & Contas', icon: Calendar },
    { id: 'weeklyBudget', label: 'Teto Semanal (R$ 400)', icon: Wallet },
    { id: 'subscriptions', label: 'Assinaturas & Seguro', icon: FileCheck },
    { id: 'weeklyMeeting', label: 'Reunião de 15 Min', icon: FileCheck },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800/80">
      {/* Top Banner de Resumo Rápido e Modo de Uso */}
      <div className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-3 border-b border-slate-900">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Wallet className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-black text-lg tracking-tight text-white">Financeiro NaJu</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                Júlia & Natan
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Controle Familiar & Transição Débito</p>
          </div>
        </div>

        {/* Chave Seletora de Modo (Modo Diário Rápido vs Modo Completo) */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-2xl border border-slate-800 text-xs">
          <button
            onClick={() => setAppMode('DAILY')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition ${
              appMode === 'DAILY'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Modo Rápido</span>
          </button>
          <button
            onClick={() => setAppMode('FULL')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition ${
              appMode === 'FULL'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Modo Completo</span>
          </button>
        </div>

        {/* Indicadores do Topo */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Caixa Livre */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-slate-400 font-medium">Débito Livre:</span>
            <span className={`font-bold ${caixaOperacional < 500 ? 'text-amber-400' : 'text-emerald-400'}`}>
              R$ {caixaOperacional.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>

          {/* Reserva R$ 10k */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-950/40 border border-amber-800/50">
            <ShieldCheck className={`w-3.5 h-3.5 ${reservaIntacta ? 'text-amber-400' : 'text-rose-500'}`} />
            <span className="text-amber-300 font-bold">R$ {reservaProtegida.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            <span className="text-[9px] px-1 rounded bg-amber-500/20 text-amber-300 font-extrabold">
              BLINDADA
            </span>
          </div>

          {/* Seletor de Competência */}
          <div className="flex items-center gap-1 px-2 py-1 rounded-xl bg-slate-900 border border-slate-800">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent text-slate-200 font-bold text-xs focus:outline-none cursor-pointer"
            >
              {data.goals.map((g) => (
                <option key={g.mes} value={g.mes} className="bg-slate-900 text-slate-200">
                  {g.mes}
                </option>
              ))}
            </select>
          </div>

          {/* Botão de Backup */}
          <button
            onClick={onOpenBackup}
            title="Backup & Exportar/Importar Dados"
            className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Menu de Abas (visível apenas no Modo Completo ou para navegação manual) */}
      {appMode === 'FULL' && (
        <nav className="max-w-7xl mx-auto px-4 flex space-x-1 overflow-x-auto py-1.5 scrollbar-none animate-fadeIn">
          {fullNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
                  isActive
                    ? item.highlight
                      ? 'bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-md shadow-emerald-500/20'
                      : 'bg-slate-800 text-white shadow-sm'
                    : item.highlight
                    ? 'text-emerald-400 hover:bg-slate-900/80 hover:text-emerald-300'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : ''}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      )}
    </header>
  );
}
