import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { TrendingDown, TrendingUp, Sparkles, Layers } from 'lucide-react';

export default function ProjectionsChart() {
  const { data } = useFinance();
  const [viewMode, setViewMode] = useState('COMBINADO'); // 'CARTOES', 'GANHOS', 'COMBINADO'

  const invoices = data.invoices || [];
  const goals = data.goals || [];

  const months = ['Set/26', 'Out/26', 'Nov/26', 'Dez/26', 'Jan/27', 'Fev/27', 'Mar/27', 'Abr/27', 'Mai/27', 'Jun/27', 'Jul/27', 'Ago/27'];

  // Dados pareados mês a mês
  const chartData = months.map((m) => {
    const inv = invoices.find((i) => i.mes === m);
    const goal = goals.find((g) => g.mes === m);
    return {
      mes: m,
      fatura: inv && inv.total ? inv.total : 0,
      metaNatan: goal ? goal.metaLiquida : 0,
      natanNaoInformado: inv?.natanNaoInformado,
    };
  });

  const maxVal = 6000;
  const width = 800;
  const height = 240;
  const paddingX = 50;
  const paddingY = 30;

  const pointsFaturas = chartData.map((d, idx) => {
    const x = paddingX + (idx / (chartData.length - 1)) * (width - 2 * paddingX);
    const y = height - paddingY - (d.fatura / maxVal) * (height - 2 * paddingY);
    return { x, y, val: d.fatura, mes: d.mes };
  });

  const pointsMetas = chartData.map((d, idx) => {
    const x = paddingX + (idx / (chartData.length - 1)) * (width - 2 * paddingX);
    const y = height - paddingY - (d.metaNatan / maxVal) * (height - 2 * paddingY);
    return { x, y, val: d.metaNatan, mes: d.mes };
  });

  const generatePath = (points) => {
    return points.reduce((acc, pt, i) => {
      if (i === 0) return `M ${pt.x},${pt.y}`;
      const prev = points[i - 1];
      const cx = (prev.x + pt.x) / 2;
      return `${acc} C ${cx},${prev.y} ${cx},${pt.y} ${pt.x},${pt.y}`;
    }, '');
  };

  const pathFaturas = generatePath(pointsFaturas);
  const pathMetas = generatePath(pointsMetas);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            <span>Projeção Estratégica: Faturas em Queda vs Ganhos do Natan</span>
          </h3>
          <p className="text-xs text-slate-400">
            Veja como a pressão das dívidas cai enquanto as metas se estabilizam
          </p>
        </div>

        {/* Seletor de visualização */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 self-start sm:self-auto text-xs">
          <button
            onClick={() => setViewMode('COMBINADO')}
            className={`px-2.5 py-1 rounded-lg font-bold transition ${
              viewMode === 'COMBINADO' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Visão Dupla
          </button>
          <button
            onClick={() => setViewMode('CARTOES')}
            className={`px-2.5 py-1 rounded-lg font-bold transition ${
              viewMode === 'CARTOES' ? 'bg-rose-950/60 text-rose-300 border border-rose-800/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            Queda Faturas
          </button>
          <button
            onClick={() => setViewMode('GANHOS')}
            className={`px-2.5 py-1 rounded-lg font-bold transition ${
              viewMode === 'GANHOS' ? 'bg-indigo-950/60 text-indigo-300 border border-indigo-800/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            Metas Natan
          </button>
        </div>
      </div>

      {/* Legenda */}
      <div className="flex flex-wrap items-center gap-4 text-xs">
        {(viewMode === 'COMBINADO' || viewMode === 'CARTOES') && (
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500" />
            <span className="text-slate-300 font-semibold">Queda das Faturas (De R$ 4.003 para R$ 148)</span>
          </div>
        )}
        {(viewMode === 'COMBINADO' || viewMode === 'GANHOS') && (
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-indigo-400" />
            <span className="text-slate-300 font-semibold">Meta Líquida Natan (Pico em Out R$ 5.500 ➔ Estabiliza R$ 1.600)</span>
          </div>
        )}
      </div>

      {/* Gráfico SVG Responsivo */}
      <div className="relative w-full overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto min-w-[600px] overflow-visible">
          {/* Linhas de Grade Horizontais */}
          {[1500, 3000, 4500, 5500].map((val) => {
            const y = height - paddingY - (val / maxVal) * (height - 2 * paddingY);
            return (
              <g key={val}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke="#334155"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
                <text x={paddingX - 10} y={y + 3} textAnchor="end" fill="#64748b" fontSize="10">
                  R$ {val}
                </text>
              </g>
            );
          })}

          {/* Curva das Faturas (Vermelha/Rosa) */}
          {(viewMode === 'COMBINADO' || viewMode === 'CARTOES') && (
            <>
              <path d={pathFaturas} fill="none" stroke="#f43f5e" strokeWidth="3" strokeLinecap="round" />
              {pointsFaturas.map((pt, i) => (
                <circle
                  key={`fat_${i}`}
                  cx={pt.x}
                  cy={pt.y}
                  r="4.5"
                  fill="#f43f5e"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />
              ))}
            </>
          )}

          {/* Curva das Metas do Natan (Índigo/Roxa) */}
          {(viewMode === 'COMBINADO' || viewMode === 'GANHOS') && (
            <>
              <path d={pathMetas} fill="none" stroke="#818cf8" strokeWidth="3" strokeLinecap="round" strokeDasharray={viewMode === 'COMBINADO' ? '5 5' : 'none'} />
              {pointsMetas.map((pt, i) => (
                <circle
                  key={`meta_${i}`}
                  cx={pt.x}
                  cy={pt.y}
                  r="4.5"
                  fill="#818cf8"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />
              ))}
            </>
          )}

          {/* Rótulos dos Meses no Eixo X */}
          {chartData.map((d, i) => {
            const x = paddingX + (i / (chartData.length - 1)) * (width - 2 * paddingX);
            return (
              <text
                key={d.mes}
                x={x}
                y={height - 8}
                textAnchor="middle"
                fill="#94a3b8"
                fontSize="10"
              >
                {d.mes}
              </text>
            );
          })}
        </svg>
      </div>

      <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-[11px] text-slate-300 leading-relaxed">
        <strong>💡 Insight Estratégico (Seção 18 e 45):</strong> Em Outubro e Novembro/2026, a meta do Natan é máxima (R$ 5.500) justamente para suportar o pico das faturas. A partir de Março/2027, as faturas desabam para R$ 870 e em Julho para R$ 148, permitindo que a família poupe e direcione toda a sobra para a reserva e o casamento!
      </div>
    </div>
  );
}
