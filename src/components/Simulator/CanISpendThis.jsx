import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import {
  HelpCircle,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  CreditCard,
  Wallet,
  ShieldCheck,
  ArrowRight,
  Info,
  Sparkles,
} from 'lucide-react';

export default function CanISpendThis() {
  const {
    caixaOperacional,
    reservaProtegida,
    reservaIntacta,
    compromissoProximos7Dias,
    simularGasto,
    addWeeklyExpense,
    recordCreditPurchaseWarning,
  } = useFinance();

  const [valor, setValor] = useState('');
  const [descricao, setDescricao] = useState('');
  const [categoria, setCategoria] = useState('Mercado');
  const [formaPagamento, setFormaPagamento] = useState('DEBITO');
  const [parcelas, setParcelas] = useState('2');
  const [simulacaoResultado, setSimulacaoResultado] = useState(null);
  const [mensagemSucesso, setMensagemSucesso] = useState('');

  const handleSimulate = (e) => {
    e?.preventDefault();
    setMensagemSucesso('');
    const result = simularGasto(valor, categoria, formaPagamento);
    setSimulacaoResultado(result);
  };

  const handleConfirmSpend = () => {
    const valorNum = Number(valor);
    if (!valorNum || valorNum <= 0) return;

    if (formaPagamento === 'DEBITO') {
      addWeeklyExpense({
        descricao: descricao || `${categoria} (simulado)`,
        valor: valorNum,
        categoria: categoria,
      });
      setMensagemSucesso(`✅ Gasto de R$ ${valorNum.toFixed(2)} registrado e debitado do Caixa Operacional com sucesso!`);
    } else {
      recordCreditPurchaseWarning({
        descricao: descricao || `${categoria} no cartão`,
        valor: valorNum,
        tipo: formaPagamento,
        parcelas: formaPagamento === 'CARTAO_PARCELADO' ? parcelas : 1,
      });
      setMensagemSucesso(`⚠️ Compra no cartão registrada nos alertas de aumento de faturas futuras.`);
    }

    setValor('');
    setDescricao('');
    setSimulacaoResultado(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header explicativo */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">Simulador Inteligente: "Posso Gastar Isso?"</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Consulte antes de passar o cartão ou débito para blindar o plano e preservar os R$ 10.000
              </p>
            </div>
          </div>
          <div className="hidden sm:flex flex-col items-end text-xs">
            <span className="text-slate-400">Saldo Livre em Débito:</span>
            <span className="text-base font-extrabold text-emerald-400">
              R$ {caixaOperacional.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {mensagemSucesso && (
        <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-700/60 text-emerald-300 text-sm font-semibold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{mensagemSucesso}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Formulário de Consulta */}
        <div className="md:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <span>Dados da Compra Pretendida</span>
          </h3>

          <form onSubmit={handleSimulate} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Qual o valor pretendido? (R$)</label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold">R$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="0,00"
                  value={valor}
                  onChange={(e) => {
                    setValor(e.target.value);
                    setSimulacaoResultado(null);
                  }}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-white font-bold text-base focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Descrição do item / compra</label>
              <input
                type="text"
                placeholder="Ex: Tênis, Mercado extra, Jantar, etc."
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-emerald-500 text-slate-200 text-xs focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Categoria</label>
                <select
                  value={categoria}
                  onChange={(e) => {
                    setCategoria(e.target.value);
                    setSimulacaoResultado(null);
                  }}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-emerald-500 text-slate-200 font-medium text-xs focus:outline-none"
                >
                  <option value="Mercado">Mercado (Teto Semanal)</option>
                  <option value="Gasolina">Gasolina (Teto Semanal)</option>
                  <option value="Alimentação Fora">Alimentação Fora / Delivery</option>
                  <option value="Farmácia">Farmácia & Saúde</option>
                  <option value="Vestuário">Roupas & Acessórios</option>
                  <option value="Lazer">Lazer & Passeios</option>
                  <option value="Casa">Casa & Utilidades</option>
                  <option value="Outros">Outros Supérfluos</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Forma de Pagamento</label>
                <select
                  value={formaPagamento}
                  onChange={(e) => {
                    setFormaPagamento(e.target.value);
                    setSimulacaoResultado(null);
                  }}
                  className={`w-full px-3 py-2.5 rounded-xl border font-bold text-xs focus:outline-none ${
                    formaPagamento === 'CARTAO_PARCELADO'
                      ? 'bg-rose-950/60 border-rose-600 text-rose-300'
                      : formaPagamento === 'CARTAO_VISTA'
                      ? 'bg-amber-950/60 border-amber-600 text-amber-300'
                      : 'bg-emerald-950/60 border-emerald-600 text-emerald-300'
                  }`}
                >
                  <option value="DEBITO">Débito / Pix / Dinheiro</option>
                  <option value="CARTAO_VISTA">Cartão de Crédito à Vista</option>
                  <option value="CARTAO_PARCELADO">Cartão de Crédito Parcelado (⚠️)</option>
                </select>
              </div>
            </div>

            {formaPagamento === 'CARTAO_PARCELADO' && (
              <div className="p-3 bg-rose-950/40 border border-rose-800/60 rounded-xl space-y-2">
                <div className="flex items-center gap-1.5 text-rose-400 font-bold">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Atenção: Parcelamento no Cartão de Crédito</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-slate-300">Em quantas parcelas?</span>
                  <input
                    type="number"
                    min="2"
                    max="18"
                    value={parcelas}
                    onChange={(e) => setParcelas(e.target.value)}
                    className="w-20 px-2 py-1 rounded-lg bg-slate-900 border border-rose-700 text-white font-bold text-center"
                  />
                  <span className="text-slate-400 text-[11px]">
                    = R$ {valor ? (Number(valor) / Number(parcelas || 1)).toFixed(2) : '0,00'} / mês
                  </span>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm shadow-lg shadow-emerald-600/30 transition transform active:scale-98 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Simular Impacto no Orçamento</span>
            </button>
          </form>
        </div>

        {/* Resultado da Simulação */}
        <div className="md:col-span-5 flex flex-col justify-between space-y-4">
          {simulacaoResultado ? (
            <div
              className={`rounded-2xl p-5 border shadow-xl flex flex-col justify-between h-full animate-fadeIn ${
                simulacaoResultado.nivel === 'SEGURO'
                  ? 'bg-emerald-950/40 border-emerald-700/60'
                  : simulacaoResultado.nivel === 'ALERTA'
                  ? 'bg-amber-950/40 border-amber-700/60'
                  : 'bg-rose-950/40 border-rose-700/60'
              }`}
            >
              <div>
                <div className="flex items-center gap-2 mb-2">
                  {simulacaoResultado.nivel === 'SEGURO' && (
                    <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  )}
                  {simulacaoResultado.nivel === 'ALERTA' && (
                    <AlertTriangle className="w-6 h-6 text-amber-400" />
                  )}
                  {simulacaoResultado.nivel === 'BLOQUEADO' && (
                    <XCircle className="w-6 h-6 text-rose-400" />
                  )}
                  <h4 className="font-extrabold text-white text-base">
                    {simulacaoResultado.titulo}
                  </h4>
                </div>

                <p className="text-slate-200 text-xs leading-relaxed mt-2 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  {simulacaoResultado.mensagem}
                </p>

                {/* Métricas de Impacto */}
                <div className="mt-4 space-y-2 text-xs border-t border-slate-800/80 pt-3">
                  <div className="flex justify-between text-slate-300">
                    <span>Saldo atual em débito:</span>
                    <span className="font-bold">R$ {caixaOperacional.toFixed(2)}</span>
                  </div>

                  {formaPagamento === 'DEBITO' && (
                    <div className="flex justify-between text-slate-300">
                      <span>Saldo após este gasto:</span>
                      <span
                        className={`font-bold ${
                          caixaOperacional - Number(valor) < 400 ? 'text-amber-400' : 'text-emerald-400'
                        }`}
                      >
                        R$ {(caixaOperacional - Number(valor)).toFixed(2)}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between text-slate-400 text-[11px]">
                    <span>Reserva R$ 10.000:</span>
                    <span className="text-amber-300 font-bold">100% Blindada</span>
                  </div>
                </div>
              </div>

              {/* Botão de Efetivação */}
              <div className="mt-5 pt-3 border-t border-slate-800/80">
                {simulacaoResultado.nivel !== 'BLOQUEADO' ? (
                  <button
                    onClick={handleConfirmSpend}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition flex items-center justify-center gap-1.5"
                  >
                    <span>Vou realizar esta compra (Registrar)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full py-2.5 px-4 rounded-xl bg-rose-950/60 text-rose-400 font-bold text-xs border border-rose-800/60 cursor-not-allowed opacity-75"
                  >
                    Compra Bloqueada pelas Regras do Plano
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="rounded-2xl p-6 bg-slate-900/60 border border-slate-800/80 flex flex-col items-center justify-center text-center h-full text-xs text-slate-400 space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
                <Info className="w-6 h-6" />
              </div>
              <p className="font-semibold text-slate-300">Nenhuma simulação no momento</p>
              <p className="max-w-xs text-slate-400">
                Preencha o valor e a forma de pagamento ao lado para verificar se a despesa respeita as metas de caixa e a regra de congelamento de crédito.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
