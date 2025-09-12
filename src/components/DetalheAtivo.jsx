import { useState, useMemo, useEffect, useRef } from 'react';
import { useInvestment } from '../contexts/InvestmentContext';
import { X, TrendingUp, TrendingDown, DollarSign, Plus, Calendar, Edit, Trash2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const DetalheAtivo = ({ isOpen, onClose, ativo: ativoProp }) => {
  const { actions, state } = useInvestment();
  const [ativoLocal, setAtivoLocal] = useState(ativoProp);
  const [activeTab, setActiveTab] = useState('resumo');
  const [lastUpdate, setLastUpdate] = useState(Date.now()); // Estado para controlar atualizações
  const [formOperacao, setFormOperacao] = useState({
    tipo: 'COMPRA',
    quantidade: '',
    preco: '',
    corretagem: '',
    data: format(new Date(), 'yyyy-MM-dd')
  });
  const [showAddOperacao, setShowAddOperacao] = useState(false);
  const [editingOperacaoIndex, setEditingOperacaoIndex] = useState(null);
  const [formCotacao, setFormCotacao] = useState({
    valor: ativoProp ? ativoProp.cotacaoAtual.toString() : ''
  });
  // Estados para gerenciar proventos
  const [showAddProvento, setShowAddProvento] = useState(false);
  const [editingProventoIndex, setEditingProventoIndex] = useState(null);
  const [formProvento, setFormProvento] = useState({
    tipo: 'RENDIMENTO',
    valor: '',
    data: format(new Date(), 'yyyy-MM-dd')
  });
  const isMounted = useRef(true); // Referência para verificar se o componente está montado

  // Limpar a referência quando o componente for desmontado
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Atualizar o ativo local quando o ativo prop mudar
  useEffect(() => {
    setAtivoLocal(ativoProp);
    // Ao abrir o modal, garantir que a aba ativa seja 'resumo'
    setActiveTab('resumo');
  }, [ativoProp]);

  // Atualizar o ativo local quando mudar de aba ou quando o estado global for atualizado
  useEffect(() => {
    if (ativoLocal && state.ativos) {
      // Buscar dados atualizados do ativo
      const ativoAtualizado = state.ativos.find(a => a.codigo === ativoLocal.codigo);
      if (ativoAtualizado && JSON.stringify(ativoAtualizado) !== JSON.stringify(ativoLocal)) {
        setAtivoLocal(ativoAtualizado);
      }
    }
  }, [activeTab, state.ativos, ativoLocal?.codigo]);

  // Função para lidar com o fechamento do modal
  const handleClose = () => {
    // Resetar o formulário de operação
    resetOperacaoForm();
    // Resetar o formulário de provento
    resetProventoForm();
    // Ocultar o formulário de adição de operação
    setShowAddOperacao(false);
    // Ocultar o formulário de adição de provento
    setShowAddProvento(false);
    // Limpar o índice de operação em edição
    setEditingOperacaoIndex(null);
    // Limpar o índice de provento em edição
    setEditingProventoIndex(null);
    // Resetar para a aba resumo
    setActiveTab('resumo');
    // Chamar a função de fechamento original
    onClose();
  };

  // Atualizar o formulário de cotação quando o ativo mudar
  useEffect(() => {
    if (ativoLocal) {
      setFormCotacao({
        valor: ativoLocal.cotacaoAtual.toString()
      });
    }
  }, [ativoLocal]);

  // Agrupar operações por data
  const operacoesAgrupadas = useMemo(() => {
    if (!ativoLocal || !ativoLocal.operacoes) return [];

    // Fazer uma cópia profunda para evitar problemas de referência
    const operacoesClone = JSON.parse(JSON.stringify(ativoLocal.operacoes));

    // Ordenar operações por data (mais recentes primeiro)
    const operacoesOrdenadas = operacoesClone.map((op, index) => ({
      ...op,
      originalIndex: index // Armazenar o índice original
    })).sort((a, b) => {
      // Criar datas no formato YYYY-MM-DD para evitar problemas de fuso horário
      const dataA = a.data.split('T')[0];
      const dataB = b.data.split('T')[0];
      return new Date(dataB) - new Date(dataA);
    });

    // Agrupar por data
    const grupos = {};
    operacoesOrdenadas.forEach((op) => {
      // Normalizar a data para evitar problemas de fuso horário
      // Extrair apenas a parte da data (YYYY-MM-DD) e então formatar
      const dataPura = op.data.split('T')[0];
      const [ano, mes, dia] = dataPura.split('-');
      const dataFormatada = `${dia}/${mes}/${ano}`;
      
      if (!grupos[dataFormatada]) {
        grupos[dataFormatada] = [];
      }
      grupos[dataFormatada].push(op);
    });

    // Converter para array
    return Object.keys(grupos).map(data => ({
      data,
      operacoes: grupos[data]
    }));
  }, [ativoLocal, JSON.stringify(ativoLocal?.operacoes), lastUpdate]);

  // Agrupar proventos por data
  const proventosAgrupados = useMemo(() => {
    if (!ativoLocal || !ativoLocal.proventos) return [];

    // Fazer uma cópia profunda para evitar problemas de referência
    const proventosClone = JSON.parse(JSON.stringify(ativoLocal.proventos));

    // Ordenar proventos por data (mais recentes primeiro)
    const proventosOrdenados = proventosClone.map((prov, index) => ({
      ...prov,
      originalIndex: index // Armazenar o índice original
    })).sort((a, b) => {
      // Criar datas no formato YYYY-MM-DD para evitar problemas de fuso horário
      const dataA = a.data.split('T')[0];
      const dataB = b.data.split('T')[0];
      return new Date(dataB) - new Date(dataA);
    });

    // Agrupar por data
    const grupos = {};
    proventosOrdenados.forEach((prov) => {
      // Normalizar a data para evitar problemas de fuso horário
      // Extrair apenas a parte da data (YYYY-MM-DD) e então formatar
      const dataPura = prov.data.split('T')[0];
      const [ano, mes, dia] = dataPura.split('-');
      const dataFormatada = `${dia}/${mes}/${ano}`;
      
      if (!grupos[dataFormatada]) {
        grupos[dataFormatada] = [];
      }
      grupos[dataFormatada].push(prov);
    });

    // Converter para array
    return Object.keys(grupos).map(data => ({
      data,
      proventos: grupos[data]
    }));
  }, [ativoLocal, JSON.stringify(ativoLocal?.proventos), lastUpdate]);

  // Formatadores
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatPercentage = (value) => {
    return `${value.toFixed(2)}%`;
  };

  const formatDate = (dateString) => {
    try {
      // Se for uma data no formato ISO (yyyy-MM-dd)
      if (dateString.includes('-')) {
        // Extrair a parte da data ignorando o T e o timestamp se existir
        const dataPura = dateString.split('T')[0];
        const [ano, mes, dia] = dataPura.split('-');
        return `${dia.padStart(2, '0')}/${mes.padStart(2, '0')}/${ano}`;
      }
      
      // Se já estiver no formato dd/MM/yyyy
      if (dateString.includes('/') && dateString.split('/').length === 3) {
        const parts = dateString.split('/');
        if (parts[0].length <= 2 && parts[1].length <= 2 && parts[2].length === 4) {
          return dateString;
        }
      }
      
      // Para outros formatos, usar o date-fns
      // Criar uma data sem considerar o fuso horário
      const dateObj = new Date(dateString);
      return `${String(dateObj.getDate()).padStart(2, '0')}/${String(dateObj.getMonth() + 1).padStart(2, '0')}/${dateObj.getFullYear()}`;
    } catch (e) {
      console.error("Erro ao formatar data:", e);
      // Fallback para o método original
      return new Date(dateString).toLocaleDateString('pt-BR');
    }
  };

  // Handlers
  const handleOperacaoChange = (e) => {
    setFormOperacao({
      ...formOperacao,
      [e.target.name]: e.target.value
    });
  };

  const handleCotacaoChange = (e) => {
    setFormCotacao({
      ...formCotacao,
      [e.target.name]: e.target.value
    });
  };

  const handleAddOperacao = (e) => {
    e.preventDefault();
    
    if (!formOperacao.quantidade || !formOperacao.preco) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    // Garantir que a data seja processada corretamente, evitando problemas de fuso horário
    const dataInput = formOperacao.data;
    let dataFormatada;
    
    // Normalizar a data para o formato YYYY-MM-DD sem componente de tempo
    if (dataInput.includes('-')) {
      // Se já está no formato YYYY-MM-DD ou YYYY-MM-DDT...
      dataFormatada = dataInput.split('T')[0]; // Remover a parte do tempo se existir
    } else if (dataInput.includes('/')) {
      // Se está no formato DD/MM/YYYY
      const [dia, mes, ano] = dataInput.split('/');
      dataFormatada = `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
    } else {
      // Outros formatos, tentar converter
      try {
        const dateObj = new Date(dataInput);
        dataFormatada = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;
      } catch (e) {
        // Fallback para o input original se houver erro
        dataFormatada = dataInput;
      }
    }
    
    const novaOperacao = {
      data: dataFormatada, // Formato yyyy-MM-dd consistente sem componente de tempo
      tipo: formOperacao.tipo,
      quantidade: parseInt(formOperacao.quantidade),
      preco: parseFloat(formOperacao.preco),
      valor: parseInt(formOperacao.quantidade) * parseFloat(formOperacao.preco),
      corretagem: parseFloat(formOperacao.corretagem) || 0
    };

    // Desativar a atualização automática do ativoLocal temporariamente
    // para evitar a piscada causada pela atualização dupla
    let novoAtivoLocal;
    
    if (editingOperacaoIndex !== null) {
      // Modo de edição
      // 1. Atualizar o estado global primeiro
      actions.updateOperacao(ativoLocal.codigo, editingOperacaoIndex, novaOperacao);
      
      // 2. Criar uma cópia profunda do ativo para atualização local
      novoAtivoLocal = JSON.parse(JSON.stringify(ativoLocal));
      novoAtivoLocal.operacoes[editingOperacaoIndex] = novaOperacao;
      
      // Recalcular os valores localmente para refletir a atualização imediatamente
      const novaQuantidade = novoAtivoLocal.operacoes.reduce((total, op) => {
        return op.tipo === 'COMPRA' ? total + op.quantidade : total - op.quantidade;
      }, 0);
      
      const compras = novoAtivoLocal.operacoes.filter(op => op.tipo === 'COMPRA');
      const totalValorCompras = compras.reduce((sum, op) => sum + op.valor, 0);
      const totalQuantidadeCompras = compras.reduce((sum, op) => sum + op.quantidade, 0);
      const novoPrecoMedio = totalQuantidadeCompras > 0 ? totalValorCompras / totalQuantidadeCompras : 0;
      
      const novoValorInvestido = compras.reduce((sum, op) => sum + op.valor + (op.corretagem || 0), 0);
      const novoValorAtual = novaQuantidade * novoAtivoLocal.cotacaoAtual;
      const novaRentabilidade = novoValorInvestido > 0 ? 
        ((novoValorAtual - novoValorInvestido) / novoValorInvestido) * 100 : 0;
      
      novoAtivoLocal.quantidade = novaQuantidade;
      novoAtivoLocal.precoMedio = novoPrecoMedio;
      novoAtivoLocal.valorInvestido = novoValorInvestido;
      novoAtivoLocal.valorAtual = novoValorAtual;
      novoAtivoLocal.rentabilidade = novaRentabilidade;
      
      // 3. Atualizar o estado local com os cálculos completos
      setAtivoLocal(novoAtivoLocal);
      
      alert('Operação atualizada com sucesso!');
    } else {
      // Modo de adição
      // 1. Atualizar o estado global primeiro
      actions.addOperacao(ativoLocal.codigo, novaOperacao);
      
      // 2. Criar uma cópia profunda do ativo para atualização local
      novoAtivoLocal = JSON.parse(JSON.stringify(ativoLocal));
      novoAtivoLocal.operacoes.push(novaOperacao);
      
      // Recalcular os valores localmente para refletir a atualização imediatamente
      const novaQuantidade = novoAtivoLocal.operacoes.reduce((total, op) => {
        return op.tipo === 'COMPRA' ? total + op.quantidade : total - op.quantidade;
      }, 0);
      
      const compras = novoAtivoLocal.operacoes.filter(op => op.tipo === 'COMPRA');
      const totalValorCompras = compras.reduce((sum, op) => sum + op.valor, 0);
      const totalQuantidadeCompras = compras.reduce((sum, op) => sum + op.quantidade, 0);
      const novoPrecoMedio = totalQuantidadeCompras > 0 ? totalValorCompras / totalQuantidadeCompras : 0;
      
      const novoValorInvestido = compras.reduce((sum, op) => sum + op.valor + (op.corretagem || 0), 0);
      const novoValorAtual = novaQuantidade * novoAtivoLocal.cotacaoAtual;
      const novaRentabilidade = novoValorInvestido > 0 ? 
        ((novoValorAtual - novoValorInvestido) / novoValorInvestido) * 100 : 0;
      
      novoAtivoLocal.quantidade = novaQuantidade;
      novoAtivoLocal.precoMedio = novoPrecoMedio;
      novoAtivoLocal.valorInvestido = novoValorInvestido;
      novoAtivoLocal.valorAtual = novoValorAtual;
      novoAtivoLocal.rentabilidade = novaRentabilidade;
      
      // 3. Atualizar o estado local com os cálculos completos
      setAtivoLocal(novoAtivoLocal);
      
      alert('Operação adicionada com sucesso!');
    }
    
    // Reset form e interface
    resetOperacaoForm();
    setEditingOperacaoIndex(null);
    setShowAddOperacao(false);
  };

  const handleEditOperacao = (operacaoIndex) => {
    const operacao = ativoLocal.operacoes[operacaoIndex];
    if (!operacao) {
      console.error(`Operação com índice ${operacaoIndex} não encontrada`);
      return;
    }
    
    // Garantir que a data esteja no formato YYYY-MM-DD para o input date
    // Para evitar problemas de fuso horário, normalizamos a data
    const dataOriginal = operacao.data;
    let dataFormatada;
    
    // Normalizar para formato YYYY-MM-DD sem componente de tempo
    if (dataOriginal.includes('-')) {
      // Remover qualquer componente de tempo se existir
      dataFormatada = dataOriginal.split('T')[0];
    } else if (dataOriginal.includes('/')) {
      // Se estiver no formato DD/MM/YYYY
      const [dia, mes, ano] = dataOriginal.split('/');
      dataFormatada = `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
    } else {
      // Outros formatos, tentar converter manualmente para evitar problemas de fuso horário
      try {
        const dateObj = new Date(dataOriginal);
        dataFormatada = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;
      } catch (e) {
        // Fallback para o formato original se houver erro
        dataFormatada = dataOriginal;
      }
    }
    
    setFormOperacao({
      tipo: operacao.tipo,
      quantidade: operacao.quantidade.toString(),
      preco: operacao.preco.toString(),
      corretagem: operacao.corretagem ? operacao.corretagem.toString() : '',
      data: dataFormatada
    });
    setEditingOperacaoIndex(operacaoIndex);
    setShowAddOperacao(true);
  };

  const handleRemoveOperacao = (operacaoIndex) => {
    if (window.confirm('Tem certeza que deseja remover esta operação? Esta ação afetará todos os cálculos do ativo.')) {
      const codigoAtivo = ativoLocal.codigo;
      
      // Criar uma cópia local das operações sem a operação a ser removida
      const novasOperacoesLocal = ativoLocal.operacoes.filter((_, i) => i !== operacaoIndex);
      
      // Criar um novo ativoLocal com as operações atualizadas
      const novoAtivoLocal = {
        ...ativoLocal,
        operacoes: novasOperacoesLocal
      };
      
      // Atualizar o estado local primeiro para resposta imediata da UI
      setAtivoLocal(novoAtivoLocal);
      
      // Disparar atualização para forçar recálculo de operacoesAgrupadas
      setLastUpdate(Date.now());
      
      // Chamar a ação para atualizar o estado global
      actions.removeOperacao(codigoAtivo, operacaoIndex);
      
      // Atualizar o estado local novamente após um breve atraso para sincronizar com o estado global
      setTimeout(() => {
        if (isMounted.current) {
          const ativoAtualizado = state.ativos.find(a => a.codigo === codigoAtivo);
          if (ativoAtualizado) {
            setAtivoLocal(ativoAtualizado);
            setLastUpdate(Date.now()); // Forçar nova atualização
          } else {
            // Se o ativo foi removido (não existe mais no estado global), fechar o modal
            handleClose();
          }
        }
      }, 50); // Aumentar o tempo para garantir que o estado global foi atualizado
      
      alert('Operação removida com sucesso!');
    }
  };

  const resetOperacaoForm = () => {
    setFormOperacao({
      tipo: 'COMPRA',
      quantidade: '',
      preco: '',
      corretagem: '',
      data: format(new Date(), 'yyyy-MM-dd')
    });
  };

  // Funções para manipular proventos
  const handleProventoChange = (e) => {
    setFormProvento({
      ...formProvento,
      [e.target.name]: e.target.value
    });
  };

  const handleAddProvento = (e) => {
    e.preventDefault();
    
    if (!formProvento.valor || !formProvento.data) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    // Garantir que a data seja processada corretamente, evitando problemas de fuso horário
    const dataInput = formProvento.data;
    let dataFormatada;
    
    // Normalizar a data para o formato YYYY-MM-DD sem componente de tempo
    if (dataInput.includes('-')) {
      // Se já está no formato YYYY-MM-DD ou YYYY-MM-DDT...
      dataFormatada = dataInput.split('T')[0]; // Remover a parte do tempo se existir
    } else if (dataInput.includes('/')) {
      // Se está no formato DD/MM/YYYY
      const [dia, mes, ano] = dataInput.split('/');
      dataFormatada = `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
    } else {
      // Outros formatos, tentar converter
      try {
        const dateObj = new Date(dataInput);
        dataFormatada = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;
      } catch (e) {
        // Fallback para o input original se houver erro
        dataFormatada = dataInput;
      }
    }
    
    const novoProvento = {
      data: dataFormatada, // Formato yyyy-MM-dd consistente sem componente de tempo
      tipo: formProvento.tipo,
      valor: parseFloat(formProvento.valor)
    };

    // Desativar a atualização automática do ativoLocal temporariamente
    // para evitar a piscada causada pela atualização dupla
    let novoAtivoLocal;
    
    if (editingProventoIndex !== null) {
      // Modo de edição
      // 1. Atualizar o estado global primeiro
      actions.updateProvento(ativoLocal.codigo, editingProventoIndex, novoProvento);
      
      // 2. Criar uma cópia profunda do ativo para atualização local
      novoAtivoLocal = JSON.parse(JSON.stringify(ativoLocal));
      novoAtivoLocal.proventos[editingProventoIndex] = novoProvento;
      
      // 3. Atualizar o estado local com os cálculos completos
      setAtivoLocal(novoAtivoLocal);
      
      alert('Provento atualizado com sucesso!');
    } else {
      // Modo de adição
      // 1. Atualizar o estado global primeiro
      actions.addProvento(ativoLocal.codigo, novoProvento);
      
      // 2. Criar uma cópia profunda do ativo para atualização local
      novoAtivoLocal = JSON.parse(JSON.stringify(ativoLocal));
      novoAtivoLocal.proventos.push(novoProvento);
      
      // 3. Atualizar o estado local com os cálculos completos
      setAtivoLocal(novoAtivoLocal);
      
      alert('Provento adicionado com sucesso!');
    }
    
    // Reset form e interface
    resetProventoForm();
    setEditingProventoIndex(null);
    setShowAddProvento(false);
    setLastUpdate(Date.now());
  };

  const handleEditProvento = (proventoIndex) => {
    const provento = ativoLocal.proventos[proventoIndex];
    if (!provento) {
      console.error(`Provento com índice ${proventoIndex} não encontrado`);
      return;
    }
    
    // Garantir que a data esteja no formato YYYY-MM-DD para o input date
    // Para evitar problemas de fuso horário, normalizamos a data
    const dataOriginal = provento.data;
    let dataFormatada;
    
    // Normalizar para formato YYYY-MM-DD sem componente de tempo
    if (dataOriginal.includes('-')) {
      // Remover qualquer componente de tempo se existir
      dataFormatada = dataOriginal.split('T')[0];
    } else if (dataOriginal.includes('/')) {
      // Se estiver no formato DD/MM/YYYY
      const [dia, mes, ano] = dataOriginal.split('/');
      dataFormatada = `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
    } else {
      // Outros formatos, tentar converter manualmente para evitar problemas de fuso horário
      try {
        const dateObj = new Date(dataOriginal);
        dataFormatada = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;
      } catch (e) {
        // Fallback para o formato original se houver erro
        dataFormatada = dataOriginal;
      }
    }
    
    setFormProvento({
      tipo: provento.tipo,
      valor: provento.valor.toString(),
      data: dataFormatada
    });
    setEditingProventoIndex(proventoIndex);
    setShowAddProvento(true);
  };

  const handleRemoveProvento = (proventoIndex) => {
    if (window.confirm('Tem certeza que deseja remover este provento? Esta ação afetará todos os cálculos do ativo.')) {
      const codigoAtivo = ativoLocal.codigo;
      
      // Criar uma cópia local dos proventos sem o provento a ser removido
      const novosProventosLocal = ativoLocal.proventos.filter((_, i) => i !== proventoIndex);
      
      // Criar um novo ativoLocal com os proventos atualizados
      const novoAtivoLocal = {
        ...ativoLocal,
        proventos: novosProventosLocal
      };
      
      // Atualizar o estado local primeiro para resposta imediata da UI
      setAtivoLocal(novoAtivoLocal);
      
      // Disparar atualização para forçar recálculo de proventosAgrupados
      setLastUpdate(Date.now());
      
      // Chamar a ação para atualizar o estado global
      actions.removeProvento(codigoAtivo, proventoIndex);
      
      // Atualizar o estado local novamente após um breve atraso para sincronizar com o estado global
      setTimeout(() => {
        if (isMounted.current) {
          const ativoAtualizado = state.ativos.find(a => a.codigo === codigoAtivo);
          if (ativoAtualizado) {
            setAtivoLocal(ativoAtualizado);
            setLastUpdate(Date.now()); // Forçar nova atualização
          } else {
            // Se o ativo foi removido (não existe mais no estado global), fechar o modal
            handleClose();
          }
        }
      }, 50); // Aumentar o tempo para garantir que o estado global foi atualizado
      
      alert('Provento removido com sucesso!');
    }
  };

  const resetProventoForm = () => {
    setFormProvento({
      tipo: 'RENDIMENTO',
      valor: '',
      data: format(new Date(), 'yyyy-MM-dd')
    });
  };

  const handleUpdateCotacao = (e) => {
    e.preventDefault();
    
    if (!formCotacao.valor) {
      alert('Por favor, informe a cotação atual.');
      return;
    }

    const cotacaoAtual = parseFloat(formCotacao.valor);
    const valorAtual = ativoLocal.quantidade * cotacaoAtual;
    const rentabilidade = ativoLocal.valorInvestido > 0 ? 
      ((valorAtual - ativoLocal.valorInvestido) / ativoLocal.valorInvestido) * 100 : 0;

    const ativoAtualizado = {
      ...ativoLocal,
      cotacaoAtual: cotacaoAtual,
      valorAtual: valorAtual,
      rentabilidade: rentabilidade
    };

    actions.updateAtivo(ativoAtualizado);
    setAtivoLocal(ativoAtualizado);
    alert('Cotação atualizada com sucesso!');
    handleClose(); // Fecha o modal após atualizar a cotação
  };

  if (!isOpen || !ativoLocal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 space-y-0" style={{ marginTop: 0, marginBottom: 0 }}>
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Cabeçalho */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 flex items-center">
              <span className="mr-2">{ativoLocal.codigo}</span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                ativoLocal.tipo === 'ACAO' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-green-100 text-green-800'
              }`}>
                {ativoLocal.tipo}
              </span>
            </h3>
            <p className="text-sm text-gray-500">
              {ativoLocal.quantidade} {ativoLocal.quantidade > 1 ? 'unidades' : 'unidade'}
            </p>
          </div>
          <button 
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Resumo do Ativo */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="card p-4">
            <p className="text-sm text-gray-500 mb-1">Preço Médio</p>
            <p className="text-lg font-semibold">{formatCurrency(ativoLocal.precoMedio)}</p>
          </div>
          <div className="card p-4">
            <p className="text-sm text-gray-500 mb-1">Cotação Atual</p>
            <p className="text-lg font-semibold">{formatCurrency(ativoLocal.cotacaoAtual)}</p>
          </div>
          <div className="card p-4">
            <p className="text-sm text-gray-500 mb-1">Valor Investido</p>
            <p className="text-lg font-semibold">{formatCurrency(ativoLocal.valorInvestido)}</p>
          </div>
          <div className="card p-4">
            <p className="text-sm text-gray-500 mb-1">Valor Atual</p>
            <p className="text-lg font-semibold">{formatCurrency(ativoLocal.valorAtual)}</p>
          </div>
        </div>

        {/* Rentabilidade e Dividend Yield */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="card p-4">
            <p className="text-sm text-gray-500 mb-1">Rentabilidade</p>
            <div className="flex items-center">
              {ativoLocal.rentabilidade >= 0 ? (
                <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
              ) : (
                <TrendingDown className="h-5 w-5 text-red-600 mr-2" />
              )}
              <p className={`text-lg font-semibold ${
                ativoLocal.rentabilidade >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatPercentage(ativoLocal.rentabilidade)}
              </p>
            </div>
          </div>
          <div className="card p-4">
            <p className="text-sm text-gray-500 mb-1">Dividend Yield</p>
            <p className="text-lg font-semibold">{formatPercentage(ativoLocal.dividendYield)}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <div className="flex -mb-px">
            <button
              onClick={() => setActiveTab('resumo')}
              className={`mr-8 py-4 text-sm font-medium ${
                activeTab === 'resumo'
                  ? 'text-blue-600 border-b-2 border-blue-500'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Resumo
            </button>
            <button
              onClick={() => setActiveTab('operacoes')}
              className={`mr-8 py-4 text-sm font-medium ${
                activeTab === 'operacoes'
                  ? 'text-blue-600 border-b-2 border-blue-500'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Operações
            </button>
            <button
              onClick={() => setActiveTab('proventos')}
              className={`py-4 text-sm font-medium ${
                activeTab === 'proventos'
                  ? 'text-blue-600 border-b-2 border-blue-500'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Proventos
            </button>
          </div>
        </div>

        {/* Conteúdo das Tabs */}
        <div className="space-y-6">
          {/* Tab Resumo */}
          {activeTab === 'resumo' && (
            <div>
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-4">Atualizar Cotação</h4>
                <form onSubmit={handleUpdateCotacao} className="flex items-end gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cotação Atual (R$) *
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="number"
                        name="valor"
                        value={formCotacao.valor}
                        onChange={handleCotacaoChange}
                        className="input-field pl-9"
                        placeholder="72.30"
                        step="0.01"
                        min="0"
                        required
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="btn-primary h-10"
                  >
                    Atualizar
                  </button>
                </form>
              </div>

              <h4 className="text-sm font-medium text-gray-900 mb-3">Informações do Ativo</h4>
              <div className="overflow-hidden border border-gray-200 rounded-lg">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <p className="text-sm font-medium text-gray-700">Detalhes do Investimento</p>
                </div>
                <div className="divide-y divide-gray-200">
                  <div className="grid grid-cols-3 text-sm">
                    <div className="px-4 py-3 text-gray-500">Código</div>
                    <div className="px-4 py-3 text-gray-900 col-span-2">{ativoLocal.codigo}</div>
                  </div>
                  <div className="grid grid-cols-3 text-sm">
                    <div className="px-4 py-3 text-gray-500">Tipo</div>
                    <div className="px-4 py-3 text-gray-900 col-span-2">{ativoLocal.tipo}</div>
                  </div>
                  <div className="grid grid-cols-3 text-sm">
                    <div className="px-4 py-3 text-gray-500">Quantidade</div>
                    <div className="px-4 py-3 text-gray-900 col-span-2">{ativoLocal.quantidade}</div>
                  </div>
                  <div className="grid grid-cols-3 text-sm">
                    <div className="px-4 py-3 text-gray-500">Preço Médio</div>
                    <div className="px-4 py-3 text-gray-900 col-span-2">{formatCurrency(ativoLocal.precoMedio)}</div>
                  </div>
                  <div className="grid grid-cols-3 text-sm">
                    <div className="px-4 py-3 text-gray-500">Valor Investido</div>
                    <div className="px-4 py-3 text-gray-900 col-span-2">{formatCurrency(ativoLocal.valorInvestido)}</div>
                  </div>
                  <div className="grid grid-cols-3 text-sm">
                    <div className="px-4 py-3 text-gray-500">Valor Atual</div>
                    <div className="px-4 py-3 text-gray-900 col-span-2">{formatCurrency(ativoLocal.valorAtual)}</div>
                  </div>
                  <div className="grid grid-cols-3 text-sm">
                    <div className="px-4 py-3 text-gray-500">Rentabilidade</div>
                    <div className={`px-4 py-3 font-medium col-span-2 ${
                      ativoLocal.rentabilidade >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {formatPercentage(ativoLocal.rentabilidade)}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 text-sm">
                    <div className="px-4 py-3 text-gray-500">Dividend Yield</div>
                    <div className="px-4 py-3 text-gray-900 col-span-2">{formatPercentage(ativoLocal.dividendYield)}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab Operações */}
          {activeTab === 'operacoes' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-sm font-medium text-gray-900">Histórico de Operações</h4>
                <button 
                  onClick={() => setShowAddOperacao(true)}
                  className="btn-primary flex items-center space-x-2 text-sm py-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Nova Operação</span>
                </button>
              </div>

              {/* Formulário de Nova Operação */}
              {showAddOperacao && (
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                    {editingOperacaoIndex !== null ? (
                      <>
                        <Edit className="h-4 w-4 mr-2" />
                        Editar Operação
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Nova Operação
                      </>
                    )}
                  </h4>
                  
                  <form onSubmit={handleAddOperacao} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tipo de Operação *
                        </label>
                        <select
                          name="tipo"
                          value={formOperacao.tipo}
                          onChange={handleOperacaoChange}
                          className="input-field"
                          required
                        >
                          <option value="COMPRA">Compra</option>
                          <option value="VENDA">Venda</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Data *
                        </label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <input
                            type="date"
                            name="data"
                            value={formOperacao.data}
                            onChange={handleOperacaoChange}
                            className="input-field pl-9"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Quantidade *
                        </label>
                        <input
                          type="number"
                          name="quantidade"
                          value={formOperacao.quantidade}
                          onChange={handleOperacaoChange}
                          className="input-field"
                          placeholder="100"
                          min="1"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Preço (R$) *
                        </label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <input
                            type="number"
                            name="preco"
                            value={formOperacao.preco}
                            onChange={handleOperacaoChange}
                            className="input-field pl-9"
                            placeholder="68.50"
                            step="0.01"
                            min="0"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Corretagem (R$)
                        </label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <input
                            type="number"
                            name="corretagem"
                            value={formOperacao.corretagem}
                            onChange={handleOperacaoChange}
                            className="input-field pl-9"
                            placeholder="0.00"
                            step="0.01"
                            min="0"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Resumo da Operação */}
                    {formOperacao.quantidade && formOperacao.preco && (
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm text-blue-700">
                          Valor Total: {formatCurrency(
                            parseFloat(formOperacao.quantidade || 0) * 
                            parseFloat(formOperacao.preco || 0) + 
                            parseFloat(formOperacao.corretagem || 0)
                          )}
                        </p>
                      </div>
                    )}

                    <div className="flex justify-end space-x-3 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddOperacao(false);
                          setEditingOperacaoIndex(null);
                          resetOperacaoForm();
                        }}
                        className="btn-secondary"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="btn-primary"
                      >
                        {editingOperacaoIndex !== null ? "Atualizar Operação" : "Adicionar Operação"}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Operações Agrupadas por Data */}
              {ativoLocal && ativoLocal.operacoes && ativoLocal.operacoes.length > 0 ? (
                <div className="space-y-6">
                  {operacoesAgrupadas.map((grupo, grupoIndex) => (
                    <div key={grupoIndex} className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                        <h5 className="text-sm font-medium text-gray-900 flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                          {grupo.data}
                        </h5>
                      </div>
                      
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="table-header">Tipo</th>
                              <th className="table-header">Quantidade</th>
                              <th className="table-header">Preço</th>
                              <th className="table-header">Valor</th>
                              <th className="table-header">Corretagem</th>
                              <th className="table-header">Total</th>
                              <th className="table-header">Ações</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {grupo.operacoes.map((op) => (
                              <tr key={op.originalIndex} className="hover:bg-gray-50">
                                <td className="table-cell">
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    op.tipo === 'COMPRA' 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-red-100 text-red-800'
                                  }`}>
                                    {op.tipo}
                                  </span>
                                </td>
                                <td className="table-cell">{op.quantidade}</td>
                                <td className="table-cell">{formatCurrency(op.preco)}</td>
                                <td className="table-cell">{formatCurrency(op.valor)}</td>
                                <td className="table-cell">{formatCurrency(op.corretagem || 0)}</td>
                                <td className="table-cell">{formatCurrency(op.valor + (op.corretagem || 0))}</td>
                                <td className="table-cell">
                                  <div className="flex space-x-2">
                                    <button
                                      onClick={() => handleEditOperacao(op.originalIndex)}
                                      className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-full transition-colors"
                                      title="Editar operação"
                                    >
                                      <Edit className="h-4 w-4" />
                                    </button>
                                    <button
                                      onClick={() => handleRemoveOperacao(op.originalIndex)}
                                      className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-full transition-colors"
                                      title="Remover operação"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">Nenhuma operação registrada além da compra inicial.</p>
                </div>
              )}
            </div>
          )}

          {/* Tab Proventos */}
          {activeTab === 'proventos' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-sm font-medium text-gray-900">Histórico de Proventos</h4>
                <button
                  onClick={() => {
                    resetProventoForm();
                    setEditingProventoIndex(null);
                    setShowAddProvento(true);
                  }}
                  className="btn-primary-sm flex items-center space-x-1"
                >
                  <Plus className="h-3 w-3" />
                  <span>Novo Provento</span>
                </button>
              </div>
              
              {/* Formulário para adicionar/editar provento */}
              {showAddProvento && (
                <div className="bg-white p-4 mb-6 rounded-lg border border-gray-200">
                  <h5 className="text-sm font-medium text-gray-900 mb-3">
                    {editingProventoIndex !== null ? 'Editar Provento' : 'Adicionar Provento'}
                  </h5>
                  
                  <form onSubmit={handleAddProvento} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Data *
                        </label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <input
                            type="date"
                            name="data"
                            value={formProvento.data}
                            onChange={handleProventoChange}
                            className="input-field pl-9"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tipo *
                        </label>
                        <select
                          name="tipo"
                          value={formProvento.tipo}
                          onChange={handleProventoChange}
                          className="input-field"
                          required
                        >
                          <option value="RENDIMENTO">Rendimento</option>
                          <option value="DIVIDENDO">Dividendo</option>
                          <option value="JCP">JCP</option>
                          <option value="AMORTIZACAO">Amortização</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Valor (R$) *
                        </label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <input
                            type="number"
                            name="valor"
                            value={formProvento.valor}
                            onChange={handleProventoChange}
                            className="input-field pl-9"
                            placeholder="45.50"
                            step="0.01"
                            min="0"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-2">
                      <button
                        type="button"
                        onClick={() => {
                          resetProventoForm();
                          setShowAddProvento(false);
                          setEditingProventoIndex(null);
                        }}
                        className="btn-secondary-sm"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="btn-primary-sm"
                      >
                        {editingProventoIndex !== null ? 'Atualizar' : 'Adicionar'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Proventos Agrupados por Data */}
              {ativoLocal && ativoLocal.proventos && ativoLocal.proventos.length > 0 ? (
                <div className="space-y-6">
                  {proventosAgrupados.map((grupo, grupoIndex) => (
                    <div key={grupoIndex} className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                        <h5 className="text-sm font-medium text-gray-900 flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                          {grupo.data}
                        </h5>
                      </div>
                      
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="table-header">Tipo</th>
                              <th className="table-header">Valor</th>
                              <th className="table-header">Ações</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {grupo.proventos.map((prov) => (
                              <tr key={prov.originalIndex} className="hover:bg-gray-50">
                                <td className="table-cell">
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {prov.tipo}
                                  </span>
                                </td>
                                <td className="table-cell">{formatCurrency(prov.valor)}</td>
                                <td className="table-cell">
                                  <div className="flex space-x-2">
                                    <button
                                      onClick={() => handleEditProvento(prov.originalIndex)}
                                      className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-full transition-colors"
                                      title="Editar provento"
                                    >
                                      <Edit className="h-4 w-4" />
                                    </button>
                                    <button
                                      onClick={() => handleRemoveProvento(prov.originalIndex)}
                                      className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-full transition-colors"
                                      title="Remover provento"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">Nenhum provento registrado para este ativo.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetalheAtivo;
