import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useInvestment } from '../contexts/InvestmentContext';
import { TrendingUp, TrendingDown, DollarSign, Target } from 'lucide-react';

const Dashboard = () => {
  const { ativos, getResumoCarteira, getDistribuicaoTipos } = useInvestment();
  const resumo = getResumoCarteira();
  const distribuicao = getDistribuicaoTipos();

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatPercentage = (value) => {
    return `${value.toFixed(2)}%`;
  };

  // Dados para gráfico de distribuição por tipo
  const tiposData = [
    { name: 'Ações', value: distribuicao.acoes, color: '#3b82f6' },
    { name: 'FIIs', value: distribuicao.fiis, color: '#10b981' }
  ];

  // Dados para gráfico de ativos individuais (top 10)
  const ativosData = ativos
    .sort((a, b) => b.valorAtual - a.valorAtual)
    .slice(0, 10)
    .map(ativo => ({
      codigo: ativo.codigo,
      valor: ativo.valorAtual,
      rentabilidade: ativo.rentabilidade,
      tipo: ativo.tipo
    }));

  // Melhores e piores performers
  const melhoresPerformers = [...ativos]
    .sort((a, b) => b.rentabilidade - a.rentabilidade)
    .slice(0, 5);

  const pioresPerformers = [...ativos]
    .sort((a, b) => a.rentabilidade - b.rentabilidade)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Valor Total Investido */}
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Valor Investido</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(resumo.valorTotalInvestido)}
              </p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Valor Atual */}
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Valor Atual</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(resumo.valorAtualCarteira)}
              </p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 bg-success-100 rounded-lg">
              <Target className="h-6 w-6 text-success-600" />
            </div>
          </div>
        </div>

        {/* Rentabilidade */}
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Rentabilidade</p>
              <p className={`text-2xl font-bold ${
                resumo.rentabilidadeTotal >= 0 ? 'text-success-600' : 'text-danger-600'
              }`}>
                {formatPercentage(resumo.rentabilidadeTotal)}
              </p>
              <p className={`text-sm ${
                resumo.rentabilidadeTotal >= 0 ? 'text-success-600' : 'text-danger-600'
              }`}>
                {formatCurrency(resumo.valorAtualCarteira - resumo.valorTotalInvestido)}
              </p>
            </div>
            <div className={`flex items-center justify-center w-12 h-12 rounded-lg ${
              resumo.rentabilidadeTotal >= 0 ? 'bg-success-100' : 'bg-danger-100'
            }`}>
              {resumo.rentabilidadeTotal >= 0 ? (
                <TrendingUp className="h-6 w-6 text-success-600" />
              ) : (
                <TrendingDown className="h-6 w-6 text-danger-600" />
              )}
            </div>
          </div>
        </div>

        {/* Total Proventos */}
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Proventos Recebidos</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(resumo.totalProventos)}
              </p>
              <p className="text-sm text-gray-500">
                Yield: {formatPercentage(resumo.yieldMedioCarteira)}
              </p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 bg-primary-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-primary-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribuição por Tipo */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribuição por Tipo</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={tiposData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {tiposData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatPercentage(value)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top 10 Ativos */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Maiores Posições</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ativosData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="codigo" />
                <YAxis tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`} />
                <Tooltip 
                  formatter={(value) => [formatCurrency(value), 'Valor']}
                  labelFormatter={(label) => `Ativo: ${label}`}
                />
                <Bar dataKey="valor" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Performance dos Ativos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Melhores Performers */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 text-success-600 mr-2" />
            Melhores Performers
          </h3>
          <div className="space-y-3">
            {melhoresPerformers.map((ativo, index) => (
              <div key={ativo.codigo} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="flex items-center justify-center w-8 h-8 bg-success-100 text-success-600 rounded-full text-sm font-medium">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-medium text-gray-900">{ativo.codigo}</p>
                    <p className="text-sm text-gray-500">{ativo.tipo}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-success-600">
                    +{formatPercentage(ativo.rentabilidade)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatCurrency(ativo.valorAtual)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Piores Performers */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingDown className="h-5 w-5 text-danger-600 mr-2" />
            Piores Performers
          </h3>
          <div className="space-y-3">
            {pioresPerformers.map((ativo, index) => (
              <div key={ativo.codigo} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="flex items-center justify-center w-8 h-8 bg-danger-100 text-danger-600 rounded-full text-sm font-medium">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-medium text-gray-900">{ativo.codigo}</p>
                    <p className="text-sm text-gray-500">{ativo.tipo}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-danger-600">
                    {formatPercentage(ativo.rentabilidade)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatCurrency(ativo.valorAtual)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;