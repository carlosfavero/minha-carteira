import { useState } from 'react';
import { useInvestment } from '../contexts/InvestmentContext';
import { DollarSign, Plus, Calendar, TrendingUp, Building } from 'lucide-react';
import { format } from 'date-fns';

const ProventosComponent = () => {
  const { state, actions } = useInvestment();
  const [isOpen, setIsOpen] = useState(false);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.codigo || !formData.valor) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const ativoExiste = state.ativos.find(ativo => ativo.codigo === formData.codigo.toUpperCase());
    
    if (!ativoExiste) {
      alert('Ativo não encontrado na carteira.');
      return;
    }

    const provento = {
      data: formData.data,
      valor: parseFloat(formData.valor),
      tipo: formData.tipo
    };

    actions.addProvento(formData.codigo.toUpperCase(), provento);
    
    setFormData({
      codigo: '',
      valor: '',
      tipo: 'DIVIDENDO',
      data: format(new Date(), 'yyyy-MM-dd')
    });
    
    setIsOpen(false);
    alert('Provento registrado com sucesso!');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

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
          <div className="space-y-4">
            {todosProventos.map((provento, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-success-100 rounded-lg">
                    <DollarSign className="h-5 w-5 text-success-600" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">{provento.codigo}</span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTipoColor(provento.tipo)}`}>
                        {provento.tipo}
                      </span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        provento.tipo_ativo === 'ACAO' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {provento.tipo_ativo}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      {formatDate(provento.data)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-success-600">
                    {formatCurrency(provento.valor)}
                  </p>
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