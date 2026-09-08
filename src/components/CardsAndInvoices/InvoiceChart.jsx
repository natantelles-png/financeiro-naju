import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { TrendingDown, Info } from 'lucide-react';

export default function InvoiceChart() {
  const { data } = useFinance();
  const invoices = data.invoices || [];

  const [hoveredIdx, setHoveredIdx] = useState(null);

  // Filtramos os valores numéricos válidos para a curva
  const maxVal = 4500;
  const width = 800;
  const height = 240;
  const paddingX = 50;
  const paddingY = 30;

  const points = invoices.map((inv, idx) => {
    const x = paddingX + (idx / (invoices.length - 1)) * (width - 2 * paddingX);
    const val = inv.total || 0;
    const y = height - paddingY - (val / maxVal) * (height - 2 * paddingY);
    return { x, y, inv, idx };
  });

  const pathD = points.reduce((acc, pt, i) => {
    if (i === 0) return `M ${pt.x},${pt.y}`;
    const prev = points[i - 1];
    const cx = (prev.x + pt.x) / 2;
    return `${acc} C ${cx},${prev.y} ${cx},${pt.y} ${pt.x},${pt.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x},${height - paddingY} L ${points[0].x},${height - paddingY} Z`;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-rose-950/60 text-rose-400 border border-rose-800/40">
            <TrendingDown className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-white text-sm">
              Curva de Queda das Faturas (Desalavancagem Familiar)
            </h3>
            <p className="text-xs text-slate-400">
              De R$ 4.003,48 no pico de Out/26 para R$ 148,56 em Jul/27
            </p>
          </div>
        </div>

        <div className="text-[11px] px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-800 text-emerald-300 font-bold self-start">
          ↘ -96,3% de comprometimento até Jul/27
        </div>
      </div>

      {/* Gráfico SVG */}
      <div className="relative w-full overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto min-w-[600px] overflow-visible">
          <defs>
            <linearGradient id="invoiceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Linhas de grade horizontais */}
          {[1000, 2000, 3000, 4000].map((val) => {
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

          {/* Área sombreada */}
          <path d={areaD} fill="url(#invoiceGradient)" />

          {/* Linha da curva */}
          <path d={pathD} fill="none" stroke="#f43f5e" strokeWidth="3" strokeLinecap="round" />

          {/* Pontos clicáveis com destaque */}
          {points.map((pt, i) => {
            const isHovered = hoveredIdx === i;
            const isPico = pt.inv.pico;
            return (
              <g
                key={i}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="cursor-pointer"
              >
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? 7 : isPico ? 6 : 4}
                  fill={isPico ? '#fb7185' : '#f43f5e'}
                  stroke="#ffffff"
                  strokeWidth={isHovered || isPico ? 2.5 : 1.5}
                />
                <text
                  x={pt.x}
                  y={height - 8}
                  textAnchor="middle"
                  fill={isHovered ? '#ffffff' : '#94a3b8'}
                  fontSize="10"
                  fontWeight={isHovered || isPico ? 'bold' : 'normal'}
                >
                  {pt.inv.mes}
                </text>

                {/* Tooltip do Ponto */}
                {isHovered && (
                  <g>
                    <rect
                      x={pt.x - 60}
                      y={pt.y - 42}
                      width="120"
                      height="32"
                      rx="6"
                      fill="#0f172a"
                      stroke="#475569"
                      strokeWidth="1"
                    />
                    <text
                      x={pt.x}
                      y={pt.y - 28}
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="10"
                      fontWeight="bold"
                    >
                      {pt.inv.mes}: R$ {pt.inv.total.toFixed(2)}
                    </text>
                    <text
                      x={pt.x}
                      y={pt.y - 16}
                      textAnchor="middle"
                      fill="#38bdf8"
                      fontSize="8"
                    >
                      {isPico ? 'Pico Crítico!' : pt.inv.natanNaoInformado ? '+ Natan a confirmar' : 'Queda contínua'}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      <div className="flex items-center gap-2 p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-[11px] text-slate-400">
        <Info className="w-4 h-4 text-sky-400 flex-shrink-0" />
        <span>
          <strong>Oportunidade do Planejamento:</strong> Cada mês vencido é uma vitória. O alívio de Outubro para Março libera mais de R$ 3.100 mensais de fluxo de caixa familiar.
        </span>
      </div>
    </div>
  );
}
