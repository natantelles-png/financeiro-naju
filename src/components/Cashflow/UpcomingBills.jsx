import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { Calendar, AlertTriangle, CheckCircle2, Edit3, HelpCircle } from 'lucide-react';
import PendingConfirmationModal from '../Modals/PendingConfirmationModal';

export default function UpcomingBills() {
  const { data } = useFinance();
  const fixedExpenses = data.fixedExpenses || [];

  const [itemToEdit, setItemToEdit] = useState(null);

  // Ordenar por dia de vencimento
  const sortedBills = [...fixedExpenses].sort((a, b) => a.diaVencimento - b.diaVencimento);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h3 className="font-extrabold text-white text-sm">
            Calendário de Contas Fixas & Vencimentos Oficiais (Seção 35)
          </h3>
          <p className="text-xs text-slate-400">
            Valores identificados nas anotações do casal com dias críticos
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40">
            Total Confirmado: R$ {sortedBills.filter(b => b.status === 'CONFIRMADO').reduce((a, b) => a + b.valor, 0).toFixed(2)}
          </span>
        </div>
      </div>

      {/* Tabela de Contas Fixas */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 uppercase text-[10px]">
              <th className="py-2.5 px-3">Dia</th>
              <th className="py-2.5 px-3">Descrição / Conta</th>
              <th className="py-2.5 px-3">Categoria</th>
              <th className="py-2.5 px-3">Valor (R$)</th>
              <th className="py-2.5 px-3">Status / Validação</th>
              <th className="py-2.5 px-3 text-right">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {sortedBills.map((bill) => {
              const isPending = bill.status === 'A_CONFIRMAR';
              return (
                <tr
                  key={bill.id}
                  className={`hover:bg-slate-800/30 transition ${
                    isPending ? 'bg-amber-950/20 border-l-2 border-amber-500' : ''
                  }`}
                >
                  <td className="py-3 px-3 font-bold text-white">
                    <span className="px-2 py-0.5 rounded-lg bg-slate-800 text-slate-200 border border-slate-700">
                      Dia {bill.diaVencimento}
                    </span>
                  </td>

                  <td className="py-3 px-3 font-semibold text-white">
                    <div className="flex items-center gap-2">
                      <span>{bill.descricao}</span>
                      {isPending && (
                        <span className="text-[10px] text-amber-300 bg-amber-500/20 px-1.5 py-0.2 rounded font-bold">
                          {bill.codigo || 'A CONFIRMAR'}
                        </span>
                      )}
                    </div>
                    {bill.observacao && (
                      <div className="text-[10px] text-slate-400 font-normal">{bill.observacao}</div>
                    )}
                  </td>

                  <td className="py-3 px-3 text-slate-400">{bill.categoria}</td>

                  <td className="py-3 px-3 font-mono font-bold text-white">
                    R$ {Number(bill.valor).toFixed(2)}
                  </td>

                  <td className="py-3 px-3">
                    {isPending ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold flex items-center gap-1 w-max">
                        <AlertTriangle className="w-3 h-3" />
                        <span>Pendente de Confirmação</span>
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-medium flex items-center gap-1 w-max">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Confirmado</span>
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-3 text-right">
                    {isPending ? (
                      <button
                        onClick={() => setItemToEdit(bill)}
                        className="px-2.5 py-1 rounded-lg bg-amber-600/30 hover:bg-amber-600/50 text-amber-300 border border-amber-500/40 font-bold text-[11px] transition flex items-center gap-1 ml-auto"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Confirmar</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => setItemToEdit(bill)}
                        className="p-1 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition"
                        title="Editar valor ou vencimento"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {itemToEdit && (
        <PendingConfirmationModal
          item={itemToEdit}
          onClose={() => setItemToEdit(null)}
        />
      )}
    </div>
  );
}
