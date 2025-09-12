import { useInvestment } from '../contexts/InvestmentContext';
import { BarChart3, PieChart, TrendingUp, Target, Calculator, DollarSign } from 'lucide-react';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const AnalisesComponent = () => {
  const { state, computed } = useInvestment();
  const resumo = computed.getResumoCarteira();
  const distribuicao = computed.getDistribuicaoTipos();

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatPercentage = (value) => {
    return `${value.toFixed(2)}%`;
  };

  // Análise de concentração
  const concentracaoAtivos = state.ativos
    .map(ativo => ({
      codigo: ativo.codigo,
      percentual: resumo.valorAtualCarteira > 0 ? (ativo.valorAtual / resumo.valorAtualCarteira) * 100 : 0,
      valor: ativo.valorAtual,
      tipo: ativo.tipo
    }))
    .sort((a, b) => b.percentual - a.percentual);

  // Dados para gráfico de concentração
  const concentracaoData = concentracaoAtivos.slice(0, 10);

  // Análise de performance por setor (simplificada)
  const performanceData = state.ativos.map(ativo => ({
    codigo: ativo.codigo,
    rentabilidade: ativo.rentabilidade,
    valor: ativo.valorAtual,
    tipo: ativo.tipo
  })).sort((a, b) => b.rentabilidade - a.rentabilidade);

  // Sugestões de rebalanceamento
  const sugestoesRebalanceamento = state.ativos
    .filter(ativo => {
      const percentualAtual = resumo.valorAtualCarteira > 0 ? (ativo.valorAtual / resumo.valorAtualCarteira) * 100 : 0;
      return percentualAtual > 10 || percentualAtual < 1; // Muito concentrado ou muito diluído
    })
    .map(ativo => {
      const percentualAtual = resumo.valorAtualCarteira > 0 ? (ativo.valorAtual / resumo.valorAtualCarteira) * 100 : 0;
      return {
        ...ativo,
        percentualAtual,
        sugestao: percentualAtual > 10 ? 'REDUZIR' : 'AUMENTAR',
        motivo: percentualAtual > 10 ? 'Concentração excessiva' : 'Posição muito pequena'
      };
    });

  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Análises Avançadas</h2>
        <p className="text-gray-600">Insights e sugestões para sua carteira</p>
      </div>

      {/* Cards de Análise Rápida */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Diversificação</p>
              <p className="text-2xl font-bold text-gray-900">{state.ativos.length}</p>
              <p className="text-sm text-gray-500">Ativos diferentes</p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 bg-primary-100 rounded-lg">
              <PieChart className="h-6 w-6 text-primary-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Maior Posição</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatPercentage(concentracaoAtivos[0]?.percentual || 0)}
              </p>
              <p className="text-sm text-gray-500">{concentracaoAtivos[0]?.codigo || 'N/A'}</p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 bg-warning-100 rounded-lg">
              <Target className="h-6 w-6 text-warning-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Yield Médio</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatPercentage(resumo.yieldMedioCarteira)}
              </p>
              <p className="text-sm text-gray-500">Anualizado</p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 bg-success-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-success-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Score Carteira</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.min(100, Math.max(0, 50 + resumo.rentabilidadeTotal * 2)).toFixed(0)}
              </p>
              <p className="text-sm text-gray-500">De 100 pontos</p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 bg-primary-100 rounded-lg">
              <BarChart3 className="h-6 w-6 text-primary-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos de Análise */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Concentração da Carteira */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Concentração por Ativo</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={concentracaoData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="percentual"
                  nameKey="codigo"
                >
                  {concentracaoData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatPercentage(value)} />
                <Legend />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Performance por Ativo */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance dos Ativos</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="codigo" />
                <YAxis tickFormatter={(value) => `${value}%`} />
                <Tooltip 
                  formatter={(value) => [formatPercentage(value), 'Rentabilidade']}
                  labelFormatter={(label) => `Ativo: ${label}`}
                />
                <Bar 
                  dataKey="rentabilidade" 
                  fill={(entry) => entry >= 0 ? '#10b981' : '#ef4444'}
                  name="Rentabilidade (%)"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Sugestões de Rebalanceamento */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Calculator className="h-5 w-5 mr-2" />
          Sugestões de Rebalanceamento
        </h3>
        
        {sugestoesRebalanceamento.length === 0 ? (
          <div className="text-center py-8">
            <Target className="mx-auto h-12 w-12 text-green-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Carteira bem balanceada!</h3>
            <p className="mt-1 text-sm text-gray-500">
              Sua carteira está com uma distribuição adequada entre os ativos.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {sugestoesRebalanceamento.map((ativo, index) => (
              <div key={ativo.codigo} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${
                    ativo.sugestao === 'REDUZIR' ? 'bg-warning-100' : 'bg-success-100'
                  }`}>
                    <TrendingUp className={`h-5 w-5 ${
                      ativo.sugestao === 'REDUZIR' ? 'text-warning-600' : 'text-success-600'
                    }`} />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">{ativo.codigo}</span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        ativo.sugestao === 'REDUZIR' 
                          ? 'bg-warning-100 text-warning-800' 
                          : 'bg-success-100 text-success-800'
                      }`}>
                        {ativo.sugestao}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">{ativo.motivo}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">
                    {formatPercentage(ativo.percentualAtual)}
                  </p>
                  <p className="text-sm text-gray-500">da carteira</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Análise de Risco */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Análise de Risco</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto bg-primary-100 rounded-full flex items-center justify-center mb-3">
              <span className="text-2xl font-bold text-primary-600">
                {((distribuicao.acoes / 100) * 10).toFixed(1)}
              </span>
            </div>
            <h4 className="font-medium text-gray-900">Risco de Ações</h4>
            <p className="text-sm text-gray-500">{formatPercentage(distribuicao.acoes)} da carteira</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 mx-auto bg-success-100 rounded-full flex items-center justify-center mb-3">
              <span className="text-2xl font-bold text-success-600">
                {((distribuicao.fiis / 100) * 5).toFixed(1)}
              </span>
            </div>
            <h4 className="font-medium text-gray-900">Risco de FIIs</h4>
            <p className="text-sm text-gray-500">{formatPercentage(distribuicao.fiis)} da carteira</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 mx-auto bg-warning-100 rounded-full flex items-center justify-center mb-3">
              <span className="text-2xl font-bold text-warning-600">
                {(((distribuicao.acoes * 10) + (distribuicao.fiis * 5)) / 100).toFixed(1)}
              </span>
            </div>
            <h4 className="font-medium text-gray-900">Risco Total</h4>
            <p className="text-sm text-gray-500">Score ponderado</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalisesComponent;