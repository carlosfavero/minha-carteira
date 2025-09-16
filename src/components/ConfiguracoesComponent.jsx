import { useState } from 'react';
import { useInvestment } from '../contexts/InvestmentContext';
import { Settings, Save, Download, Upload, RefreshCw, Trash2 } from 'lucide-react';
import ConfiguracaoAlocacao from './ConfiguracaoAlocacao';

const ConfiguracoesComponent = () => {
  const { ativos, configuracoes: configuracoesGlobais, updateConfiguracoes, recalcularRentabilidades } = useInvestment();
  const [configuracoes, setConfiguracoes] = useState(configuracoesGlobais);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isRecalculating, setIsRecalculating] = useState(false);

  const handleSave = () => {
    updateConfiguracoes(configuracoes);
    alert('Configurações salvas com sucesso!');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setConfiguracoes({
      ...configuracoes,
      [name]: parseFloat(value) || value
    });
  };

  const handleExportData = () => {
    const dataToExport = {
      ativos: ativos,
      configuracoes: configuracoesGlobais,
      exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(dataToExport, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `minha-carteira-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const handleImportData = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (data.ativos && data.configuracoes) {
          // Aqui você implementaria a importação
          alert('Funcionalidade de importação em desenvolvimento!');
        } else {
          alert('Arquivo inválido!');
        }
      } catch (error) {
        alert('Erro ao ler o arquivo!');
      }
    };
    reader.readAsText(file);
  };

  const handleResetData = () => {
    if (showResetConfirm) {
      localStorage.removeItem('investment-data');
      window.location.reload();
    } else {
      setShowResetConfirm(true);
      setTimeout(() => setShowResetConfirm(false), 5000);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Configurações</h2>
        <p className="text-gray-600">Gerencie as configurações da aplicação</p>
      </div>

      {/* Configurações Gerais */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Settings className="h-5 w-5 mr-2" />
          Configurações Gerais
        </h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Percentual Ideal por Ativo (%)
              </label>
              <input
                type="number"
                name="percentualIdealPorAtivo"
                value={configuracoes.percentualIdealPorAtivo}
                onChange={handleChange}
                className="input-field"
                step="0.01"
                min="0"
                max="100"
              />
              <p className="text-xs text-gray-500 mt-1">
                Percentual ideal que cada ativo deve representar na carteira
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Meta de Rentabilidade Anual (%)
              </label>
              <input
                type="number"
                name="metaRentabilidade"
                value={configuracoes.metaRentabilidade}
                onChange={handleChange}
                className="input-field"
                step="0.01"
                min="0"
              />
              <p className="text-xs text-gray-500 mt-1">
                Meta de rentabilidade anual esperada
              </p>
            </div>
          </div>

          <div className="pt-4 flex space-x-4">
            <button onClick={handleSave} className="btn-primary flex items-center space-x-2">
              <Save className="h-4 w-4" />
              <span>Salvar Configurações</span>
            </button>
            
            <button 
              onClick={async () => {
                setIsRecalculating(true);
                try {
                  await recalcularRentabilidades();
                } catch (error) {
                  console.error('Erro ao recalcular rentabilidades:', error);
                  alert('Erro ao recalcular rentabilidades. Tente novamente.');
                } finally {
                  setIsRecalculating(false);
                }
              }} 
              disabled={isRecalculating}
              className={`btn-secondary flex items-center space-x-2 ${isRecalculating ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <RefreshCw className={`h-4 w-4 ${isRecalculating ? 'animate-spin' : ''}`} />
              <span>{isRecalculating ? 'Recalculando...' : 'Recalcular Rentabilidades'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Configuração de Alocação Ideal */}
      <ConfiguracaoAlocacao />

      {/* Backup e Restauração */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Backup e Restauração</h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Exportar Dados</h4>
              <p className="text-sm text-gray-600 mb-3">
                Faça o backup de todos os seus dados em um arquivo JSON.
              </p>
              <button 
                onClick={handleExportData}
                className="btn-primary flex items-center space-x-2 w-full"
              >
                <Download className="h-4 w-4" />
                <span>Exportar Backup</span>
              </button>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Importar Dados</h4>
              <p className="text-sm text-gray-600 mb-3">
                Restaure seus dados a partir de um arquivo de backup.
              </p>
              <label className="btn-secondary flex items-center space-x-2 w-full cursor-pointer">
                <Upload className="h-4 w-4" />
                <span>Importar Backup</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportData}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Estatísticas de Uso */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Estatísticas</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600">{ativos.length}</div>
            <div className="text-sm text-gray-500">Ativos</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-success-600">
              {ativos.reduce((sum, ativo) => sum + ((ativo.operacoes && ativo.operacoes.length) ? ativo.operacoes.length : 0), 0)}
            </div>
            <div className="text-sm text-gray-500">Operações</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-warning-600">
              {ativos.reduce((sum, ativo) => sum + ((ativo.proventos && ativo.proventos.length) ? ativo.proventos.length : 0), 0)}
            </div>
            <div className="text-sm text-gray-500">Proventos</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {Object.keys(localStorage).filter(key => key.startsWith('investment')).length}
            </div>
            <div className="text-sm text-gray-500">Itens Salvos</div>
          </div>
        </div>
      </div>

      {/* Zona de Perigo */}
      <div className="card border border-danger-200">
        <h3 className="text-lg font-semibold text-danger-900 mb-4">Zona de Perigo</h3>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-danger-900 mb-2">Limpar Todos os Dados</h4>
            <p className="text-sm text-danger-700 mb-3">
              ⚠️ Esta ação irá remover permanentemente todos os seus dados. 
              Faça um backup antes de prosseguir.
            </p>
            <button 
              onClick={handleResetData}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                showResetConfirm 
                  ? 'bg-danger-600 hover:bg-danger-700 text-white' 
                  : 'bg-danger-100 hover:bg-danger-200 text-danger-800'
              }`}
            >
              <Trash2 className="h-4 w-4" />
              <span>
                {showResetConfirm ? 'Confirmar Exclusão' : 'Limpar Dados'}
              </span>
            </button>
            {showResetConfirm && (
              <p className="text-xs text-danger-600 mt-2">
                Clique novamente para confirmar a exclusão (5s restantes)
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Overlay de Loading para Recálculo */}
      {isRecalculating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-sm mx-4 text-center">
            <div className="flex justify-center mb-4">
              <RefreshCw className="h-12 w-12 text-blue-600 animate-spin" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Recalculando Rentabilidades
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Aguarde enquanto recalculamos as rentabilidades de todos os ativos...
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{width: '100%'}}></div>
            </div>
          </div>
        </div>
      )}

      {/* Informações da Aplicação */}
      <div className="card bg-gray-50">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Sobre a Aplicação</h3>
        
        <div className="space-y-2 text-sm text-gray-600">
          <p><strong>Versão:</strong> 1.0.0</p>
          <p><strong>Última Atualização:</strong> {new Date().toLocaleDateString('pt-BR')}</p>
          <p><strong>Tecnologias:</strong> React, Vite, Tailwind CSS, Recharts</p>
          <p><strong>Armazenamento:</strong> Local (localStorage)</p>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Desenvolvido com ❤️ para a comunidade de investidores brasileiros
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConfiguracoesComponent;