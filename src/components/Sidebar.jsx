import { useState } from 'react';
import { 
  LayoutDashboard, 
  TrendingUp, 
  PlusCircle, 
  DollarSign, 
  BarChart3, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Wallet
} from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      description: 'Visão geral da carteira'
    },
    {
      id: 'ativos',
      label: 'Meus Ativos',
      icon: TrendingUp,
      description: 'Lista de todos os ativos'
    },
    {
      id: 'operacoes',
      label: 'Operações',
      icon: PlusCircle,
      description: 'Registrar compras e vendas'
    },
    {
      id: 'proventos',
      label: 'Proventos',
      icon: DollarSign,
      description: 'Dividendos e rendimentos'
    },
    {
      id: 'aportes',
      label: 'Aportes',
      icon: Wallet,
      description: 'Aportes e retiradas'
    },
    {
      id: 'analises',
      label: 'Análises',
      icon: BarChart3,
      description: 'Relatórios e análises'
    },
    {
      id: 'configuracoes',
      label: 'Configurações',
      icon: Settings,
      description: 'Configurações gerais'
    }
  ];

  return (
    <div className={`bg-white shadow-lg transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      <div className="flex flex-col h-full">
        {/* Header do Sidebar */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {!isCollapsed && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
              <p className="text-sm text-gray-500">Navegação</p>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight className="h-5 w-5 text-gray-600" />
            ) : (
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            )}
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-left transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
                title={isCollapsed ? item.label : ''}
              >
                <Icon className={`h-5 w-5 flex-shrink-0 ${
                  isActive ? 'text-blue-700' : 'text-gray-500'
                }`} />
                
                {!isCollapsed && (
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.label}</p>
                    <p className="text-xs text-gray-500 truncate">{item.description}</p>
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        {!isCollapsed && (
          <div className="p-4 border-t border-gray-200">
            <div className="bg-blue-50 rounded-lg p-3">
              <h3 className="text-sm font-medium text-blue-900">Dica</h3>
              <p className="text-xs text-blue-700 mt-1">
                Mantenha seus dados sempre atualizados para análises precisas.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;