import { useState, useMemo, useEffect, useRef } from 'react';
import { useInvestment } from '../contexts/InvestmentContext';
import { DollarSign, Plus, Calendar, TrendingUp, Building, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

const ProventosComponent = () => {
  const { state, actions } = useInvestment();
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingInfo, setEditingInfo] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(Date.now()); // Estado para controlar atualizações
  const isMounted = useRef(true); // Referência para verificar se o componente está montado
  const [formData, setFormData] = useState({
    codigo: '',
    valor: '',
    tipo: 'DIVIDENDO',
    data: format(new Date(), 'yyyy-MM-dd')
  });

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  // Obter todos os proventos de todos os ativos
  const todosProventos = state.ativos
    .flatMap(ativo => 
      ativo.proventos.map(provento => ({
        ...provento,
        codigo: ativo.codigo,
        tipo_ativo: ativo.tipo
      }))
    )
    .sort((a, b) => new Date(b.data) - new Date(a.data));

  const totalProventos = todosProventos.reduce((sum, provento) => sum + provento.valor, 0);

  // Agrupar proventos por data
  const proventosAgrupados = useMemo(() => {
    // Fazer uma cópia dos proventos
    const proventosClone = JSON.parse(JSON.stringify(todosProventos));

    // Adicionar índice original a cada provento para rastreabilidade
    const proventosComIndice = proventosClone.map((prov, index) => ({
      ...prov,
      listIndex: index // Índice na lista completa para operações de edição/exclusão
    }));

    // Ordenar proventos por data (mais recentes primeiro)
    const proventosOrdenados = proventosComIndice.sort((a, b) => {
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
  }, [todosProventos, lastUpdate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.codigo || !formData.valor) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    // Normalizar a data para o formato YYYY-MM-DD sem componente de tempo
    const dataInput = formData.data;
    let dataFormatada;
    
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

    const provento = {
      data: dataFormatada,
      valor: parseFloat(formData.valor),
      tipo: formData.tipo
    };

    if (isEditing && editingInfo) {
      // Modo de edição
      actions.updateProvento(editingInfo.codigoAtivo, editingInfo.proventoIndex, provento);
      alert('Provento atualizado com sucesso!');
    } else {
      // Modo de adição
      const ativoExiste = state.ativos.find(ativo => ativo.codigo === formData.codigo.toUpperCase());
      
      if (!ativoExiste) {
        alert('Ativo não encontrado na carteira.');
        return;
      }

      actions.addProvento(formData.codigo.toUpperCase(), provento);
      alert('Provento registrado com sucesso!');
    }
    
    // Reset form e interface
    resetForm();
    setIsOpen(false);
    setLastUpdate(Date.now()); // Forçar atualização da interface
  };

  const resetForm = () => {
    setFormData({
      codigo: '',
      valor: '',
      tipo: 'DIVIDENDO',
      data: format(new Date(), 'yyyy-MM-dd')
    });
    setIsEditing(false);
    setEditingInfo(null);
  };

  const handleEditProvento = (provento) => {
    // Garantir que a data esteja no formato YYYY-MM-DD para o input date
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
    
    setFormData({
      codigo: provento.codigo,
      tipo: provento.tipo,
      valor: provento.valor.toString(),
      data: dataFormatada
    });
    
    // Encontrar o ativo e o índice do provento para edição
    const ativo = state.ativos.find(a => a.codigo === provento.codigo);
    if (ativo) {
      // Procurar o provento no array de proventos do ativo que corresponde ao provento a ser editado
      const proventoIndex = ativo.proventos.findIndex(p => 
        p.data === provento.data && 
        p.valor === provento.valor && 
        p.tipo === provento.tipo
      );
      
      if (proventoIndex !== -1) {
        setEditingInfo({
          codigoAtivo: provento.codigo,
          proventoIndex: proventoIndex
        });
        
        setIsEditing(true);
        setIsOpen(true);
      }
    }
  };

  const handleRemoveProvento = (provento) => {
    if (window.confirm(`Tem certeza que deseja remover este provento de ${provento.codigo}? Esta ação afetará todos os cálculos do ativo.`)) {
      // Encontrar o ativo e o índice do provento para remoção
      const ativo = state.ativos.find(a => a.codigo === provento.codigo);
      if (ativo) {
        // Procurar o provento no array de proventos do ativo que corresponde ao provento a ser removido
        const proventoIndex = ativo.proventos.findIndex(p => 
          p.data === provento.data && 
          p.valor === provento.valor && 
          p.tipo === provento.tipo
        );
        
        if (proventoIndex !== -1) {
          actions.removeProvento(provento.codigo, proventoIndex);
          
          // Forçar uma atualização do componente após a remoção do provento
          setTimeout(() => {
            if (isMounted.current) {
              setLastUpdate(Date.now());
            }
          }, 50);
          
          alert('Provento removido com sucesso!');
        }
      }
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Limpar a referência quando o componente for desmontado
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const getTipoColor = (tipo) => {
    switch (tipo) {
      case 'DIVIDENDO':
        return 'bg-blue-100 text-blue-800';
      case 'JCP':
        return 'bg-purple-100 text-purple-800';
      case 'RENDIMENTO':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Proventos</h2>
          <p className="text-gray-600">
            Total recebido: <span className="font-semibold text-success-600">{formatCurrency(totalProventos)}</span>
          </p>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Registrar Provento</span>
        </button>
      </div>

      {/* Resumo por Tipo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {['DIVIDENDO', 'JCP', 'RENDIMENTO'].map(tipo => {
          const proventosTipo = todosProventos.filter(p => p.tipo === tipo);
          const totalTipo = proventosTipo.reduce((sum, p) => sum + p.valor, 0);
          
          return (
            <div key={tipo} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{tipo}S</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalTipo)}</p>
                  <p className="text-sm text-gray-500">{proventosTipo.length} pagamentos</p>
                </div>
                <div className="flex items-center justify-center w-12 h-12 bg-primary-100 rounded-lg">
                  <DollarSign className="h-6 w-6 text-primary-600" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lista de Proventos */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Histórico de Proventos</h3>
        
        {todosProventos.length === 0 ? (
          <div className="text-center py-12">
            <DollarSign className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum provento registrado</h3>
            <p className="mt-1 text-sm text-gray-500">
              Comece registrando seus primeiros dividendos e rendimentos.
            </p>
            <div className="mt-6">
              <button 
                onClick={() => setIsOpen(true)}
                className="btn-primary"
              >
                Registrar Primeiro Provento
              </button>
            </div>
          </div>
        ) : (
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
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ativo</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {grupo.proventos.map((prov) => (
                        <tr key={prov.listIndex} className="hover:bg-gray-50">
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                            <div className="flex items-center">
                              <span className="font-medium">{prov.codigo}</span>
                              <span className={`ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                prov.tipo_ativo === 'ACAO' 
                                  ? 'bg-blue-100 text-blue-800' 
                                  : 'bg-green-100 text-green-800'
                              }`}>
                                {prov.tipo_ativo}
                              </span>
                            </div>
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTipoColor(prov.tipo)}`}>
                              {prov.tipo}
                            </span>
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                            {formatCurrency(prov.valor)}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEditProvento(prov)}
                                className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-full transition-colors"
                                title="Editar provento"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleRemoveProvento(prov)}
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
        )}
      </div>

      {/* Modal de Novo Provento */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Registrar Provento</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Código do Ativo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Código do Ativo *
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
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

              {/* Tipo de Provento */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Provento *
                </label>
                <select
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleChange}
                  className="input-field"
                  required
                >
                  <option value="DIVIDENDO">Dividendo</option>
                  <option value="JCP">Juros sobre Capital Próprio</option>
                  <option value="RENDIMENTO">Rendimento (FII)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Valor */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Valor (R$) *
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="number"
                      name="valor"
                      value={formData.valor}
                      onChange={handleChange}
                      className="input-field pl-9"
                      placeholder="150.00"
                      step="0.01"
                      min="0"
                      required
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

              {/* Botões */}
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 btn-secondary"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary"
                >
                  Registrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProventosComponent;