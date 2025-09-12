import { useState, useMemo } from 'react';
import { useInvestment } from '../contexts/InvestmentContext';
import { Plus, Calendar, DollarSign, Hash, Tag, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

const OperacoesForm = () => {
  const { state, actions } = useInvestment();
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingInfo, setEditingInfo] = useState(null);
  const [formData, setFormData] = useState({
    codigo: '',
    tipo: 'COMPRA',
    quantidade: '',
    preco: '',
    corretagem: '',
    data: format(new Date(), 'yyyy-MM-dd')
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validações
    if (!formData.codigo || !formData.quantidade || !formData.preco) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const operacao = {
      data: formData.data,
      tipo: formData.tipo,
      quantidade: parseInt(formData.quantidade),
      preco: parseFloat(formData.preco),
      valor: parseInt(formData.quantidade) * parseFloat(formData.preco),
      corretagem: parseFloat(formData.corretagem) || 0
    };

    if (isEditing && editingInfo) {
      // Modo de edição
      actions.updateOperacao(editingInfo.codigoAtivo, editingInfo.operacaoIndex, operacao);
      alert('Operação atualizada com sucesso!');
    } else {
      // Modo de adição
      // Verificar se o ativo existe
      const ativoExiste = state.ativos.find(ativo => ativo.codigo === formData.codigo.toUpperCase());
      
      if (!ativoExiste) {
        alert('Ativo não encontrado na carteira. Adicione o ativo primeiro.');
        return;
      }

      actions.addOperacao(formData.codigo.toUpperCase(), operacao);
      alert('Operação registrada com sucesso!');
    }
    
    // Reset form
    resetForm();
    setIsOpen(false);
  };
  
  const resetForm = () => {
    setFormData({
      codigo: '',
      tipo: 'COMPRA',
      quantidade: '',
      preco: '',
      corretagem: '',
      data: format(new Date(), 'yyyy-MM-dd')
    });
    setIsEditing(false);
    setEditingInfo(null);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleEditOperacao = (operacao) => {
    // Garantir que a data esteja no formato YYYY-MM-DD para o input date
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
    
    setFormData({
      codigo: operacao.codigo,
      tipo: operacao.tipo,
      quantidade: operacao.quantidade.toString(),
      preco: operacao.preco.toString(),
      corretagem: operacao.corretagem ? operacao.corretagem.toString() : '',
      data: dataFormatada
    });
    
    setEditingInfo({
      codigoAtivo: operacao.codigo,
      operacaoIndex: operacao.originalIndex
    });
    
    setIsEditing(true);
    setIsOpen(true);
  };

  const handleRemoveOperacao = (operacao) => {
    if (window.confirm(`Tem certeza que deseja remover esta operação de ${operacao.codigo}? Esta ação afetará todos os cálculos do ativo.`)) {
      actions.removeOperacao(operacao.codigo, operacao.originalIndex);
      alert('Operação removida com sucesso!');
    }
  };

  // Funções formatadoras
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
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
      
      // Para outros formatos, usar Date
      const dateObj = new Date(dateString);
      return `${String(dateObj.getDate()).padStart(2, '0')}/${String(dateObj.getMonth() + 1).padStart(2, '0')}/${dateObj.getFullYear()}`;
    } catch (e) {
      console.error("Erro ao formatar data:", e);
      // Fallback para o método original
      return new Date(dateString).toLocaleDateString('pt-BR');
    }
  };

  // Agrupar operações por data
  const operacoesAgrupadas = useMemo(() => {
    // Obter todas as operações de todos os ativos
    const todasOperacoes = state.ativos.flatMap(ativo => 
      ativo.operacoes.map((op, index) => ({
        ...op,
        codigo: ativo.codigo,
        tipo_ativo: ativo.tipo,
        originalIndex: index
      }))
    );

    // Ordenar operações por data (mais recentes primeiro)
    const operacoesOrdenadas = todasOperacoes.sort((a, b) => {
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
    })).slice(0, 5); // Limitar a 5 grupos para não sobrecarregar a interface
  }, [state.ativos]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Operações</h2>
          <p className="text-gray-600">Registre suas compras e vendas</p>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Nova Operação</span>
        </button>
      </div>

      {/* Histórico de Operações */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Histórico Recente</h3>
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
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ativo</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantidade</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preço</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Corretagem</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {grupo.operacoes.map((operacao) => (
                      <tr key={`${operacao.codigo}-${operacao.originalIndex}`} className="hover:bg-gray-50">
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex items-center">
                            <span className="font-medium">{operacao.codigo}</span>
                            <span className={`ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                              operacao.tipo_ativo === 'ACAO' 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {operacao.tipo_ativo}
                            </span>
                          </div>
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            operacao.tipo === 'COMPRA' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {operacao.tipo}
                          </span>
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{operacao.quantidade}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{formatCurrency(operacao.preco)}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{formatCurrency(operacao.valor)}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{formatCurrency(operacao.corretagem || 0)}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{formatCurrency(operacao.valor + (operacao.corretagem || 0))}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditOperacao(operacao)}
                              className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-full transition-colors"
                              title="Editar operação"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleRemoveOperacao(operacao)}
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

          {operacoesAgrupadas.length === 0 && (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">Nenhuma operação registrada ainda.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Nova/Editar Operação */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 space-y-0" style={{ marginTop: 0, marginBottom: 0 }}>
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {isEditing ? 'Editar Operação' : 'Nova Operação'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Código do Ativo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Código do Ativo *
                </label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    name="codigo"
                    value={formData.codigo}
                    onChange={handleChange}
                    className="input-field pl-9"
                    placeholder="Ex: VALE3, BTLG11"
                    required
                  />
                </div>
              </div>

              {/* Tipo de Operação */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Operação *
                </label>
                <select
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleChange}
                  className="input-field"
                  required
                >
                  <option value="COMPRA">Compra</option>
                  <option value="VENDA">Venda</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Quantidade */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantidade *
                  </label>
                  <input
                    type="number"
                    name="quantidade"
                    value={formData.quantidade}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="100"
                    min="1"
                    required
                  />
                </div>

                {/* Preço */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preço (R$) *
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="number"
                      name="preco"
                      value={formData.preco}
                      onChange={handleChange}
                      className="input-field pl-9"
                      placeholder="68.50"
                      step="0.01"
                      min="0"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Corretagem */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Corretagem (R$)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="number"
                      name="corretagem"
                      value={formData.corretagem}
                      onChange={handleChange}
                      className="input-field pl-9"
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                    />
                  </div>
                </div>

                {/* Data */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="date"
                      name="data"
                      value={formData.data}
                      onChange={handleChange}
                      className="input-field pl-9"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Valor Total (calculado) */}
              {formData.quantidade && formData.preco && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">Valor Total da Operação:</p>
                  <p className="text-lg font-semibold text-gray-900">
                    R$ {(parseFloat(formData.quantidade || 0) * parseFloat(formData.preco || 0)).toFixed(2)}
                  </p>
                  {formData.corretagem && (
                    <p className="text-xs text-gray-500">
                      + R$ {parseFloat(formData.corretagem).toFixed(2)} de corretagem
                    </p>
                  )}
                </div>
              )}

              {/* Botões */}
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setIsOpen(false);
                  }}
                  className="flex-1 btn-secondary"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary"
                >
                  {isEditing ? 'Atualizar Operação' : 'Registrar Operação'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OperacoesForm;