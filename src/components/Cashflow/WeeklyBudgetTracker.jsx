import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { ShoppingCart, Fuel, Plus, RotateCcw, AlertTriangle, CheckCircle2, TrendingUp } from 'lucide-react';

export default function WeeklyBudgetTracker() {
  const { data, addWeeklyExpense, resetWeeklyExpenses } = useFinance();
  const weekly = data.weeklyBudget || {
    tetoSemanal: 400,
    mercadoSemanal: 300,
    gasolinaSemanal: 100,
    gastoAtualSemana: 0,
    detalhesSemana: [],
  };

  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [categoria, setCategoria] = useState('Mercado');
  const [modoAno, setModoAno] = useState(false); // 4 semanas vs 52 semanas/ano

  const teto = weekly.tetoSemanal || 400;
  const realizado = weekly.gastoAtualSemana || 0;
  const disponivel = teto - realizado;
  const percentualGasto = Math.min(100, Math.round((realizado / teto) * 100));

  const handleAddExpense = (e) => {
    e.preventDefault();
    const valNum = Number(valor);
    if (!valNum || valNum <= 0) return;

    addWeeklyExpense({
      descricao: descricao || `${categoria} semanal`,
      valor: valNum,
      categoria,
    });

    setDescricao('');
    setValor('');
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-950/60 text-amber-400 border border-amber-800/40">
            <ShoppingCart className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-white text-sm">
              Controle de Orçamento Semanal (Mercado & Gasolina)
            </h3>
            <p className="text-xs text-slate-400">
              Teto de R$ 400 por semana (R$ 300 Mercado + R$ 100 Gasolina)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setModoAno(!modoAno)}
            className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-medium transition"
          >
            {modoAno ? 'Modo 52 semanas/ano (Ativo)' : 'Modo 4 semanas/mês'}
          </button>
          <button
            onClick={resetWeeklyExpenses}
            className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-semibold flex items-center gap-1 transition"
            title="Zerar gastos para iniciar nova semana"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Virar Semana</span>
          </button>
        </div>
      </div>

      {/* Visor Central do Teto Semanal */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
          <div className="text-[11px] text-slate-400 font-medium">Teto da Semana</div>
          <div className="text-2xl font-black text-white mt-1">R$ {teto.toFixed(2)}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">R$ 300 mercado + R$ 100 gasolina</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
          <div className="text-[11px] text-slate-400 font-medium">Gasto Realizado</div>
          <div className={`text-2xl font-black mt-1 ${realizado > teto ? 'text-rose-400' : 'text-amber-400'}`}>
            R$ {realizado.toFixed(2)}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">{percentualGasto}% do teto consumido</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
          <div className="text-[11px] text-slate-400 font-medium">Disponível Restante</div>
          <div
            className={`text-2xl font-black mt-1 ${
              disponivel < 0 ? 'text-rose-400' : disponivel < 100 ? 'text-amber-400' : 'text-emerald-400'
            }`}
          >
            R$ {disponivel.toFixed(2)}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            {disponivel < 0 ? '⚠️ Teto estourado nesta semana!' : '✓ Dentro da meta semanal'}
          </div>
        </div>
      </div>

      {/* Barra de Progresso Semanal */}
      <div className="space-y-1.5">
        <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800 p-0.5">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              realizado > teto ? 'bg-rose-500' : percentualGasto > 80 ? 'bg-amber-500' : 'bg-emerald-500'
            }`}
            style={{ width: `${Math.min(100, percentualGasto)}%` }}
          />
        </div>
        <div className="flex justify-between text-[11px] text-slate-400">
          <span>0%</span>
          <span>50%</span>
          <span className="font-bold text-slate-200">100% (R$ 400)</span>
        </div>
      </div>

      {/* Formulário Rápido de Inclusão e Histórico da Semana */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 pt-2">
        <form onSubmit={handleAddExpense} className="md:col-span-5 bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-3 text-xs">
          <span className="font-bold text-white block">Lançar Compra da Semana (Débito)</span>

          <div>
            <label className="block text-slate-400 mb-1">Categoria</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setCategoria('Mercado')}
                className={`py-2 rounded-xl font-bold flex items-center justify-center gap-1.5 border transition ${
                  categoria === 'Mercado'
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Mercado</span>
              </button>
              <button
                type="button"
                onClick={() => setCategoria('Gasolina')}
                className={`py-2 rounded-xl font-bold flex items-center justify-center gap-1.5 border transition ${
                  categoria === 'Gasolina'
                    ? 'bg-sky-500/20 border-sky-500 text-sky-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                <Fuel className="w-3.5 h-3.5" />
                <span>Gasolina</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Valor (R$)</label>
            <input
              type="number"
              step="0.01"
              placeholder="0,00"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold focus:outline-none focus:border-amber-500"
              required
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Descrição</label>
            <input
              type="text"
              placeholder="Ex: Açougue, Feira, Posto Ipiranga..."
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-extrabold shadow-md transition flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Debitar do Caixa & Somar na Semana</span>
          </button>
        </form>

        {/* Histórico da Semana Corrente */}
        <div className="md:col-span-7 bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-2 text-xs">
          <span className="font-bold text-white block pb-2 border-b border-slate-800">
            Gastos Realizados na Semana Atual
          </span>

          {(!weekly.detalhesSemana || weekly.detalhesSemana.length === 0) ? (
            <div className="p-6 text-center text-slate-500">
              Nenhum gasto registrado nesta semana. Comece lançando ao lado!
            </div>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {weekly.detalhesSemana.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80"
                >
                  <div className="flex items-center gap-2">
                    {item.categoria === 'Mercado' ? (
                      <ShoppingCart className="w-3.5 h-3.5 text-amber-400" />
                    ) : (
                      <Fuel className="w-3.5 h-3.5 text-sky-400" />
                    )}
                    <div>
                      <div className="font-semibold text-slate-200">{item.descricao}</div>
                      <div className="text-[10px] text-slate-400">{item.data}</div>
                    </div>
                  </div>
                  <div className="font-mono font-bold text-white">
                    R$ {Number(item.valor).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
