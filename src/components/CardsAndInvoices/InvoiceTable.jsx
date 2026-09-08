import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { CreditCard, AlertTriangle, CheckCircle, Calendar } from 'lucide-react';

export default function InvoiceTable() {
  const { data } = useFinance();
  const invoices = data.invoices || [];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-950/60 text-purple-400 border border-purple-800/40">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-white text-sm">
              Consolidação Oficial das Faturas (Seção 13)
            </h3>
            <p className="text-xs text-slate-400">
              Acompanhamento mensal com tratamento correto de pendências e valores não informados
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-pink-500" />
            <span className="text-slate-300">Júlia (Dia 24)</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
            <span className="text-slate-300">Natan (Dia 11)</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="text-slate-300">Renner (Dia 8)</span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300 border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 uppercase tracking-wider text-[10px]">
              <th className="py-2.5 px-3">Competência</th>
              <th className="py-2.5 px-3">Júlia (Dia 24)</th>
              <th className="py-2.5 px-3">Natan (Dia 11)</th>
              <th className="py-2.5 px-3">Renner (Dia 8)</th>
              <th className="py-2.5 px-3 font-extrabold text-white">Total Consolidado</th>
              <th className="py-2.5 px-3">Diagnóstico / Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {invoices.map((inv) => {
              const isPico = inv.pico;
              return (
                <tr
                  key={inv.mes}
                  className={`hover:bg-slate-800/40 transition-colors ${
                    isPico ? 'bg-rose-950/20 font-semibold' : ''
                  }`}
                >
                  <td className="py-3 px-3 font-bold text-white flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>{inv.mes}</span>
                    {isPico && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] bg-rose-500/20 text-rose-300 border border-rose-500/40 uppercase font-extrabold">
                        Pico
                      </span>
                    )}
                  </td>

                  {/* Cartão Júlia */}
                  <td className="py-3 px-3 text-pink-300 font-mono font-medium">
                    {inv.cartaoJulia !== null ? (
                      `R$ ${inv.cartaoJulia.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                    ) : (
                      <span className="text-slate-500 italic text-[10px]">NÃO INFORMADO</span>
                    )}
                  </td>

                  {/* Cartão Natan */}
                  <td className="py-3 px-3 text-indigo-300 font-mono font-medium">
                    {inv.cartaoNatan !== null ? (
                      inv.cartaoNatan === 0 && inv.mes === 'Set/26' ? (
                        <span className="text-slate-400">R$ 0,00</span>
                      ) : (
                        `R$ ${inv.cartaoNatan.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                      )
                    ) : (
                      <span className="px-1.5 py-0.5 rounded text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                        NÃO INFORMADO
                      </span>
                    )}
                  </td>

                  {/* Cartão Renner */}
                  <td className="py-3 px-3 text-amber-300 font-mono font-medium">
                    {inv.cartaoRenner !== null ? (
                      inv.cartaoRenner === 0 ? (
                        <span className="text-slate-400">R$ 0,00</span>
                      ) : (
                        `R$ ${inv.cartaoRenner.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                      )
                    ) : (
                      <span className="px-1.5 py-0.5 rounded text-[9px] bg-slate-800 text-slate-400 font-medium">
                        Não informado (encerra?)
                      </span>
                    )}
                  </td>

                  {/* Total */}
                  <td className="py-3 px-3 font-mono font-extrabold text-white text-sm">
                    {inv.natanNaoInformado ? (
                      <span className="text-amber-300">
                        R$ {inv.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} + Natan
                      </span>
                    ) : (
                      `R$ ${inv.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                    )}
                  </td>

                  {/* Diagnóstico */}
                  <td className="py-3 px-3 text-slate-400 text-[11px]">
                    {inv.observacao}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-1">
        <p className="font-semibold text-slate-300">
          ⚠️ Princípio de Implementação (Apêndice B):
        </p>
        <p>
          "Não transformar ausência de informação em zero. Em Agosto/27, o valor do Cartão Natan não foi informado; portanto, o total não é zero e requer confirmação quando disponível."
        </p>
      </div>
    </div>
  );
}
