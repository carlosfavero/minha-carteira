import { useState } from 'react';
import { useInvestment } from '../contexts/InvestmentContext';
import { Plus, Calendar, DollarSign, Hash, Tag } from 'lucide-react';
import { format } from 'date-fns';

const OperacoesForm = () => {
  const { state, actions } = useInvestment();
  const [isOpen, setIsOpen] = useState(false);
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

    // Verificar se o ativo existe
    const ativoExiste = state.ativos.find(ativo => ativo.codigo === formData.codigo.toUpperCase());
    
    if (!ativoExiste) {
      alert('Ativo não encontrado na carteira. Adicione o ativo primeiro.');
      return;
    }

    actions.addOperacao(formData.codigo.toUpperCase(), operacao);
    
    // Reset form
    setFormData({
      codigo: '',
      tipo: 'COMPRA',
      quantidade: '',
      preco: '',
      corretagem: '',
      data: format(new Date(), 'yyyy-MM-dd')
    });
    
    setIsOpen(false);
    alert('Operação registrada com sucesso!');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

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
        <div className="space-y-4">
          {state.ativos
            .flatMap(ativo => 
              ativo.operacoes.map(op => ({
                ...op,
                codigo: ativo.codigo,
                tipo_ativo: ativo.tipo
              }))
            )
            .sort((a, b) => new Date(b.data) - new Date(a.data))
            .slice(0, 10)
            .map((operacao, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${
                    operacao.tipo === 'COMPRA' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {operacao.tipo === 'COMPRA' ? (
                      <Plus className={`h-5 w-5 text-green-600`} />
                    ) : (
                      <Tag className={`h-5 w-5 text-red-600`} />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">{operacao.codigo}</span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        operacao.tipo === 'COMPRA' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {operacao.tipo}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      {operacao.quantidade} unidades • {new Date(operacao.data).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">
                    R$ {operacao.preco.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500">
                    Total: R$ {operacao.valor.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Modal de Nova Operação */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Nova Operação</h3>
            
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
                  onClick={() => setIsOpen(false)}
                  className="flex-1 btn-secondary"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary"
                >
                  Registrar Operação
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