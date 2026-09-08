import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { X, Sparkles, Plus, DollarSign, Clock, AlertCircle } from 'lucide-react';

export default function ActivityForm({ onClose }) {
  const { addEntrepreneurLog } = useFinance();

  const [data, setData] = useState(new Date().toISOString().split('T')[0]);
  const [atividade, setAtividade] = useState('Uber');
  const [faturamento, setFaturamento] = useState('');
  const [combustivel, setCombustivel] = useState('');
  const [insumos, setInsumos] = useState('');
  const [embalagens, setEmbalagens] = useState('');
  const [taxas, setTaxas] = useState('');
  const [manutencao, setManutencao] = useState('');
  const [outrosCustos, setOutrosCustos] = useState('');
  const [horasTrabalhadas, setHorasTrabalhadas] = useState('');
  const [observacoes, setObservacoes] = useState('');

  // Cálculos prévios dinâmicos
  const fatNum = Number(faturamento) || 0;
  const custosTotais =
    (Number(combustivel) || 0) +
    (Number(insumos) || 0) +
    (Number(embalagens) || 0) +
    (Number(taxas) || 0) +
    (Number(manutencao) || 0) +
    (Number(outrosCustos) || 0);

  const lucroLiquido = fatNum - custosTotais;
  const horasNum = Number(horasTrabalhadas) || 0;
  const lucroPorHora = horasNum > 0 ? lucroLiquido / horasNum : 0;
  const margem = fatNum > 0 ? (lucroLiquido / fatNum) * 100 : 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!faturamento || Number(faturamento) <= 0) {
      alert('Informe o faturamento bruto.');
      return;
    }

    addEntrepreneurLog({
      data,
      atividade,
      faturamento,
      combustivel,
      insumos,
      embalagens,
      taxas,
      manutencao,
      outrosCustos,
      horasTrabalhadas,
      observacoes,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-xl w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-black text-white">Lançar Atividade Empreendedora</h3>
            <p className="text-xs text-slate-400">
              Registrar faturamento bruto, custos diretos e horas (Seção 27)
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Data</label>
              <input
                type="date"
                value={data}
                onChange={(e) => setData(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-medium focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Atividade</label>
              <select
                value={atividade}
                onChange={(e) => setAtividade(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold focus:outline-none focus:border-indigo-500"
              >
                <option value="Uber">Uber / Aplicativo de Mobilidade</option>
                <option value="Pudim">Venda de Pudins (Lote)</option>
                <option value="Doces Variados">Venda de Doces & Sobremesas</option>
                <option value="Outra Renda">Outra Fonte Empreendedora</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Faturamento Bruto (R$)</label>
              <input
                type="number"
                step="0.01"
                placeholder="Ex: 300,00"
                value={faturamento}
                onChange={(e) => setFaturamento(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-indigo-500/60 text-white font-black text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Horas Trabalhadas (h)</label>
              <input
                type="number"
                step="0.1"
                placeholder="Ex: 5.5"
                value={horasTrabalhadas}
                onChange={(e) => setHorasTrabalhadas(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Custos Operacionais */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 space-y-3">
            <span className="text-[11px] uppercase tracking-wider font-extrabold text-rose-400">
              Custos Diretos da Atividade
            </span>

            <div className="grid grid-cols-3 gap-2.5">
              <div>
                <label className="block text-[10px] text-slate-400 mb-0.5">Combustível</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0,00"
                  value={combustivel}
                  onChange={(e) => setCombustivel(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 mb-0.5">Insumos/Ingredientes</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0,00"
                  value={insumos}
                  onChange={(e) => setInsumos(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 mb-0.5">Embalagens</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0,00"
                  value={embalagens}
                  onChange={(e) => setEmbalagens(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 mb-0.5">Taxas (App/Pix)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0,00"
                  value={taxas}
                  onChange={(e) => setTaxas(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 mb-0.5">Manutenção Carro</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0,00"
                  value={manutencao}
                  onChange={(e) => setManutencao(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 mb-0.5">Outros Custos</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0,00"
                  value={outrosCustos}
                  onChange={(e) => setOutrosCustos(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Observações (opcional)</label>
            <input
              type="text"
              placeholder="Ex: Turno da chuva; lote de 30 entregue no condomínio"
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none"
            />
          </div>

          {/* Resumo em Tempo Real */}
          <div className="bg-indigo-950/40 border border-indigo-800/50 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase font-bold text-indigo-300">Lucro Líquido Real Calculado</div>
              <div className={`text-xl font-black ${lucroLiquido >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                R$ {lucroLiquido.toFixed(2)}
              </div>
              <div className="text-[10px] text-slate-400">
                Custos Totais: R$ {custosTotais.toFixed(2)}
              </div>
            </div>

            <div className="text-right">
              <div className="text-[10px] uppercase font-bold text-indigo-300">Lucro por Hora</div>
              <div className="text-base font-bold text-amber-300">
                R$ {lucroPorHora.toFixed(2)}/h
              </div>
              <div className="text-[10px] text-slate-400">Margem: {margem.toFixed(1)}%</div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold shadow-lg shadow-emerald-600/30 transition flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>Salvar Atividade & Atualizar Caixa</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
