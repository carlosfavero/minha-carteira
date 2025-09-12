import { TrendingUp, DollarSign, Percent, PieChart } from 'lucide-react';
import { useInvestment } from '../contexts/InvestmentContext';

const Header = () => {
  const { computed } = useInvestment();
  const resumo = computed.getResumoCarteira();

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatPercentage = (value) => {
    return `${value.toFixed(2)}%`;
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Minha Carteira</h1>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            {/* Valor Total */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
                <DollarSign className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Total Investido</p>
                <p className="text-lg font-semibold text-gray-900">
                  {formatCurrency(resumo.valorTotalInvestido)}
                </p>
              </div>
            </div>

            {/* Valor Atual */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg">
                <PieChart className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Valor Atual</p>
                <p className="text-lg font-semibold text-gray-900">
                  {formatCurrency(resumo.valorAtualCarteira)}
                </p>
              </div>
            </div>

            {/* Rentabilidade */}
            <div className="flex items-center space-x-2">
              <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${
                resumo.rentabilidadeTotal >= 0 ? 'bg-green-100' : 'bg-red-100'
              }`}>
                <Percent className={`h-5 w-5 ${
                  resumo.rentabilidadeTotal >= 0 ? 'text-green-600' : 'text-red-600'
                }`} />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Rentabilidade</p>
                <p className={`text-lg font-semibold ${
                  resumo.rentabilidadeTotal >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formatPercentage(resumo.rentabilidadeTotal)}
                </p>
              </div>
            </div>

            {/* Yield Médio */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Yield Médio</p>
                <p className="text-lg font-semibold text-gray-900">
                  {formatPercentage(resumo.yieldMedioCarteira)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;