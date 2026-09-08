import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { CheckCircle2, AlertTriangle, AlertOctagon, ArrowRight, Lightbulb } from 'lucide-react';

export default function Semaforo() {
  const { statusSemaforo, natanMetricsMes, currentGoal, reservaIntacta, data } = useFinance();

  const isGreen = statusSemaforo.cor === 'VERDE';
  const isYellow = statusSemaforo.cor === 'AMARELO';
  const isRed = statusSemaforo.cor === 'VERMELHO';

  return (
    <div
      className={`rounded-2xl p-5 border transition-all shadow-xl ${
        isGreen
          ? 'bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-950 border-emerald-700/40'
          : isYellow
          ? 'bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-950 border-amber-700/40'
          : 'bg-gradient-to-br from-rose-950/40 via-slate-900 to-slate-950 border-rose-700/40'
      }`}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div className="flex items-center space-x-4">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center border shadow-inner ${
              isGreen
                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-emerald-500/30'
                : isYellow
                ? 'bg-amber-500/20 border-amber-500 text-amber-400 shadow-amber-500/30'
                : 'bg-rose-500/20 border-rose-500 text-rose-400 shadow-rose-500/30'
            }`}
          >
            {isGreen && <CheckCircle2 className="w-8 h-8" />}
            {isYellow && <AlertTriangle className="w-8 h-8" />}
            {isRed && <AlertOctagon className="w-8 h-8" />}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider font-bold text-slate-400">
                Semáforo Financeiro Familiar
              </span>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-extrabold uppercase ${
                  isGreen
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : isYellow
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                }`}
              >
                {statusSemaforo.label}
              </span>
            </div>
            <h3 className="text-xl font-black text-white mt-0.5">
              {isGreen && 'Tudo sob controle e conforme o planejado'}
              {isYellow && 'Atenção aos gastos semanais e ritmo de vendas'}
              {isRed && 'Ação imediata requerida: risco de fluxo de caixa'}
            </h3>
          </div>
        </div>

        {/* Mini semáforo visual de 3 luzes */}
        <div className="flex items-center gap-2 bg-slate-950/80 px-3.5 py-2 rounded-xl border border-slate-800 self-start md:self-auto">
          <div
            className={`w-3.5 h-3.5 rounded-full transition-all ${
              isGreen ? 'bg-emerald-400 shadow-lg shadow-emerald-400/80 ring-2 ring-emerald-300' : 'bg-slate-800 opacity-40'
            }`}
          />
          <div
            className={`w-3.5 h-3.5 rounded-full transition-all ${
              isYellow ? 'bg-amber-400 shadow-lg shadow-amber-400/80 ring-2 ring-amber-300' : 'bg-slate-800 opacity-40'
            }`}
          />
          <div
            className={`w-3.5 h-3.5 rounded-full transition-all ${
              isRed ? 'bg-rose-500 shadow-lg shadow-rose-500/80 ring-2 ring-rose-300' : 'bg-slate-800 opacity-40'
            }`}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4 text-xs">
        {/* Motivos e Status Atual */}
        <div className="bg-slate-950/50 rounded-xl p-3.5 border border-slate-800/80">
          <h4 className="font-bold text-slate-300 mb-2 flex items-center gap-1.5">
            <span>Diagnóstico do Momento</span>
          </h4>
          <ul className="space-y-1.5">
            {statusSemaforo.motivos.map((motivo, idx) => (
              <li key={idx} className="flex items-start gap-2 text-slate-300">
                <span
                  className={`mt-0.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                    isGreen ? 'bg-emerald-400' : isYellow ? 'bg-amber-400' : 'bg-rose-400'
                  }`}
                />
                <span>{motivo}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Ação Recomendada & Diretrizes (Seções 32 e 33) */}
        <div className="bg-slate-950/50 rounded-xl p-3.5 border border-slate-800/80 flex flex-col justify-between">
          <div>
            <h4 className="font-bold text-slate-300 mb-1 flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              <span>Diretriz Estratégica do Casal</span>
            </h4>
            <p className="text-slate-300 leading-relaxed">{statusSemaforo.acaoRecomendada}</p>
          </div>

          <div className="mt-2 pt-2 border-t border-slate-800/60 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Regra de Ouro: Cartão não é renda. Sobras vão para caixa e reserva.</span>
            <span className="font-bold text-amber-300">Reserva: R$ 10.000 Blindada</span>
          </div>
        </div>
      </div>
    </div>
  );
}
