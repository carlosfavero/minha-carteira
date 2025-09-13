import { useState } from 'react';
import { useInvestment } from '../contexts/InvestmentContext';
import { ArrowUpDown, Plus, Edit, Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import AddAtivoModal from './AddAtivoModal';
import DetalheAtivo from './DetalheAtivo';

const AtivosTable = () => {
  const { ativos, addAtivo, updateAtivo, removeAtivo } = useInvestment();
  const [sortField, setSortField] = useState('valorAtual');
  const [sortDirection, setSortDirection] = useState('desc');
  const [filter, setFilter] = useState('TODOS');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedAtivo, setSelectedAtivo] = useState(null);
  const [showDetalheModal, setShowDetalheModal] = useState(false);

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

  // Filtrar ativos
  const filteredAtivos = ativos.filter(ativo => {
    if (filter === 'TODOS') return true;
    return ativo.tipo === filter;
  });

  // Ordenar ativos
  const sortedAtivos = [...filteredAtivos].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (sortDirection === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-4 w-4 text-gray-400" />;
    }
    return (
      <ArrowUpDown className={`h-4 w-4 ${sortDirection === 'asc' ? 'rotate-180' : ''} text-blue-600`} />
    );
  };

  const handleRemoveAtivo = (codigo) => {
    if (window.confirm(`Tem certeza que deseja remover o ativo ${codigo}?`)) {
      removeAtivo(codigo);
    }
  };

  const handleViewAtivo = (ativo) => {
    setSelectedAtivo(ativo);
    setShowDetalheModal(true);
  };

  const handleCloseDetalheModal = () => {
    setShowDetalheModal(false);
    setSelectedAtivo(null);
  };

  return (
    <div className="space-y-6">
      {/* Filtros e Ações */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Meus Ativos</h2>
          <p className="text-gray-600">
            {filteredAtivos.length} {filteredAtivos.length === 1 ? 'ativo' : 'ativos'}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          {/* Filtro por Tipo */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="input-field w-full sm:w-auto"
          >
            <option value="TODOS">Todos os Tipos</option>
            <option value="ACAO">Ações</option>
            <option value="FII">FIIs</option>
          </select>

          {/* Botão Adicionar */}
          <button 
            onClick={() => setShowAddModal(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Adicionar Ativo</span>
          </button>
        </div>
      </div>

      {/* Tabela */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  className="table-header cursor-pointer"
                  onClick={() => handleSort('codigo')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Código</span>
                    {getSortIcon('codigo')}
                  </div>
                </th>
                <th className="table-header">Tipo</th>
                <th 
                  className="table-header cursor-pointer"
                  onClick={() => handleSort('quantidade')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Quantidade</span>
                    {getSortIcon('quantidade')}
                  </div>
                </th>
                <th 
                  className="table-header cursor-pointer"
                  onClick={() => handleSort('precoMedio')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Preço Médio</span>
                    {getSortIcon('precoMedio')}
                  </div>
                </th>
                <th 
                  className="table-header cursor-pointer"
                  onClick={() => handleSort('cotacaoAtual')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Cotação Atual</span>
                    {getSortIcon('cotacaoAtual')}
                  </div>
                </th>
                <th 
                  className="table-header cursor-pointer"
                  onClick={() => handleSort('valorInvestido')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Valor Investido</span>
                    {getSortIcon('valorInvestido')}
                  </div>
                </th>
                <th 
                  className="table-header cursor-pointer"
                  onClick={() => handleSort('valorAtual')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Valor Atual</span>
                    {getSortIcon('valorAtual')}
                  </div>
                </th>
                <th 
                  className="table-header cursor-pointer"
                  onClick={() => handleSort('rentabilidade')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Rentabilidade</span>
                    {getSortIcon('rentabilidade')}
                  </div>
                </th>
                <th 
                  className="table-header cursor-pointer"
                  onClick={() => handleSort('dividendYield')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Dividend Yield</span>
                    {getSortIcon('dividendYield')}
                  </div>
                </th>
                <th className="table-header">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedAtivos.map((ativo) => (
                <tr key={ativo.codigo} className="hover:bg-gray-50">
                  <td className="table-cell">
                    <div className="flex items-center">
                      <span className="font-medium text-gray-900">{ativo.codigo}</span>
                      {ativo.comprar && (
                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Comprar
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="table-cell">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      ativo.tipo === 'ACAO' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {ativo.tipo}
                    </span>
                  </td>
                  <td className="table-cell text-gray-900">{ativo.quantidade}</td>
                  <td className="table-cell text-gray-900">{formatCurrency(ativo.precoMedio)}</td>
                  <td className="table-cell text-gray-900">{formatCurrency(ativo.cotacaoAtual)}</td>
                  <td className="table-cell text-gray-900">{formatCurrency(ativo.valorInvestido)}</td>
                  <td className="table-cell text-gray-900">{formatCurrency(ativo.valorAtual)}</td>
                  <td className="table-cell">
                    <div className="flex items-center space-x-1">
                      {ativo.rentabilidade >= 0 ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      )}
                      <span className={`font-medium ${
                        ativo.rentabilidade >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {formatPercentage(ativo.rentabilidade)}
                      </span>
                    </div>
                  </td>
                  <td className="table-cell text-gray-900">{formatPercentage(ativo.dividendYield)}</td>
                  <td className="table-cell">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleViewAtivo(ativo)}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Ver detalhes"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleRemoveAtivo(ativo.codigo)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        title="Remover ativo"
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

        {/* Mensagem quando não há ativos */}
        {sortedAtivos.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <TrendingUp className="h-12 w-12" />
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum ativo encontrado</h3>
            <p className="mt-1 text-sm text-gray-500">
              {filter === 'TODOS' 
                ? 'Comece adicionando seu primeiro ativo à carteira.' 
                : `Nenhum ${filter === 'ACAO' ? 'ação' : 'FII'} encontrado.`
              }
            </p>
            <div className="mt-6">
              <button 
                onClick={() => setShowAddModal(true)}
                className="btn-primary"
              >
                Adicionar Ativo
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Adicionar Ativo */}
      <AddAtivoModal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)}
      />

      {/* Modal de Detalhe do Ativo */}
      <DetalheAtivo
        isOpen={showDetalheModal}
        onClose={handleCloseDetalheModal}
        ativo={selectedAtivo}
      />
    </div>
  );
};

export default AtivosTable;