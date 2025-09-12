import { useState, useMemo, useEffect } from 'react';
import { useInvestment } from '../contexts/InvestmentContext';
import { X, TrendingUp, TrendingDown, DollarSign, Plus, Calendar, Edit, Trash2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const DetalheAtivo = ({ isOpen, onClose, ativo: ativoProp }) => {
  const { actions } = useInvestment();
  const [ativoLocal, setAtivoLocal] = useState(ativoProp);
  const [activeTab, setActiveTab] = useState('resumo');
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

  // Atualizar o ativo local quando o ativo prop mudar
  useEffect(() => {
    setAtivoLocal(ativoProp);
  }, [ativoProp]);

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

    // Ordenar operações por data (mais recentes primeiro)
    const operacoesOrdenadas = [...ativoLocal.operacoes].sort((a, b) => 
      new Date(b.data) - new Date(a.data)
    );

    // Agrupar por data
    const grupos = {};
    operacoesOrdenadas.forEach((op, index) => {
      const dataFormatada = format(new Date(op.data), 'dd/MM/yyyy');
      if (!grupos[dataFormatada]) {
        grupos[dataFormatada] = [];
      }
      grupos[dataFormatada].push({...op, index});
    });

    // Converter para array
    return Object.keys(grupos).map(data => ({
      data,
      operacoes: grupos[data]
    }));
  }, [ativoLocal, ativoLocal?.operacoes]);

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
    return new Date(dateString).toLocaleDateString('pt-BR');
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

    const novaOperacao = {
      data: formOperacao.data,
      tipo: formOperacao.tipo,
      quantidade: parseInt(formOperacao.quantidade),
      preco: parseFloat(formOperacao.preco),
      valor: parseInt(formOperacao.quantidade) * parseFloat(formOperacao.preco),
      corretagem: parseFloat(formOperacao.corretagem) || 0
    };

    if (editingOperacaoIndex !== null) {
      // Modo de edição
      actions.updateOperacao(ativoLocal.codigo, editingOperacaoIndex, novaOperacao);
      
      // Atualizar localmente para feedback imediato
      const ativoAtualizado = {...ativoLocal};
      ativoAtualizado.operacoes[editingOperacaoIndex] = novaOperacao;
      setAtivoLocal(ativoAtualizado);
      
      alert('Operação atualizada com sucesso!');
    } else {
      // Modo de adição
      actions.addOperacao(ativoLocal.codigo, novaOperacao);
      
      // Atualizar localmente para feedback imediato
      const ativoAtualizado = {...ativoLocal};
      ativoAtualizado.operacoes = [...ativoAtualizado.operacoes, novaOperacao];
      setAtivoLocal(ativoAtualizado);
      
      alert('Operação adicionada com sucesso!');
    }
    
    // Reset form
    resetOperacaoForm();
    
    setEditingOperacaoIndex(null);
    setShowAddOperacao(false);
  };

  const handleEditOperacao = (operacaoIndex) => {
    const operacao = ativoLocal.operacoes[operacaoIndex];
    setFormOperacao({
      tipo: operacao.tipo,
      quantidade: operacao.quantidade.toString(),
      preco: operacao.preco.toString(),
      corretagem: operacao.corretagem ? operacao.corretagem.toString() : '',
      data: operacao.data
    });
    setEditingOperacaoIndex(operacaoIndex);
    setShowAddOperacao(true);
  };

  const handleRemoveOperacao = (operacaoIndex) => {
    if (window.confirm('Tem certeza que deseja remover esta operação? Esta ação afetará todos os cálculos do ativoLocal.')) {
      actions.removeOperacao(ativoLocal.codigo, operacaoIndex);
      
      // Atualizar localmente para feedback imediato
      const ativoAtualizado = {...ativoLocal};
      ativoAtualizado.operacoes = ativoAtualizado.operacoes.filter((_, i) => i !== operacaoIndex);
      setAtivoLocal(ativoAtualizado);
      
      alert('Operação removida com sucesso!');
      
      // Se era a última operação, o ativo foi removido, então feche o modal
      if (ativoLocal.operacoes.length === 1) {
        onClose();
      }
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
    onClose(); // Fecha o modal após atualizar a cotação
  };

  if (!isOpen || !ativoLocal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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
              {ativoLocal.quantidade} {ativoLocal.quantidade > 1 ? 'unidades' : 'unidade'} • Adicionado em {formatDate(ativoLocal.dataCompra)}
            </p>
          </div>
          <button 
            onClick={onClose}
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
                    <div className="px-4 py-3 text-gray-500">Data de Compra</div>
                    <div className="px-4 py-3 text-gray-900 col-span-2">{formatDate(ativoLocal.dataCompra)}</div>
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
                              <tr key={op.index} className="hover:bg-gray-50">
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
                                      onClick={() => handleEditOperacao(op.index)}
                                      className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-full transition-colors"
                                      title="Editar operação"
                                    >
                                      <Edit className="h-4 w-4" />
                                    </button>
                                    <button
                                      onClick={() => handleRemoveOperacao(op.index)}
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
              <h4 className="text-sm font-medium text-gray-900 mb-4">Histórico de Proventos</h4>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="table-header">Data</th>
                      <th className="table-header">Tipo</th>
                      <th className="table-header">Valor</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {ativoLocal.proventos.map((prov, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="table-cell">{formatDate(prov.data)}</td>
                        <td className="table-cell">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {prov.tipo}
                          </span>
                        </td>
                        <td className="table-cell">{formatCurrency(prov.valor)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {ativoLocal.proventos.length === 0 && (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">Nenhum provento registrado para este ativoLocal.</p>
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
