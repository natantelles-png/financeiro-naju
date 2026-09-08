// Interpretador inteligente em Linguagem Natural para o Financeiro NaJu
// Reconhece fala ou texto em português brasileiro e mapeia para ações estruturadas

export function parseNaturalLanguageInput(input) {
  if (!input || typeof input !== 'string') return null;

  const text = input.toLowerCase().trim();

  // Helper para extrair valores monetários (ex: 85, 85.50, 85,50, 100 reais, R$ 100)
  const extractNumbers = (str) => {
    // Procura padrões como "85", "85,50", "85.50", "1.200"
    const matches = str.match(/(?:r\$\s*)?(\d+(?:[\.,]\d{1,2})?)/g);
    if (!matches) return [];
    return matches.map((m) => {
      const clean = m.replace(/r\$\s*/i, '').replace(/\./g, '').replace(',', '.');
      return parseFloat(clean);
    }).filter((n) => !isNaN(n));
  };

  // Helper para extrair horas (ex: "6 horas", "6h", "5.5h", "2 horas e meia")
  const extractHours = (str) => {
    const match = str.match(/(\d+(?:[\.,]\d+)?)\s*(?:horas?|h\b)/i);
    if (match) {
      return parseFloat(match[1].replace(',', '.'));
    }
    return 0;
  };

  const numbers = extractNumbers(text);
  const hours = extractHours(text);

  // 1. Caso: Empreendedorismo Uber
  // Ex: "Fiz 280 no uber com 60 de gasolina em 6 horas" ou "Uber faturei 250 gastei 50"
  if (text.includes('uber') || text.includes('corrida') || text.includes('passageiro')) {
    let faturamento = 0;
    let combustivel = 0;
    let horasTrabalhadas = hours || 5.0;

    // Se temos 2 números, o maior geralmente é faturamento e o menor é gasolina
    if (numbers.length >= 2) {
      const sorted = [...numbers].sort((a, b) => b - a);
      faturamento = sorted[0];
      combustivel = sorted[1];
    } else if (numbers.length === 1) {
      faturamento = numbers[0];
      combustivel = faturamento * 0.25; // estimativa conservadora padrão de 25% de combustível se não dito
    }

    const custos = combustivel;
    const lucro = faturamento - custos;
    const lucroHora = horasTrabalhadas > 0 ? lucro / horasTrabalhadas : 0;

    return {
      type: 'ENTREPRENEUR_LOG',
      actionTitle: 'Lançar Turno Uber',
      categoria: 'Uber',
      faturamento,
      custos,
      combustivel,
      lucroLiquido: lucro,
      horasTrabalhadas,
      lucroPorHora: lucroHora,
      resumo: `Uber: Faturou R$ ${faturamento.toFixed(2)} com R$ ${combustivel.toFixed(2)} de gasolina em ${horasTrabalhadas}h. Lucro Líquido: R$ ${lucro.toFixed(2)} (R$ ${lucroHora.toFixed(2)}/h)`,
    };
  }

  // 2. Caso: Empreendedorismo Pudim
  // Ex: "Vendi 1 lote de pudim por 300 reais" ou "Vendi 30 pudins a 10 reais" ou "Pudim faturamento 150"
  if (text.includes('pudim') || text.includes('pudins')) {
    let faturamento = 0;
    let lotes = 1;

    // Se falou "1 lote" ou "2 lotes"
    const loteMatch = text.match(/(\d+)\s*lotes?/);
    if (loteMatch) {
      lotes = parseInt(loteMatch[1], 10);
    }

    if (numbers.length > 0) {
      // Se informou valor total tipo 300 ou 150
      if (numbers[0] >= 50) {
        faturamento = numbers[0];
      } else {
        // Ex: "30 pudins a 10 reais" -> 30 x 10 = 300
        if (numbers.length >= 2) {
          faturamento = numbers[0] * numbers[1];
        } else {
          faturamento = numbers[0] * 10;
        }
      }
    } else {
      faturamento = 300 * lotes;
    }

    const custoBase = 105 * lotes;
    const lucro = Math.max(0, faturamento - custoBase);

    return {
      type: 'ENTREPRENEUR_LOG',
      actionTitle: 'Lançar Venda de Pudins',
      categoria: 'Pudim',
      faturamento,
      custos: custoBase,
      insumos: custoBase,
      lucroLiquido: lucro,
      horasTrabalhadas: hours || 3.5,
      resumo: `Pudins: Faturamento R$ ${faturamento.toFixed(2)} com custo estimado de R$ ${custoBase.toFixed(2)}. Lucro Líquido: R$ ${lucro.toFixed(2)}`,
    };
  }

  // 3. Caso: Gasolina / Combustível (Consome teto semanal de R$ 100)
  // Ex: "Botei 50 de gasolina", "Abasteci 80 no posto"
  if (text.includes('gasolina') || text.includes('combustivel') || text.includes('abasteci') || text.includes('posto')) {
    const valor = numbers[0] || 50;
    return {
      type: 'WEEKLY_EXPENSE',
      actionTitle: 'Lançar Gasolina no Débito',
      categoria: 'Gasolina',
      valor,
      formaPagamento: 'DEBITO',
      resumo: `Gasolina: R$ ${valor.toFixed(2)} debitado do caixa (abate do teto semanal de R$ 100)`,
    };
  }

  // 4. Caso: Mercado / Supermercado / Feira / Açougue (Consome teto semanal de R$ 300)
  // Ex: "Gastei 85 no mercado", "Comprei 120 na feira e açougue"
  if (text.includes('mercado') || text.includes('feira') || text.includes('acougue') || text.includes('supermercado') || text.includes('compras')) {
    const valor = numbers[0] || 0;
    return {
      type: 'WEEKLY_EXPENSE',
      actionTitle: 'Lançar Mercado no Débito',
      categoria: 'Mercado',
      valor,
      formaPagamento: 'DEBITO',
      resumo: `Mercado: R$ ${valor.toFixed(2)} debitado do caixa (abate do teto semanal de R$ 300)`,
    };
  }

  // 5. Caso: Compra no Cartão de Crédito
  // Ex: "Comprei tenis de 200 no cartao em 3 vezes" ou "Passei 150 no cartao"
  if (text.includes('cartao') || text.includes('credito') || text.includes('parcelado') || text.includes('vezes')) {
    const valor = numbers[0] || 0;
    const isParcelado = text.includes('vezes') || text.includes('parcelado') || text.includes('parcela');
    return {
      type: 'CREDIT_WARNING',
      actionTitle: isParcelado ? '⚠️ Compra Parcelada no Cartão' : 'Compra no Cartão à Vista',
      categoria: 'Cartão de Crédito',
      valor,
      isParcelado,
      resumo: isParcelado
        ? `ALERTA: Compra de R$ ${valor.toFixed(2)} no cartão parcelado! Regra de Ouro: Congelar novas dívidas.`
        : `Cartão à vista: R$ ${valor.toFixed(2)} adicionado aos compromissos da fatura.`,
    };
  }

  // 6. Caso Geral: Despesa Genérica no Débito
  // Ex: "Paguei 40 de farmacia", "Gastei 25 no lanche"
  if (numbers.length > 0) {
    const valor = numbers[0];
    let cat = 'Outros';
    if (text.includes('farmacia') || text.includes('remedio')) cat = 'Farmácia';
    else if (text.includes('lanche') || text.includes('almoco') || text.includes('jantar') || text.includes('comida')) cat = 'Alimentação Fora';
    else if (text.includes('casa') || text.includes('luz') || text.includes('agua')) cat = 'Casa';

    return {
      type: 'WEEKLY_EXPENSE',
      actionTitle: `Lançar Gasto (${cat})`,
      categoria: cat,
      valor,
      formaPagamento: 'DEBITO',
      resumo: `${cat}: R$ ${valor.toFixed(2)} no débito (reduz o saldo operacional livre).`,
    };
  }

  return {
    type: 'UNKNOWN',
    actionTitle: 'Não identificado com precisão',
    resumo: `Texto ouvido: "${input}". Tente falar: "Gastei 45 no mercado", "Botei 50 de gasolina" ou "Fiz 250 no Uber com 50 de gasolina em 6 horas".`,
  };
}
