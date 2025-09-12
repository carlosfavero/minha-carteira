import { useState } from 'react';
import { useInvestment } from '../contexts/InvestmentContext';
import { Plus, Building, TrendingUp, DollarSign, Hash, Calendar } from 'lucide-react';
import { format } from 'date-fns';

const AddAtivoModal = ({ isOpen, onClose }) => {
  const { actions } = useInvestment();
  const [formData, setFormData] = useState({
    codigo: '',
    tipo: 'ACAO',
    quantidade: '',
    preco: '',
    cotacaoAtual: '',
    corretagem: '',
    data: format(new Date(), 'yyyy-MM-dd')
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validações
    if (!formData.codigo || !formData.quantidade || !formData.preco || !formData.cotacaoAtual) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const quantidade = parseInt(formData.quantidade);
    const preco = parseFloat(formData.preco);
    const cotacaoAtual = parseFloat(formData.cotacaoAtual);
    const corretagem = parseFloat(formData.corretagem) || 0;
    const valorOperacao = quantidade * preco;
    const valorInvestido = valorOperacao + corretagem;
    const valorAtual = quantidade * cotacaoAtual;
    const rentabilidade = valorInvestido > 0 ? ((valorAtual - valorInvestido) / valorInvestido) * 100 : 0;

    const novoAtivo = {
      codigo: formData.codigo.toUpperCase(),
      tipo: formData.tipo,
      quantidade: quantidade,
      precoMedio: preco,
      valorInvestido: valorInvestido,
      cotacaoAtual: cotacaoAtual,
      valorAtual: valorAtual,
      rentabilidade: rentabilidade,
      dividendYield: 0,
      percentualCarteira: 0, // Será calculado posteriormente
      percentualIdeal: 2.99,
      comprar: false,
      proventos: [],
      operacoes: [
        {
          data: formData.data,
          tipo: 'COMPRA',
          quantidade: quantidade,
          preco: preco,
          valor: valorOperacao,
          corretagem: corretagem
        }
      ]
    };

    actions.addAtivo(novoAtivo);
    
    // Reset form
    setFormData({
      codigo: '',
      tipo: 'ACAO',
      quantidade: '',
      preco: '',
      cotacaoAtual: '',
      corretagem: '',
      data: format(new Date(), 'yyyy-MM-dd')
    });
    
    onClose();
    alert('Ativo adicionado com sucesso!');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Adicionar Novo Ativo</h3>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Código e Tipo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo do Ativo *
              </label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <select
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleChange}
                  className="input-field pl-9"
                  required
                >
                  <option value="ACAO">Ação</option>
                  <option value="FII">FII (Fundo Imobiliário)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Informações da Compra */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
              <TrendingUp className="h-4 w-4 mr-2" />
              Informações da Primeira Compra
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preço de Compra (R$) *
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cotação Atual (R$) *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="number"
                    name="cotacaoAtual"
                    value={formData.cotacaoAtual}
                    onChange={handleChange}
                    className="input-field pl-9"
                    placeholder="72.30"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data da Compra *
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
          </div>

          {/* Resumo da Operação */}
          {formData.quantidade && formData.preco && formData.cotacaoAtual && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-blue-900 mb-3">Resumo da Operação</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-blue-700">Valor da Compra:</p>
                  <p className="font-semibold text-blue-900">
                    R$ {(parseFloat(formData.quantidade || 0) * parseFloat(formData.preco || 0)).toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-blue-700">Total Investido:</p>
                  <p className="font-semibold text-blue-900">
                    R$ {(
                      parseFloat(formData.quantidade || 0) * parseFloat(formData.preco || 0) + 
                      parseFloat(formData.corretagem || 0)
                    ).toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-blue-700">Valor Atual:</p>
                  <p className="font-semibold text-blue-900">
                    R$ {(parseFloat(formData.quantidade || 0) * parseFloat(formData.cotacaoAtual || 0)).toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-blue-700">Rentabilidade:</p>
                  <p className={`font-semibold ${
                    ((parseFloat(formData.quantidade || 0) * parseFloat(formData.cotacaoAtual || 0)) - 
                     (parseFloat(formData.quantidade || 0) * parseFloat(formData.preco || 0) + parseFloat(formData.corretagem || 0))) >= 0
                      ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {(((parseFloat(formData.quantidade || 0) * parseFloat(formData.cotacaoAtual || 0)) - 
                      (parseFloat(formData.quantidade || 0) * parseFloat(formData.preco || 0) + parseFloat(formData.corretagem || 0))) /
                     (parseFloat(formData.quantidade || 0) * parseFloat(formData.preco || 0) + parseFloat(formData.corretagem || 0)) * 100 || 0).toFixed(2)}%
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Botões */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn-secondary"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 btn-primary"
            >
              Adicionar Ativo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAtivoModal;