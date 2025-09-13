import { useState } from 'react';
import { InvestmentProvider } from './contexts/InvestmentContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import AtivosTable from './components/AtivosTable';
import OperacoesForm from './components/OperacoesForm';
import ProventosComponent from './components/ProventosComponent';
import AportesComponent from './components/AportesComponent';
import AnalisesComponent from './components/AnalisesComponent';
import ConfiguracoesComponent from './components/ConfiguracoesComponent';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'ativos':
        return <AtivosTable />;
      case 'operacoes':
        return <OperacoesForm />;
      case 'proventos':
        return <ProventosComponent />;
      case 'aportes':
        return <AportesComponent />;
      case 'analises':
        return <AnalisesComponent />;
      case 'configuracoes':
        return <ConfiguracoesComponent />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <InvestmentProvider>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
              {renderContent()}
            </div>
          </main>
        </div>
      </div>
    </InvestmentProvider>
  );
}

export default App;
