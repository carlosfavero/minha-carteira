import React from 'react';
import { TrendingUp, TrendingDown, Target, DollarSign } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

const SugestaoRebalanceamento = ({ valorAporte, sugestoes }) => {
  if (!sugestoes || sugestoes.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 text-center">
        <Target className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma sugestão disponível</h3>
        <p className="text-gray-600">
          Configure a alocação ideal ou adicione ativos para receber sugestões de rebalanceamento.
        </p>
      </div>
    );
  }

  const totalRecomendado = sugestoes.reduce((sum, sugestao) => sum + sugestao.recomendacao, 0);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Target className="h-5 w-5 mr-2 text-blue-600" />
              Sugestão de Rebalanceamento
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Aporte de {formatCurrency(valorAporte)} • Total recomendado: {formatCurrency(totalRecomendado)}
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Diferença</div>
            <div className={`text-lg font-semibold ${valorAporte - totalRecomendado >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(valorAporte - totalRecomendado)}
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ativo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Classe
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                % Atual
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                % Ideal
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cotação
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Preço Médio
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sugestão
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sugestoes.map((sugestao, index) => (
              <tr key={sugestao.ticker} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="text-sm font-medium text-gray-900">{sugestao.ticker}</div>
                    {sugestao.cotacaoAtual < sugestao.precoMedio && (
                      <TrendingDown className="ml-2 h-4 w-4 text-red-500" title="Cotação abaixo do preço médio" />
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    sugestao.classe === 'acoes'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {sugestao.classe === 'acoes' ? 'AÇÕES' : 'FIIs'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {sugestao.percentualAtual.toFixed(1)}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {sugestao.percentualIdeal.toFixed(1)}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatCurrency(sugestao.cotacaoAtual)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {sugestao.precoMedio ? formatCurrency(sugestao.precoMedio) : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="text-sm font-semibold text-green-600">
                      {formatCurrency(sugestao.recomendacao)}
                    </span>
                    {sugestao.recomendacao > 0 && (
                      <TrendingUp className="ml-2 h-4 w-4 text-green-500" />
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalRecomendado > 0 && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-gray-700">Resumo da Sugestão:</span>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">
                {sugestoes.length} ativo{sugestoes.length !== 1 ? 's' : ''} sugerido{sugestoes.length !== 1 ? 's' : ''}
              </span>
              <span className="font-semibold text-gray-900">
                Total: {formatCurrency(totalRecomendado)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SugestaoRebalanceamento;