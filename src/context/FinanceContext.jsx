import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  INITIAL_PEOPLE,
  INITIAL_ACCOUNTS,
  METAS_CURTO_PRAZO,
  INITIAL_CARDS,
  INVOICE_HISTORY,
  INITIAL_SUBSCRIPTIONS,
  INITIAL_FIXED_EXPENSES,
  INITIAL_WEEKLY_BUDGET,
  NATAN_MONTHLY_GOALS,
  INITIAL_ENTREPRENEUR_LOGS,
  PUDDING_BASE_RECIPE,
  WEEKLY_MEETING_QUESTIONS,
} from '../data/initialData';

const FinanceContext = createContext(null);

const STORAGE_KEY = 'FINANCEIRO_NAJU_DATA_V2'; // Atualizado para V2 para carregar o cenário real calibrado

export function FinanceProvider({ children }) {
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Falha ao ler localStorage:', e);
    }
    return {
      people: INITIAL_PEOPLE,
      accounts: INITIAL_ACCOUNTS,
      shortTermGoals: METAS_CURTO_PRAZO,
      cards: INITIAL_CARDS,
      invoices: INVOICE_HISTORY,
      subscriptions: INITIAL_SUBSCRIPTIONS,
      fixedExpenses: INITIAL_FIXED_EXPENSES,
      weeklyBudget: INITIAL_WEEKLY_BUDGET,
      goals: NATAN_MONTHLY_GOALS,
      entrepreneurLogs: INITIAL_ENTREPRENEUR_LOGS,
      puddingRecipe: PUDDING_BASE_RECIPE,
      meetings: [],
      newCreditPurchases: [],
      selectedMonth: 'Set/26',
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Falha ao salvar no localStorage:', e);
    }
  }, [data]);

  const selectedMonth = data.selectedMonth || 'Set/26';

  const setSelectedMonth = (month) => {
    setData((prev) => ({ ...prev, selectedMonth: month }));
  };

  // 1. Contas e Patrimônio
  const contaCorrente = useMemo(() => {
    return data.accounts.find((a) => a.id === 'conta_corrente') || data.accounts[0];
  }, [data.accounts]);

  const reservaCorretora = useMemo(() => {
    return data.accounts.find((a) => a.id === 'reserva_corretora') || { saldoAtual: 5000 };
  }, [data.accounts]);

  const reservaRescisao = useMemo(() => {
    return data.accounts.find((a) => a.id === 'reserva_rescisao') || { saldoAtual: 0, previsaoValor: 10000 };
  }, [data.accounts]);

  const objetivoCasamento = useMemo(() => {
    return data.accounts.find((a) => a.id === 'objetivo_casamento');
  }, [data.accounts]);

  const caixaOperacional = contaCorrente ? contaCorrente.saldoAtual : 985.14;
  const saldoReservaCorretora = reservaCorretora ? reservaCorretora.saldoAtual : 5000.00;
  const rendimentoEstimadoReserva = (saldoReservaCorretora * 0.01); // 1% ao mês = R$ 50/mês
  const reservaProtegida = (saldoReservaCorretora || 0) + (reservaRescisao ? (reservaRescisao.saldoAtual || 0) : 0);
  const reservaIntacta = saldoReservaCorretora >= 5000;
  const saldoCasamento = objetivoCasamento ? objetivoCasamento.saldoAtual : 0;

  const totalDespesasFixasConfirmadas = useMemo(() => {
    return data.fixedExpenses
      .filter((e) => e.status === 'CONFIRMADO')
      .reduce((acc, curr) => acc + (Number(curr.valor) || 0), 0);
  }, [data.fixedExpenses]);

  const totalPendenciasAConfirmar = useMemo(() => {
    return data.fixedExpenses
      .filter((e) => e.status === 'A_CONFIRMAR')
      .reduce((acc, curr) => acc + (Number(curr.valor) || 0), 0);
  }, [data.fixedExpenses]);

  const despesasSemanasEstimadaMes = 400 * 4; // R$ 1.600
  const totalGastosFixosComSemanas = totalDespesasFixasConfirmadas + despesasSemanasEstimadaMes;

  // 2. Empreendedorismo Natan
  const natanLogs = data.entrepreneurLogs || [];

  const natanMetricsMes = useMemo(() => {
    let faturamento = 0;
    let custos = 0;
    let lucroLiquido = 0;
    let horas = 0;

    natanLogs.forEach((log) => {
      faturamento += Number(log.faturamento) || 0;
      custos += Number(log.custosTotais) || 0;
      lucroLiquido += Number(log.lucroLiquido) || 0;
      horas += Number(log.horasTrabalhadas) || 0;
    });

    const lucroPorHora = horas > 0 ? lucroLiquido / horas : 0;
    const margemLiquida = faturamento > 0 ? (lucroLiquido / faturamento) * 100 : 0;

    return {
      faturamento,
      custos,
      lucroLiquido,
      horas,
      lucroPorHora,
      margemLiquida,
    };
  }, [natanLogs]);

  const currentGoal = useMemo(() => {
    return (
      data.goals.find((g) => g.mes === selectedMonth) ||
      data.goals[0]
    );
  }, [data.goals, selectedMonth]);

  const metaNatanValor = currentGoal ? currentGoal.metaLiquida : 1200;
  const progressoMetaPercent =
    metaNatanValor > 0 ? Math.min(Math.round((natanMetricsMes.lucroLiquido / metaNatanValor) * 100), 100) : 0;
  const diferencaMeta = natanMetricsMes.lucroLiquido - metaNatanValor;

  // 3. Renda do Mês de Setembro
  // Júlia R$ 4.200 (dia 5 R$ 2.400, dia 20 R$ 1.800) + Natan R$ 2.400 em 15/09 (último salário)
  const rendaJulia = 4200.00;
  const salarioNatanSetembro = 2400.00; // Recebe dia 15/09
  const rendaTotalMes = rendaJulia + (selectedMonth === 'Set/26' ? salarioNatanSetembro : 0) + natanMetricsMes.lucroLiquido;

  // 4. Despesas Fixas que AINDA VENCERÃO este mês
  // (Desconsiderando as que já foram pagas: Casa 1, Luz, Internet, Meninas)
  const contasQueFaltamVencerSetembro = useMemo(() => {
    return data.fixedExpenses.filter((e) => !e.pagoEmSetembro);
  }, [data.fixedExpenses]);

  const totalContasQueFaltamPagar = useMemo(() => {
    return contasQueFaltamVencerSetembro.reduce((acc, curr) => acc + (Number(curr.valor) || 0), 0);
  }, [contasQueFaltamVencerSetembro]);

  // Contas que já foram pagas este mês (alívio!)
  const totalContasJaPagasSetembro = useMemo(() => {
    return data.fixedExpenses
      .filter((e) => e.pagoEmSetembro)
      .reduce((acc, curr) => acc + (Number(curr.valor) || 0), 0);
  }, [data.fixedExpenses]);

  // 5. Faturas de Cartões
  const currentMonthInvoice = useMemo(() => {
    return data.invoices.find((inv) => inv.mes === selectedMonth) || data.invoices[0];
  }, [data.invoices, selectedMonth]);

  const totalFaturasFuturasComprometidas = useMemo(() => {
    return data.invoices.reduce((acc, curr) => acc + (Number(curr.total) || 0), 0);
  }, [data.invoices]);

  // 6. Compromissos dos Próximos 7 Dias (Hoje é dia 07/08 de Setembro)
  // Como as contas dos dias 9 e 10 (Luz, Financiamento Casa, Internet e Meninas) JÁ FORAM PAGAS,
  // os próximos 7 dias têm compromisso quase zero de fixos até o dia 15 (apenas Academia R$ 140 e Terapia R$ 110 no dia 15)!
  const compromissoProximos7Dias = useMemo(() => {
    const proximasContas = data.fixedExpenses.filter(
      (e) => !e.pagoEmSetembro && e.diaVencimento >= 8 && e.diaVencimento <= 15
    );
    const totalContas = proximasContas.reduce((acc, curr) => acc + curr.valor, 0);
    return totalContas; // ~R$ 250 (Academia R$ 140 + Terapia R$ 110)
  }, [data.fixedExpenses]);

  // 7. Semáforo Financeiro Calibrado para o Cenário Real
  const statusSemaforo = useMemo(() => {
    const temNovaCompraCartao = (data.newCreditPurchases || []).length > 0;
    const reservaViolada = !reservaIntacta;

    if (reservaViolada) {
      return {
        cor: 'VERMELHO',
        label: 'Crítico / Reserva Movimentada',
        motivos: ['A Reserva da Corretora de R$ 5.000 foi alterada!'],
        acaoRecomendada: 'Proteger o patrimônio da corretora a todo custo.',
      };
    }

    if (temNovaCompraCartao) {
      return {
        cor: 'AMARELO',
        label: 'Atenção / Compra em Cartão',
        motivos: ['Houve nova compra em cartão de crédito. Lembrete: congelar parcelas!'],
        acaoRecomendada: 'Priorizar pagamentos estritamente no débito.',
      };
    }

    return {
      cor: 'VERDE',
      label: 'Sinal Verde / Fluxo Equacionado',
      motivos: [
        'Contas críticas do início do mês (Casa, Luz, Internet, Meninas) JÁ FORAM PAGAS! ✓',
        'Saldo em débito atual de R$ 985,14 cobre com folga os próximos 7 dias (~R$ 250).',
        'Fatura da Júlia de 24/09 (R$ 2.358) está equacionada com as entradas de 15/09 e 20/09.',
        'Reserva de R$ 5.000 rendendo ~1% ao mês na corretora.',
      ],
      acaoRecomendada: 'Foco em fechar a venda da lava-louça (R$ 700) até sexta e preparar a transição do Natan!',
    };
  }, [reservaIntacta, data.newCreditPurchases]);

  // 8. Funções de Ação e Atualização
  const updateAccountBalance = (accountId, novoSaldo) => {
    setData((prev) => ({
      ...prev,
      accounts: prev.accounts.map((acc) =>
        acc.id === accountId ? { ...acc, saldoAtual: Number(novoSaldo) } : acc
      ),
    }));
  };

  const confirmarVendaLavaLouca = () => {
    setData((prev) => ({
      ...prev,
      shortTermGoals: prev.shortTermGoals.map((g) =>
        g.id === 'meta_lava_louca' ? { ...g, status: 'CONCLUIDO' } : g
      ),
      accounts: prev.accounts.map((acc) =>
        acc.id === 'conta_corrente'
          ? { ...acc, saldoAtual: acc.saldoAtual + 700.00 }
          : acc
      ),
    }));
  };

  const receberRescisaoReal = (valorExato) => {
    const val = Number(valorExato) || 10000;
    setData((prev) => ({
      ...prev,
      accounts: prev.accounts.map((acc) =>
        acc.id === 'reserva_rescisao'
          ? { ...acc, saldoAtual: val, saldoInicial: val, status: 'RECEBIDO_PROTEGIDO' }
          : acc
      ),
    }));
  };

  const addEntrepreneurLog = (log) => {
    const faturamento = Number(log.faturamento) || 0;
    const combustivel = Number(log.combustivel) || 0;
    const insumos = Number(log.insumos) || 0;
    const embalagens = Number(log.embalagens) || 0;
    const taxas = Number(log.taxas) || 0;
    const manutencao = Number(log.manutencao) || 0;
    const outros = Number(log.outrosCustos) || 0;
    const horas = Number(log.horasTrabalhadas) || 0;

    const custosTotais = combustivel + insumos + embalagens + taxas + manutencao + outros;
    const lucroLiquido = faturamento - custosTotais;
    const lucroPorHora = horas > 0 ? lucroLiquido / horas : 0;
    const margemLiquida = faturamento > 0 ? (lucroLiquido / faturamento) * 100 : 0;

    const newLog = {
      id: 'ent_' + Date.now(),
      data: log.data || new Date().toISOString().split('T')[0],
      atividade: log.atividade || 'Uber',
      faturamento,
      combustivel,
      insumos,
      embalagens,
      taxas,
      manutencao,
      outrosCustos: outros,
      custosTotais,
      lucroLiquido,
      horasTrabalhadas: horas,
      lucroPorHora,
      margemLiquida,
      observacoes: log.observacoes || '',
    };

    setData((prev) => ({
      ...prev,
      entrepreneurLogs: [newLog, ...(prev.entrepreneurLogs || [])],
      accounts: prev.accounts.map((acc) =>
        acc.id === 'conta_corrente'
          ? { ...acc, saldoAtual: acc.saldoAtual + lucroLiquido }
          : acc
      ),
    }));
  };

  const deleteEntrepreneurLog = (id) => {
    const logToDelete = (data.entrepreneurLogs || []).find((l) => l.id === id);
    if (!logToDelete) return;

    setData((prev) => ({
      ...prev,
      entrepreneurLogs: prev.entrepreneurLogs.filter((l) => l.id !== id),
      accounts: prev.accounts.map((acc) =>
        acc.id === 'conta_corrente'
          ? { ...acc, saldoAtual: Math.max(0, acc.saldoAtual - (logToDelete.lucroLiquido || 0)) }
          : acc
      ),
    }));
  };

  const addWeeklyExpense = (item) => {
    const valor = Number(item.valor) || 0;
    const newEntry = {
      id: 'w_' + Date.now(),
      descricao: item.descricao,
      valor,
      categoria: item.categoria,
      data: item.data || new Date().toISOString().split('T')[0],
    };

    setData((prev) => ({
      ...prev,
      weeklyBudget: {
        ...prev.weeklyBudget,
        gastoAtualSemana: (prev.weeklyBudget.gastoAtualSemana || 0) + valor,
        detalhesSemana: [newEntry, ...(prev.weeklyBudget.detalhesSemana || [])],
      },
      accounts: prev.accounts.map((acc) =>
        acc.id === 'conta_corrente'
          ? { ...acc, saldoAtual: acc.saldoAtual - valor }
          : acc
      ),
    }));
  };

  const resetWeeklyExpenses = () => {
    setData((prev) => ({
      ...prev,
      weeklyBudget: {
        ...prev.weeklyBudget,
        gastoAtualSemana: 0,
        detalhesSemana: [],
      },
    }));
  };

  const confirmPendingExpense = (id, nomeConfirmado, valorConfirmado) => {
    setData((prev) => ({
      ...prev,
      fixedExpenses: prev.fixedExpenses.map((item) =>
        item.id === id
          ? {
              ...item,
              descricao: nomeConfirmado || item.descricao,
              valor: Number(valorConfirmado) || item.valor,
              status: 'CONFIRMADO',
            }
          : item
      ),
    }));
  };

  const toggleSubscriptionEvaluate = (id) => {
    setData((prev) => ({
      ...prev,
      subscriptions: prev.subscriptions.map((sub) =>
        sub.id === id ? { ...sub, avaliarCancelamento: !sub.avaliarCancelamento } : sub
      ),
    }));
  };

  const updateGoal = (mes, novaMeta) => {
    setData((prev) => ({
      ...prev,
      goals: prev.goals.map((g) =>
        g.mes === mes
          ? {
              ...g,
              metaLiquida: Number(novaMeta),
              metaSemanal: Math.round(Number(novaMeta) / 4.33),
              metaQuinzenal: Math.round(Number(novaMeta) / 2),
            }
          : g
      ),
    }));
  };

  const recordCreditPurchaseWarning = (compra) => {
    setData((prev) => ({
      ...prev,
      newCreditPurchases: [
        { id: 'cp_' + Date.now(), data: new Date().toISOString(), ...compra },
        ...(prev.newCreditPurchases || []),
      ],
    }));
  };

  const simularGasto = (valorInput, categoria, formaPagamento) => {
    const valor = Number(valorInput) || 0;
    if (valor <= 0) {
      return { nivel: 'INVALIDO', titulo: 'Valor inválido', mensagem: 'Informe um valor maior que zero.', aprovado: false };
    }

    if (formaPagamento === 'CARTAO_PARCELADO') {
      return {
        nivel: 'BLOQUEADO',
        titulo: '🚫 Compra Desaconselhada',
        mensagem: 'ATENÇÃO: o objetivo do plano é reduzir o estoque de parcelas antigas. Fazer uma nova compra parcelada aumenta o prazo de recuperação.',
        aprovado: false,
      };
    }

    if (formaPagamento === 'CARTAO_VISTA') {
      return {
        nivel: 'ALERTA',
        titulo: '⚠️ Aumento de Fatura Futura',
        mensagem: `Criará compromisso de +R$ ${valor.toFixed(2)} na fatura. Dê preferência ao débito para sentir no saldo.`,
        aprovado: true,
      };
    }

    const saldoAposGasto = caixaOperacional - valor;
    if (saldoAposGasto < 0) {
      return {
        nivel: 'BLOQUEADO',
        titulo: '❌ Saldo Insuficiente',
        mensagem: `Você tem R$ ${caixaOperacional.toFixed(2)} em conta. Gastar R$ ${valor.toFixed(2)} deixaria a conta negativa. Nunca use a reserva para despesas diárias!`,
        aprovado: false,
      };
    }

    return {
      nivel: 'SEGURO',
      titulo: '✅ Pode Gastar com Segurança',
      mensagem: `A despesa de R$ ${valor.toFixed(2)} cabe no seu saldo em conta. Saldo restante: R$ ${saldoAposGasto.toFixed(2)}.`,
      aprovado: true,
      saldoRestante: saldoAposGasto,
    };
  };

  const exportDataJson = () => JSON.stringify(data, null, 2);

  const importDataJson = (jsonString) => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed && parsed.accounts) {
        setData(parsed);
        return { success: true };
      }
      return { success: false, error: 'JSON inválido' };
    } catch (e) {
      return { success: false, error: e.message };
    }
  };

  const resetAllData = () => {
    localStorage.removeItem(STORAGE_KEY);
    setData({
      people: INITIAL_PEOPLE,
      accounts: INITIAL_ACCOUNTS,
      shortTermGoals: METAS_CURTO_PRAZO,
      cards: INITIAL_CARDS,
      invoices: INVOICE_HISTORY,
      subscriptions: INITIAL_SUBSCRIPTIONS,
      fixedExpenses: INITIAL_FIXED_EXPENSES,
      weeklyBudget: INITIAL_WEEKLY_BUDGET,
      goals: NATAN_MONTHLY_GOALS,
      entrepreneurLogs: INITIAL_ENTREPRENEUR_LOGS,
      puddingRecipe: PUDDING_BASE_RECIPE,
      meetings: [],
      newCreditPurchases: [],
      selectedMonth: 'Set/26',
    });
  };

  const saveMeeting = (meeting) => {
    setData((prev) => ({
      ...prev,
      meetings: [
        { id: 'meet_' + Date.now(), data: new Date().toISOString(), ...meeting },
        ...(prev.meetings || []),
      ],
    }));
  };

  const value = {
    data,
    selectedMonth,
    setSelectedMonth,
    contaCorrente,
    caixaOperacional,
    saldoReservaCorretora,
    rendimentoEstimadoReserva,
    reservaRescisao,
    reservaProtegida,
    reservaIntacta,
    saldoCasamento,
    rendaJulia,
    salarioNatanSetembro,
    rendaTotalMes,
    natanLogs,
    natanMetricsMes,
    currentGoal,
    metaNatanValor,
    progressoMetaPercent,
    diferencaMeta,
    totalDespesasFixasConfirmadas,
    totalPendenciasAConfirmar,
    despesasSemanasEstimadaMes,
    totalGastosFixosComSemanas,
    contasQueFaltamVencerSetembro,
    totalContasQueFaltamPagar,
    totalContasJaPagasSetembro,
    currentMonthInvoice,
    totalFaturasFuturasComprometidas,
    compromissoProximos7Dias,
    statusSemaforo,
    updateAccountBalance,
    confirmarVendaLavaLouca,
    receberRescisaoReal,
    simularGasto,
    addEntrepreneurLog,
    deleteEntrepreneurLog,
    addWeeklyExpense,
    resetWeeklyExpenses,
    confirmPendingExpense,
    toggleSubscriptionEvaluate,
    updateGoal,
    recordCreditPurchaseWarning,
    saveMeeting,
    exportDataJson,
    importDataJson,
    resetAllData,
  };

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (!context) throw new Error('useFinance deve estar dentro de FinanceProvider');
  return context;
}
