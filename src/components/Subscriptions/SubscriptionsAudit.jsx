import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { ShieldCheck, AlertCircle, CheckCircle, Trash2, Calendar, FileText } from 'lucide-react';

export default function SubscriptionsAudit() {
  const { data, toggleSubscriptionEvaluate } = useFinance();
  const subscriptions = data.subscriptions || [];

  // Cálculo do custo mensal das assinaturas (Amazon R$ 120 anual = R$ 10/mês na média se anual)
  const custoMensalTotal = subscriptions.reduce((acc, sub) => {
    if (sub.periodicidade === 'ANUAL') {
      return acc + (sub.valor / 12);
    }
    return acc + sub.valor;
  }, 0);

  const potencialEconomia = subscriptions
    .filter((sub) => sub.avaliarCancelamento)
    .reduce((acc, sub) => acc + (sub.periodicidade === 'ANUAL' ? sub.valor / 12 : sub.valor), 0);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-white">Assinaturas & Recorrências a Revisar</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Auditoria da Seção 34: Avaliar cancelamentos e proteger itens essenciais (Seguro do Carro)
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Custo Mensal Recorrente:</span>
              <span className="text-sm font-black text-white">R$ {custoMensalTotal.toFixed(2)}/mês</span>
            </div>
            <div className="p-3 rounded-2xl bg-amber-950/50 border border-amber-800/50">
              <span className="text-amber-300 block text-[10px]">Economia em Avaliação:</span>
              <span className="text-sm font-black text-amber-300">R$ {potencialEconomia.toFixed(2)}/mês</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabela de Assinaturas */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 uppercase text-[10px]">
                <th className="py-2.5 px-3">Serviço / Assinatura</th>
                <th className="py-2.5 px-3">Periodicidade</th>
                <th className="py-2.5 px-3">Valor Cobrado</th>
                <th className="py-2.5 px-3">Cobrança</th>
                <th className="py-2.5 px-3">Essencialidade</th>
                <th className="py-2.5 px-3 text-right">Status de Auditoria</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {subscriptions.map((sub) => {
                const isAnual = sub.periodicidade === 'ANUAL';
                const isSeguro = sub.id === 'sub_seguro';
                return (
                  <tr key={sub.id} className="hover:bg-slate-800/30 transition">
                    <td className="py-3 px-3">
                      <div className="font-bold text-white text-sm">{sub.nome}</div>
                      <div className="text-[10px] text-slate-400">{sub.categoria}</div>
                      {sub.nota && (
                        <div className="text-[10px] text-amber-300/90 mt-1 max-w-sm">
                          {sub.nota}
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isAnual ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {sub.periodicidade}
                      </span>
                    </td>

                    <td className="py-3 px-3 font-mono font-bold text-white text-sm">
                      R$ {Number(sub.valor).toFixed(2)}
                      {isAnual && <span className="text-[10px] text-slate-400 font-normal block">(em Março)</span>}
                    </td>

                    <td className="py-3 px-3 text-slate-300">
                      <span>Dia {sub.diaCobranca}</span>
                      <span className="text-[10px] text-slate-500 block">Cartão Natan</span>
                    </td>

                    <td className="py-3 px-3">
                      {isSeguro ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-extrabold flex items-center gap-1 w-max">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Proteção Essencial</span>
                        </span>
                      ) : sub.essencial ? (
                        <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-semibold w-max">
                          Essencial
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px] w-max">
                          Opcional / Lazer
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-3 text-right">
                      {!isSeguro && (
                        <button
                          onClick={() => toggleSubscriptionEvaluate(sub.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                            sub.avaliarCancelamento
                              ? 'bg-amber-600/30 text-amber-300 border border-amber-500/40 hover:bg-amber-600/50'
                              : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
                          }`}
                        >
                          {sub.avaliarCancelamento ? '⚠️ Avaliar Cancelamento' : 'Manter Ativo'}
                        </button>
                      )}
                      {isSeguro && (
                        <span className="text-[11px] text-emerald-400 font-bold">
                          Não cancelar
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-xs text-slate-400 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <span>
            <strong>Atenção da Seção 9 & 34:</strong> A assinatura da Amazon Prime de R$ 120,00 ocorre uma única vez ao ano no mês de Março. O seguro do carro de R$ 200,00 protege o patrimônio e a ferramenta de trabalho (Uber), portanto não deve ser cancelado como corte simples de custos.
          </span>
        </div>
      </div>
    </div>
  );
}
