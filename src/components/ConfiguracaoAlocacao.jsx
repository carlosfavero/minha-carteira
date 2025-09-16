import React, { useState, useEffect } from 'react';
import { Settings, Save, RefreshCw, TrendingUp, TrendingDown } from 'lucide-react';
import { useInvestment } from '../contexts/InvestmentContext';
import { formatCurrency } from '../utils/formatters';

const ConfiguracaoAlocacao = () => {
  const { alocacaoIdeal, setAlocacaoIdeal, ativos } = useInvestment();

  // Estado local para edição
  const [configuracao, setConfiguracao] = useState({
    acoes: 60,
    fiis: 40,
    ativos: {}
  });

  // Estado para controlar se está editando
  const [isEditing, setIsEditing] = useState(false);

  // Carrega configuração existente ao montar
  useEffect(() => {
    if (alocacaoIdeal) {
      setConfiguracao(alocacaoIdeal);
    }
  }, [alocacaoIdeal]);

  // Função para lidar com mudança nos percentuais das classes
  const handleClasseChange = (classe, valor) => {
    const novoValor = Math.max(0, Math.min(100, parseFloat(valor) || 0));
    const outraClasse = classe === 'acoes' ? 'fiis' : 'acoes';
    const outroValor = 100 - novoValor;

    setConfiguracao(prev => ({
      ...prev,
      [classe]: novoValor,
      [outraClasse]: outroValor
    }));
  };

  // Função para lidar com mudança nos percentuais dos ativos
  const handleAtivoChange = (ticker, valor) => {
    const novoValor = Math.max(0, Math.min(100, parseFloat(valor) || 0));

    setConfiguracao(prev => ({
      ...prev,
      ativos: {
        ...prev.ativos,
        [ticker]: novoValor
      }
    }));
  };

  // Função para salvar configuração
  const handleSalvar = () => {
    setAlocacaoIdeal(configuracao);
    setIsEditing(false);
  };

  // Função para cancelar edição
  const handleCancelar = () => {
    if (alocacaoIdeal) {
      setConfiguracao(alocacaoIdeal);
    } else {
      setConfiguracao({
        acoes: 60,
        fiis: 40,
        ativos: {}
      });
    }
    setIsEditing(false);
  };

  // Função para resetar para valores padrão
  const handleResetar = () => {
    const defaultConfig = {
      acoes: 60,
      fiis: 40,
      ativos: {}
    };
    setConfiguracao(defaultConfig);
    setAlocacaoIdeal(defaultConfig);
  };

  // Agrupar ativos por classe
  const ativosPorClasse = ativos.reduce((acc, ativo) => {
    const classe = ativo.classe || 'acoes';
    if (!acc[classe]) {
      acc[classe] = [];
    }
    // Garantir que o ativo tenha a propriedade ticker
    const ativoComTicker = {
      ...ativo,
      ticker: ativo.ticker || ativo.codigo || 'UNKNOWN'
    };
    acc[classe].push(ativoComTicker);
    return acc;
  }, {});

  // Calcular distribuição atual dos ativos
  const distribuicaoAtual = ativos.reduce((acc, ativo) => {
    const ticker = ativo.ticker || ativo.codigo || 'UNKNOWN';
    const valorTotal = ativos.reduce((sum, a) => sum + (a.quantidade * a.precoMedio), 0);
    if (valorTotal > 0) {
      const percentual = (ativo.quantidade * ativo.precoMedio) / valorTotal * 100;
      acc[ticker] = percentual;
    }
    return acc;
  }, {});

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Settings className="h-5 w-5 mr-2 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Configuração de Alocação Ideal</h3>
          </div>
          <div className="flex items-center space-x-2">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="btn-secondary flex items-center"
              >
                <Settings className="h-4 w-4 mr-2" />
                Configurar
              </button>
            ) : (
              <>
                <button
                  onClick={handleCancelar}
                  className="btn-secondary"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSalvar}
                  className="btn-primary flex items-center"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Salvar
                </button>
              </>
            )}
            <button
              onClick={handleResetar}
              className="btn-outline flex items-center"
              title="Resetar para valores padrão"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Configuração por Classe */}
        <div>
          <h4 className="text-md font-semibold text-gray-900 mb-4">Alocação por Classe de Ativo</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-blue-900">AÇÕES</span>
                <div className="flex items-center">
                  {isEditing ? (
                    <input
                      type="number"
                      value={configuracao.acoes}
                      onChange={(e) => handleClasseChange('acoes', e.target.value)}
                      className="w-16 text-right border border-blue-300 rounded px-2 py-1 text-sm"
                      min="0"
                      max="100"
                      step="1"
                    />
                  ) : (
                    <span className="text-lg font-bold text-blue-900">{configuracao.acoes}%</span>
                  )}
                </div>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${configuracao.acoes}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-green-900">FIIs</span>
                <div className="flex items-center">
                  {isEditing ? (
                    <input
                      type="number"
                      value={configuracao.fiis}
                      onChange={(e) => handleClasseChange('fiis', e.target.value)}
                      className="w-16 text-right border border-green-300 rounded px-2 py-1 text-sm"
                      min="0"
                      max="100"
                      step="1"
                    />
                  ) : (
                    <span className="text-lg font-bold text-green-900">{configuracao.fiis}%</span>
                  )}
                </div>
              </div>
              <div className="w-full bg-green-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${configuracao.fiis}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Configuração por Ativo */}
        {Object.keys(ativosPorClasse).length > 0 && (
          <div>
            <h4 className="text-md font-semibold text-gray-900 mb-4">Alocação por Ativo Específico</h4>
            <div className="space-y-4">
              {Object.entries(ativosPorClasse).map(([classe, ativosDaClasse]) => (
                <div key={classe} className="border border-gray-200 rounded-lg p-4">
                  <h5 className="text-sm font-medium text-gray-700 mb-3 capitalize">
                    {classe === 'acoes' ? 'Ações' : 'FIIs'}
                  </h5>
                  <div className="space-y-3">
                    {ativosDaClasse.map((ativo) => {
                      const percentualIdeal = configuracao.ativos[ativo.ticker] || 0;
                      const percentualAtual = distribuicaoAtual[ativo.ticker] || 0;
                      const diferenca = percentualIdeal - percentualAtual;

                      return (
                        <div key={ativo.ticker} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <span className="font-medium text-gray-900">{ativo.ticker}</span>
                            <div className="flex items-center space-x-2">
                              <span className="text-xs text-gray-500">
                                Atual: {percentualAtual.toFixed(1)}%
                              </span>
                              {diferenca !== 0 && (
                                <div className={`flex items-center ${diferenca > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                  {diferenca > 0 ? (
                                    <TrendingUp className="h-3 w-3 mr-1" />
                                  ) : (
                                    <TrendingDown className="h-3 w-3 mr-1" />
                                  )}
                                  <span className="text-xs">
                                    {diferenca > 0 ? '+' : ''}{diferenca.toFixed(1)}%
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {isEditing ? (
                              <input
                                type="number"
                                value={percentualIdeal}
                                onChange={(e) => handleAtivoChange(ativo.ticker, e.target.value)}
                                className="w-16 text-right border border-gray-300 rounded px-2 py-1 text-sm"
                                min="0"
                                max="100"
                                step="0.1"
                                placeholder="0.0"
                              />
                            ) : (
                              <span className="text-sm font-medium text-gray-900">
                                {percentualIdeal > 0 ? `${percentualIdeal}%` : 'Não definido'}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Resumo */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h5 className="text-sm font-medium text-gray-700 mb-2">Resumo da Configuração</h5>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Total Ações:</span>
              <span className="ml-2 font-medium">{configuracao.acoes}%</span>
            </div>
            <div>
              <span className="text-gray-600">Total FIIs:</span>
              <span className="ml-2 font-medium">{configuracao.fiis}%</span>
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            {configuracao.acoes + configuracao.fiis === 100
              ? '✅ Configuração válida (total = 100%)'
              : '⚠️ Configuração inválida (total ≠ 100%)'
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfiguracaoAlocacao;