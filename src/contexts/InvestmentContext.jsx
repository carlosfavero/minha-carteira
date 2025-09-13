import { createContext, useContext, useReducer, useEffect } from 'react';

// Dados iniciais de exemplo
const initialData = {
  ativos: [
    {
      codigo: "BTLG11",
      tipo: "FII",
      quantidade: 47,
      precoMedio: 99.01,
      valorInvestido: 4653.45,
      cotacaoAtual: 98.00,
      valorAtual: 4606.00,
      rentabilidade: -1.02,
      dividendYield: 9.53,
      percentualCarteira: 3.90,
      percentualIdeal: 2.99,
      comprar: false,
      proventos: [
        {
          data: "2025-07-15",
          valor: 45.50,
          tipo: "RENDIMENTO"
        }
      ],
      operacoes: [
        {
          data: "2025-08-19",
          tipo: "COMPRA",
          quantidade: 4,
          preco: 97.93,
          valor: 391.72,
          corretagem: 5.00
        }
      ]
    },
    {
      codigo: "VALE3",
      tipo: "ACAO",
      quantidade: 100,
      precoMedio: 68.50,
      valorInvestido: 6850.00,
      cotacaoAtual: 72.30,
      valorAtual: 7230.00,
      rentabilidade: 5.55,
      dividendYield: 12.8,
      percentualCarteira: 6.05,
      percentualIdeal: 5.00,
      comprar: false,
      proventos: [
        {
          data: "2025-08-30",
          valor: 150.00,
          tipo: "DIVIDENDO"
        }
      ],
      operacoes: [
        {
          data: "2025-07-10",
          tipo: "COMPRA",
          quantidade: 100,
          preco: 68.50,
          valor: 6850.00,
          corretagem: 15.00
        }
      ]
    }
  ],
  aportes: [
    {
      id: 1,
      data: "2025-08-15",
      tipo: "APORTE",
      origem: "CARLOS",
      valor: 5000.00
    },
    {
      id: 2,
      data: "2025-08-25",
      tipo: "APORTE",
      origem: "GABRIELA",
      valor: 3000.00
    }
  ],
  configuracoes: {
    percentualIdealPorAtivo: 2.99,
    metaRentabilidade: 10.0,
    valorTotalInvestido: 11503.45,
    valorAtualCarteira: 11836.00,
    rentabilidadeTotal: 2.89,
    totalProventos: 195.50,
    yieldMedioCarteira: 11.17
  }
};

// Ações do reducer
const actionTypes = {
  ADD_ATIVO: 'ADD_ATIVO',
  UPDATE_ATIVO: 'UPDATE_ATIVO',
  REMOVE_ATIVO: 'REMOVE_ATIVO',
  ADD_OPERACAO: 'ADD_OPERACAO',
  UPDATE_OPERACAO: 'UPDATE_OPERACAO',
  REMOVE_OPERACAO: 'REMOVE_OPERACAO',
  ADD_PROVENTO: 'ADD_PROVENTO',
  UPDATE_PROVENTO: 'UPDATE_PROVENTO',
  REMOVE_PROVENTO: 'REMOVE_PROVENTO',
  ADD_APORTE: 'ADD_APORTE',
  UPDATE_APORTE: 'UPDATE_APORTE',
  REMOVE_APORTE: 'REMOVE_APORTE',
  UPDATE_CONFIGURACOES: 'UPDATE_CONFIGURACOES',
  LOAD_DATA: 'LOAD_DATA',
  SAVE_DATA: 'SAVE_DATA'
};

// Funções utilitárias
const calcularPrecoMedio = (operacoes) => {
  const compras = operacoes.filter(op => op.tipo === 'COMPRA');
  const totalValor = compras.reduce((sum, op) => sum + op.valor, 0);
  const totalQuantidade = compras.reduce((sum, op) => sum + op.quantidade, 0);
  return totalQuantidade > 0 ? totalValor / totalQuantidade : 0;
};

const calcularQuantidadeTotal = (operacoes) => {
  return operacoes.reduce((total, op) => {
    return op.tipo === 'COMPRA' ? total + op.quantidade : total - op.quantidade;
  }, 0);
};

const calcularValorInvestido = (operacoes) => {
  const compras = operacoes.filter(op => op.tipo === 'COMPRA');
  return compras.reduce((sum, op) => sum + op.valor + (op.corretagem || 0), 0);
};

const calcularDividendYield = (proventos, valorInvestido) => {
  const proventosUltimos12Meses = proventos.reduce((sum, prov) => sum + prov.valor, 0);
  return valorInvestido > 0 ? (proventosUltimos12Meses / valorInvestido) * 100 : 0;
};

// Reducer
const investmentReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.ADD_ATIVO:
      return {
        ...state,
        ativos: [...state.ativos, action.payload]
      };

    case actionTypes.UPDATE_ATIVO:
      return {
        ...state,
        ativos: state.ativos.map(ativo =>
          ativo.codigo === action.payload.codigo ? action.payload : ativo
        )
      };

    case actionTypes.REMOVE_ATIVO:
      return {
        ...state,
        ativos: state.ativos.filter(ativo => ativo.codigo !== action.payload)
      };

    case actionTypes.ADD_OPERACAO: {
      const { codigo, operacao } = action.payload;
      const novosAtivos = state.ativos.map(ativo => {
        if (ativo.codigo === codigo) {
          const novasOperacoes = [...ativo.operacoes, operacao];
          const novaQuantidade = calcularQuantidadeTotal(novasOperacoes);
          const novoPrecoMedio = calcularPrecoMedio(novasOperacoes);
          const novoValorInvestido = calcularValorInvestido(novasOperacoes);
          const novoValorAtual = novaQuantidade * ativo.cotacaoAtual;
          const novaRentabilidade = novoValorInvestido > 0 ? 
            ((novoValorAtual - novoValorInvestido) / novoValorInvestido) * 100 : 0;

          return {
            ...ativo,
            operacoes: novasOperacoes,
            quantidade: novaQuantidade,
            precoMedio: novoPrecoMedio,
            valorInvestido: novoValorInvestido,
            valorAtual: novoValorAtual,
            rentabilidade: novaRentabilidade
          };
        }
        return ativo;
      });

      return { ...state, ativos: novosAtivos };
    }

    case actionTypes.UPDATE_OPERACAO: {
      const { codigo, index, operacao } = action.payload;
      const novosAtivos = state.ativos.map(ativo => {
        if (ativo.codigo === codigo) {
          const novasOperacoes = [...ativo.operacoes];
          novasOperacoes[index] = operacao;
          
          const novaQuantidade = calcularQuantidadeTotal(novasOperacoes);
          const novoPrecoMedio = calcularPrecoMedio(novasOperacoes);
          const novoValorInvestido = calcularValorInvestido(novasOperacoes);
          const novoValorAtual = novaQuantidade * ativo.cotacaoAtual;
          const novaRentabilidade = novoValorInvestido > 0 ? 
            ((novoValorAtual - novoValorInvestido) / novoValorInvestido) * 100 : 0;

          return {
            ...ativo,
            operacoes: novasOperacoes,
            quantidade: novaQuantidade,
            precoMedio: novoPrecoMedio,
            valorInvestido: novoValorInvestido,
            valorAtual: novoValorAtual,
            rentabilidade: novaRentabilidade
          };
        }
        return ativo;
      });

      return { ...state, ativos: novosAtivos };
    }

    case actionTypes.REMOVE_OPERACAO: {
      const { codigo, index } = action.payload;
      const novosAtivos = state.ativos.map(ativo => {
        if (ativo.codigo === codigo) {
          const novasOperacoes = ativo.operacoes.filter((_, i) => i !== index);
          
          // Se não sobrar nenhuma operação, remove o ativo inteiro
          if (novasOperacoes.length === 0) {
            return null;
          }
          
          const novaQuantidade = calcularQuantidadeTotal(novasOperacoes);
          const novoPrecoMedio = calcularPrecoMedio(novasOperacoes);
          const novoValorInvestido = calcularValorInvestido(novasOperacoes);
          const novoValorAtual = novaQuantidade * ativo.cotacaoAtual;
          const novaRentabilidade = novoValorInvestido > 0 ? 
            ((novoValorAtual - novoValorInvestido) / novoValorInvestido) * 100 : 0;

          return {
            ...ativo,
            operacoes: novasOperacoes,
            quantidade: novaQuantidade,
            precoMedio: novoPrecoMedio,
            valorInvestido: novoValorInvestido,
            valorAtual: novoValorAtual,
            rentabilidade: novaRentabilidade
          };
        }
        return ativo;
      });

      // Filtra qualquer ativo que tenha retornado null (sem operações)
      const ativosRestantes = novosAtivos.filter(ativo => ativo !== null);
      
      return { ...state, ativos: ativosRestantes };
    }

    case actionTypes.ADD_PROVENTO: {
      const { codigo, provento } = action.payload;
      const novosAtivos = state.ativos.map(ativo => {
        if (ativo.codigo === codigo) {
          const novosProventos = [...ativo.proventos, provento];
          const novoDividendYield = calcularDividendYield(novosProventos, ativo.valorInvestido);

          return {
            ...ativo,
            proventos: novosProventos,
            dividendYield: novoDividendYield
          };
        }
        return ativo;
      });

      return { ...state, ativos: novosAtivos };
    }

    case actionTypes.UPDATE_PROVENTO: {
      const { codigo, index, provento } = action.payload;
      const novosAtivos = state.ativos.map(ativo => {
        if (ativo.codigo === codigo) {
          const novosProventos = [...ativo.proventos];
          novosProventos[index] = provento;
          const novoDividendYield = calcularDividendYield(novosProventos, ativo.valorInvestido);

          return {
            ...ativo,
            proventos: novosProventos,
            dividendYield: novoDividendYield
          };
        }
        return ativo;
      });

      return { ...state, ativos: novosAtivos };
    }

    case actionTypes.REMOVE_PROVENTO: {
      const { codigo, index } = action.payload;
      const novosAtivos = state.ativos.map(ativo => {
        if (ativo.codigo === codigo) {
          const novosProventos = ativo.proventos.filter((_, i) => i !== index);
          const novoDividendYield = calcularDividendYield(novosProventos, ativo.valorInvestido);

          return {
            ...ativo,
            proventos: novosProventos,
            dividendYield: novoDividendYield
          };
        }
        return ativo;
      });

      return { ...state, ativos: novosAtivos };
    }

    case actionTypes.ADD_APORTE: {
      const novoAporte = {
        ...action.payload,
        id: Date.now()  // Gera um ID único com base no timestamp
      };
      return {
        ...state,
        aportes: [...state.aportes, novoAporte]
      };
    }

    case actionTypes.UPDATE_APORTE: {
      const aporteAtualizado = action.payload;
      return {
        ...state,
        aportes: state.aportes.map(aporte => 
          aporte.id === aporteAtualizado.id ? aporteAtualizado : aporte
        )
      };
    }

    case actionTypes.REMOVE_APORTE: {
      const idParaRemover = action.payload;
      return {
        ...state,
        aportes: state.aportes.filter(aporte => aporte.id !== idParaRemover)
      };
    }

    case actionTypes.UPDATE_CONFIGURACOES:
      return {
        ...state,
        configuracoes: { ...state.configuracoes, ...action.payload }
      };

    case actionTypes.LOAD_DATA:
      return action.payload;

    default:
      return state;
  }
};

// Context
const InvestmentContext = createContext();

// Provider
export const InvestmentProvider = ({ children }) => {
  const [state, dispatch] = useReducer(investmentReducer, initialData);

  // Carregar dados do localStorage ao inicializar
  useEffect(() => {
    const savedData = localStorage.getItem('investment-data');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        dispatch({ type: actionTypes.LOAD_DATA, payload: parsedData });
      } catch (error) {
        console.error('Erro ao carregar dados salvos:', error);
      }
    }
  }, []);

  // Salvar dados no localStorage sempre que o estado mudar
  useEffect(() => {
    localStorage.setItem('investment-data', JSON.stringify(state));
  }, [state]);

  // Ações
  const addAtivo = (ativo) => {
    dispatch({ type: actionTypes.ADD_ATIVO, payload: ativo });
  };

  const updateAtivo = (ativo) => {
    dispatch({ type: actionTypes.UPDATE_ATIVO, payload: ativo });
  };

  const removeAtivo = (codigo) => {
    dispatch({ type: actionTypes.REMOVE_ATIVO, payload: codigo });
  };

  const addOperacao = (codigo, operacao) => {
    dispatch({ type: actionTypes.ADD_OPERACAO, payload: { codigo, operacao } });
  };

  const updateOperacao = (codigo, index, operacao) => {
    dispatch({ type: actionTypes.UPDATE_OPERACAO, payload: { codigo, index, operacao } });
  };

  const removeOperacao = (codigo, index) => {
    dispatch({ type: actionTypes.REMOVE_OPERACAO, payload: { codigo, index } });
  };

  const addProvento = (codigo, provento) => {
    dispatch({ type: actionTypes.ADD_PROVENTO, payload: { codigo, provento } });
  };

  const updateProvento = (codigo, index, provento) => {
    dispatch({ type: actionTypes.UPDATE_PROVENTO, payload: { codigo, index, provento } });
  };

  const removeProvento = (codigo, index) => {
    dispatch({ type: actionTypes.REMOVE_PROVENTO, payload: { codigo, index } });
  };

  const updateConfiguracoes = (configuracoes) => {
    dispatch({ type: actionTypes.UPDATE_CONFIGURACOES, payload: configuracoes });
  };

  // Funções para gerenciamento de aportes
  const addAporte = (aporte) => {
    dispatch({ type: actionTypes.ADD_APORTE, payload: aporte });
  };

  const updateAporte = (aporte) => {
    dispatch({ type: actionTypes.UPDATE_APORTE, payload: aporte });
  };

  const removeAporte = (id) => {
    dispatch({ type: actionTypes.REMOVE_APORTE, payload: id });
  };

  // Cálculos derivados
  const getResumoCarteira = () => {
    const valorTotalInvestido = state.ativos.reduce((sum, ativo) => sum + ativo.valorInvestido, 0);
    const valorAtualCarteira = state.ativos.reduce((sum, ativo) => sum + ativo.valorAtual, 0);
    const rentabilidadeTotal = valorTotalInvestido > 0 ? 
      ((valorAtualCarteira - valorTotalInvestido) / valorTotalInvestido) * 100 : 0;
    const totalProventos = state.ativos.reduce((sum, ativo) => 
      sum + ativo.proventos.reduce((pSum, prov) => pSum + prov.valor, 0), 0);
    const yieldMedioCarteira = valorTotalInvestido > 0 ? 
      (totalProventos / valorTotalInvestido) * 100 : 0;

    return {
      valorTotalInvestido,
      valorAtualCarteira,
      rentabilidadeTotal,
      totalProventos,
      yieldMedioCarteira
    };
  };

  const getDistribuicaoTipos = () => {
    const resumo = getResumoCarteira();
    const acoes = state.ativos.filter(ativo => ativo.tipo === 'ACAO')
      .reduce((sum, ativo) => sum + ativo.valorAtual, 0);
    const fiis = state.ativos.filter(ativo => ativo.tipo === 'FII')
      .reduce((sum, ativo) => sum + ativo.valorAtual, 0);

    return {
      acoes: resumo.valorAtualCarteira > 0 ? (acoes / resumo.valorAtualCarteira) * 100 : 0,
      fiis: resumo.valorAtualCarteira > 0 ? (fiis / resumo.valorAtualCarteira) * 100 : 0
    };
  };

  const value = {
    state,
    actions: {
      addAtivo,
      updateAtivo,
      removeAtivo,
      addOperacao,
      updateOperacao,
      removeOperacao,
      addProvento,
      updateProvento,
      removeProvento,
      addAporte,
      updateAporte,
      removeAporte,
      updateConfiguracoes
    },
    computed: {
      getResumoCarteira,
      getDistribuicaoTipos
    }
  };

  return (
    <InvestmentContext.Provider value={value}>
      {children}
    </InvestmentContext.Provider>
  );
};

// Hook personalizado
export const useInvestment = () => {
  const context = useContext(InvestmentContext);
  if (!context) {
    throw new Error('useInvestment deve ser usado dentro de InvestmentProvider');
  }
  
  // Extraindo valores para facilitar o uso
  const { state, actions, computed } = context;
  
  return {
    ativos: state.ativos,
    aportes: state.aportes,
    configuracoes: state.configuracoes,
    addAtivo: actions.addAtivo,
    updateAtivo: actions.updateAtivo,
    removeAtivo: actions.removeAtivo,
    addOperacao: actions.addOperacao,
    updateOperacao: actions.updateOperacao,
    removeOperacao: actions.removeOperacao,
    addProvento: actions.addProvento,
    updateProvento: actions.updateProvento,
    removeProvento: actions.removeProvento,
    addAporte: actions.addAporte,
    updateAporte: actions.updateAporte,
    removeAporte: actions.removeAporte,
    updateConfiguracoes: actions.updateConfiguracoes,
    getResumoCarteira: computed.getResumoCarteira,
    getDistribuicaoTipos: computed.getDistribuicaoTipos
  };
};