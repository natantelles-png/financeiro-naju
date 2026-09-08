import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { Heart, Sparkles, Plus, Calculator, ArrowRight, CheckCircle2, TrendingUp, Info } from 'lucide-react';

export default function PuddingCalculator() {
  const { addEntrepreneurLog } = useFinance();

  const [numeroLotes, setNumeroLotes] = useState('1'); // 1 lote = 30 unidades
  const [unidadesPorLote, setUnidadesPorLote] = useState('30');
  const [precoPorUnidade, setPrecoPorUnidade] = useState('10.00');
  const [custoIngredientesLote, setCustoIngredientesLote] = useState('75.00');
  const [custoEmbalagensLote, setCustoEmbalagensLote] = useState('18.00');
  const [custoGasEnergiaLote, setCustoGasEnergiaLote] = useState('12.00');
  
  // Custos adicionais variáveis (Seção 42)
  const [perdasUnidades, setPerdasUnidades] = useState('0'); // Não vendidas/descarte
  const [custoTransporte, setCustoTransporte] = useState('15.00');
  const [taxaPagamentoPercent, setTaxaPagamentoPercent] = useState('2.0'); // 2% de maquininha/Pix
  const [horasProducao, setHorasProducao] = useState('3.5');
  const [mensagem, setMensagem] = useState('');

  // Cálculos
  const lotes = Number(numeroLotes) || 1;
  const unidLote = Number(unidadesPorLote) || 30;
  const totalProduzido = lotes * unidLote;
  const perdas = Number(perdasUnidades) || 0;
  const totalVendido = Math.max(0, totalProduzido - perdas);
  const preco = Number(precoPorUnidade) || 10;

  const faturamentoBruto = totalVendido * preco;

  const custoLoteUnit =
    (Number(custoIngredientesLote) || 0) +
    (Number(custoEmbalagensLote) || 0) +
    (Number(custoGasEnergiaLote) || 0);

  const custoBaseTotal = custoLoteUnit * lotes;
  const custoTaxas = (faturamentoBruto * (Number(taxaPagamentoPercent) || 0)) / 100;
  const transporte = Number(custoTransporte) || 0;

  const custosTotais = custoBaseTotal + custoTaxas + transporte;
  const lucroLiquido = faturamentoBruto - custosTotais;
  const margemLiquida = faturamentoBruto > 0 ? (lucroLiquido / faturamentoBruto) * 100 : 0;
  const horas = Number(horasProducao) || 1;
  const lucroPorHora = horas > 0 ? lucroLiquido / horas : 0;

  const handleLaunchToEntrepreneurship = () => {
    addEntrepreneurLog({
      data: new Date().toISOString().split('T')[0],
      atividade: 'Pudim',
      faturamento: faturamentoBruto,
      combustivel: transporte,
      insumos: (Number(custoIngredientesLote) || 0) * lotes + (Number(custoGasEnergiaLote) || 0) * lotes,
      embalagens: (Number(custoEmbalagensLote) || 0) * lotes,
      taxas: custoTaxas,
      manutencao: 0,
      outrosCustos: 0,
      horasTrabalhadas: horas,
      observacoes: `Produção de ${lotes} lote(s) (${totalVendido} pudins vendidos a R$ ${preco.toFixed(2)})`,
    });

    setMensagem(`✅ Lote de R$ ${lucroLiquido.toFixed(2)} de lucro líquido lançado no Empreendedorismo do Natan!`);
    setTimeout(() => setMensagem(''), 5000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-pink-950/60 via-slate-900 to-amber-950/40 border border-pink-800/40 rounded-3xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-pink-500/20">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">Simulador do Negócio de Pudins (150ml)</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Modelo da Seção 41 e 42: Lote padrão de 30 unidades a R$ 10, com custos reais e margem líquida
              </p>
            </div>
          </div>
          <div className="text-right text-xs hidden sm:block">
            <span className="text-slate-400">Preço Padrão:</span>
            <span className="text-base font-extrabold text-pink-400 block">R$ 10,00 / unidade</span>
          </div>
        </div>
      </div>

      {mensagem && (
        <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-700/60 text-emerald-300 text-sm font-semibold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{mensagem}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Parâmetros do Lote */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-5">
          <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
            <Calculator className="w-4 h-4 text-pink-400" />
            <span>Parâmetros de Produção & Venda</span>
          </h3>

          <div className="grid grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Nº de Lotes</label>
              <input
                type="number"
                min="1"
                max="20"
                value={numeroLotes}
                onChange={(e) => setNumeroLotes(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold text-center"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Pudins por Lote</label>
              <input
                type="number"
                min="1"
                value={unidadesPorLote}
                onChange={(e) => setUnidadesPorLote(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold text-center"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Preço Venda (R$)</label>
              <input
                type="number"
                step="0.50"
                value={precoPorUnidade}
                onChange={(e) => setPrecoPorUnidade(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-pink-400 font-bold text-center"
              />
            </div>
          </div>

          {/* Custo Base do Lote de 30 unidades (R$ 105 total) */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-300">Custo Base do Lote (Padrão R$ 105,00)</span>
              <span className="font-mono font-bold text-rose-400">
                R$ {custoLoteUnit.toFixed(2)} por lote
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-[11px]">
              <div>
                <label className="block text-slate-400 mb-0.5">Ingredientes</label>
                <input
                  type="number"
                  step="1.00"
                  value={custoIngredientesLote}
                  onChange={(e) => setCustoIngredientesLote(e.target.value)}
                  className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-0.5">Embalagens (150ml)</label>
                <input
                  type="number"
                  step="1.00"
                  value={custoEmbalagensLote}
                  onChange={(e) => setCustoEmbalagensLote(e.target.value)}
                  className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-0.5">Gás & Energia</label>
                <input
                  type="number"
                  step="1.00"
                  value={custoGasEnergiaLote}
                  onChange={(e) => setCustoGasEnergiaLote(e.target.value)}
                  className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono"
                />
              </div>
            </div>
          </div>

          {/* Custos Extras (Seção 42) */}
          <div className="space-y-3 text-xs">
            <span className="font-bold text-slate-300">Ajustes Reais (Perdas, Entrega & Taxas)</span>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-400 mb-0.5">Perdas (não vendidas)</label>
                <input
                  type="number"
                  min="0"
                  value={perdasUnidades}
                  onChange={(e) => setPerdasUnidades(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white font-bold"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-0.5">Gasolina Entrega (R$)</label>
                <input
                  type="number"
                  step="1.00"
                  value={custoTransporte}
                  onChange={(e) => setCustoTransporte(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white font-bold"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-0.5">Taxa Pagamento (%)</label>
                <input
                  type="number"
                  step="0.5"
                  value={taxaPagamentoPercent}
                  onChange={(e) => setTaxaPagamentoPercent(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white font-bold"
                />
              </div>
            </div>

            <div className="pt-1">
              <label className="block text-slate-400 mb-0.5">Tempo Total de Preparo & Entrega (Horas)</label>
              <input
                type="number"
                step="0.5"
                value={horasProducao}
                onChange={(e) => setHorasProducao(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white font-bold"
              />
            </div>
          </div>
        </div>

        {/* Painel de Rentabilidade do Pudim */}
        <div className="lg:col-span-5 bg-gradient-to-b from-slate-900 to-pink-950/30 border border-pink-800/40 rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h4 className="font-extrabold text-white text-sm">Resultado do Lote</h4>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-pink-500/20 text-pink-300 font-bold border border-pink-500/40">
                {totalVendido} pudins vendidos
              </span>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Faturamento Bruto:</span>
                <span className="font-bold text-white text-sm">
                  R$ {faturamentoBruto.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between text-rose-400">
                <span>Custos de Produção ({lotes} lote):</span>
                <span>- R$ {custoBaseTotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-rose-400">
                <span>Entrega & Taxas:</span>
                <span>- R$ {(transporte + custoTaxas).toFixed(2)}</span>
              </div>

              {perdas > 0 && (
                <div className="flex justify-between text-amber-400 text-[11px]">
                  <span>Perdas ({perdas} pudins):</span>
                  <span>- R$ {(perdas * preco).toFixed(2)} não faturado</span>
                </div>
              )}

              <div className="border-t border-slate-800 pt-3 flex justify-between items-baseline">
                <span className="font-extrabold text-white text-sm">Lucro Líquido Real:</span>
                <span className="font-mono font-black text-2xl text-emerald-400">
                  R$ {lucroLiquido.toFixed(2)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 text-[11px]">
                <div className="p-2 rounded-xl bg-slate-950/70 border border-slate-800 text-center">
                  <div className="text-slate-400">Margem Líquida</div>
                  <div className="font-bold text-pink-400 text-sm">{margemLiquida.toFixed(1)}%</div>
                </div>
                <div className="p-2 rounded-xl bg-slate-950/70 border border-slate-800 text-center">
                  <div className="text-slate-400">Lucro / Hora</div>
                  <div className="font-bold text-amber-400 text-sm">R$ {lucroPorHora.toFixed(2)}/h</div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-3 border-t border-slate-800">
            <button
              onClick={handleLaunchToEntrepreneurship}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-extrabold text-xs shadow-lg shadow-pink-600/30 transition flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Registrar Venda Deste Lote no App</span>
            </button>

            <div className="text-[10px] text-center text-slate-400">
              Atualiza automaticamente seu lucro líquido e saldo em conta!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
