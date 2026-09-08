import React from 'react';
import { Shield, Lock, CreditCard, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function TransitionPlan() {
  const steps = [
    {
      fase: 'Fase 1',
      titulo: 'Congelar o Cartão',
      status: 'EM_EXECUCAO',
      cor: 'border-rose-500/50 bg-rose-950/20 text-rose-300',
      badgeCor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      pontos: [
        'Zero novas compras parceladas.',
        'Não utilizar cartão para compras de mercado ou gasolina.',
        'Não aumentar o limite nem fazer novas assinaturas.',
        'Total proibição de parcelamento de fatura e uso do rotativo.',
      ],
    },
    {
      fase: 'Fase 2',
      titulo: 'Pagar o Estoque Antigo',
      status: 'EM_ANDAMENTO',
      cor: 'border-amber-500/50 bg-amber-950/20 text-amber-300',
      badgeCor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      pontos: [
        'Pagar 100% das faturas no vencimento integral.',
        'Acompanhar a redução mês a mês de Outubro a Julho.',
        'Comemorar cada fatura vencida sem gerar nova dívida.',
        'Pico de Out/26 (R$ 4.003) é o maior desafio e deve ser vencido.',
      ],
    },
    {
      fase: 'Fase 3',
      titulo: 'Redirecionar a Sobra',
      status: 'PREVISTO',
      cor: 'border-emerald-500/50 bg-emerald-950/20 text-emerald-300',
      badgeCor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      pontos: [
        'Parcela que acabou NÃO vira novo consumo!',
        'A sobra financeira é direcionada para reforçar o caixa livre.',
        'Alimentar o envelope do Casamento (R$ 10.000).',
        'Construir a base para investimentos futuros.',
      ],
    },
  ];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <h3 className="font-extrabold text-white text-sm">
            Plano Estratégico de Transição (Cartão ➔ Débito)
          </h3>
          <p className="text-xs text-slate-400">
            Regra da Seção 24: Passar a viver no débito e redirecionar a redução das faturas
          </p>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 font-bold border border-slate-700">
          3 Fases Definidas
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        {steps.map((step, idx) => (
          <div key={idx} className={`rounded-2xl p-4 border ${step.cor} flex flex-col justify-between space-y-3`}>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${step.badgeCor}`}>
                  {step.fase}
                </span>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">
                  {step.status === 'EM_EXECUCAO' ? '● Em Execução' : step.status === 'EM_ANDAMENTO' ? '● Em Andamento' : '○ Previsto'}
                </span>
              </div>
              <h4 className="font-extrabold text-white text-sm mb-2">{step.titulo}</h4>
              <ul className="space-y-1.5 text-slate-300">
                {step.pontos.map((ponto, pIdx) => (
                  <li key={pIdx} className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span className="leading-tight">{ponto}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-[10px] text-slate-400 pt-2 border-t border-slate-800/80">
              {idx === 0 && 'Objetivo: Estancar o sangramento de novas parcelas.'}
              {idx === 1 && 'Objetivo: Liquidar o estoque de dívida passada.'}
              {idx === 2 && 'Objetivo: Blindar o futuro financeiro da família.'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
