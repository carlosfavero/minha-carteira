import React, { useState, useEffect, useMemo, useRef, Fragment } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ArrowDownToLine, ArrowUpFromLine, Calendar, Edit, MoreHorizontal, Plus, Search, Trash2, X } from 'lucide-react';
import { useInvestment } from '../contexts/InvestmentContext';
import { formatCurrency } from '../utils/formatters';
import { Dialog, Transition } from '@headlessui/react';

// Constante para as opções de origem
const ORIGENS = ['CARLOS', 'GABRIELA'];
// Constante para tipos de movimentação
const TIPOS = ['APORTE', 'RETIRADA'];

// Componente Modal interno para evitar problemas de importação
const AporteModal = ({ isOpen, onClose, title, children }) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 flex justify-between items-center"
                >
                  {title}
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-500 rounded-full p-1 hover:bg-gray-100 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </Dialog.Title>
                <div className="mt-4">
                  {children}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

const AportesComponent = () => {
  const { aportes = [], addAporte, updateAporte, removeAporte } = useInvestment() || {};
  
  // Estado para o modal
  const [isOpen, setIsOpen] = useState(false);
  
  // Estados para o formulário
  const [formData, setFormData] = useState({
    data: new Date().toISOString().split('T')[0],
    tipo: 'APORTE',
    origem: 'CARLOS',
    valor: '',
  });
  
  // Estado para modo de edição
  const [editingId, setEditingId] = useState(null);
  
  // Referência para o input de valor para foco automático
  const valorInputRef = useRef(null);
  
  // Função para resetar o formulário
  const resetForm = () => {
    setFormData({
      data: new Date().toISOString().split('T')[0],
      tipo: 'APORTE',
      origem: 'CARLOS',
      valor: '',
    });
    setEditingId(null);
  };
  
  // Função para formatar a data
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  };

  // Função para formatar a data em formato curto
  const formatShortDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, "dd/MM/yyyy", { locale: ptBR });
  };
  
  // Função para lidar com a mudança no formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  // Função para lidar com o envio do formulário
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.data || !formData.valor || parseFloat(formData.valor) <= 0) {
      alert('Por favor, preencha todos os campos corretamente.');
      return;
    }
    
    const aporteData = {
      ...formData,
      valor: parseFloat(formData.valor),
      data: formData.data,
    };
    
    if (editingId !== null) {
      updateAporte({ ...aporteData, id: editingId });
    } else {
      addAporte(aporteData);
    }
    
    resetForm();
    setIsOpen(false);
  };
  
  // Função para editar um aporte
  const handleEditAporte = (aporte) => {
    setFormData({
      data: aporte.data,
      tipo: aporte.tipo,
      origem: aporte.origem,
      valor: aporte.valor.toString(),
    });
    setEditingId(aporte.id);
    setIsOpen(true);
  };
  
  // Função para remover um aporte
  const handleRemoveAporte = (aporte) => {
    if (window.confirm(`Tem certeza que deseja excluir este ${aporte.tipo === 'APORTE' ? 'aporte' : 'retirada'}?`)) {
      removeAporte(aporte.id);
    }
  };
  
  // Limpar o estado de edição ao fechar o modal
  useEffect(() => {
    if (!isOpen) {
      resetForm();
    } else if (valorInputRef.current) {
      setTimeout(() => valorInputRef.current.focus(), 100);
    }
  }, [isOpen]);

  // Agrupamento de aportes por data
  const aportesAgrupados = useMemo(() => {
    // Primeiro ordenamos por data (mais recente primeiro)
    const sortedAportes = [...aportes].sort((a, b) => 
      new Date(b.data) - new Date(a.data)
    );
    
    // Criamos um mapa para agrupar por data
    const groups = {};
    
    sortedAportes.forEach((aporte, index) => {
      const date = formatDate(aporte.data);
      if (!groups[date]) {
        groups[date] = {
          data: date,
          aportes: []
        };
      }
      
      groups[date].aportes.push({
        ...aporte,
        listIndex: index
      });
    });
    
    // Convertemos o mapa para array e ordenamos por data
    return Object.values(groups);
  }, [aportes]);
  
  // Cálculo do saldo total
  const saldoTotal = useMemo(() => {
    return aportes.reduce((acc, aporte) => {
      if (aporte.tipo === 'APORTE') {
        return acc + aporte.valor;
      } else {
        return acc - aporte.valor;
      }
    }, 0);
  }, [aportes]);
  
  // Cálculo dos totais por origem
  const totaisPorOrigem = useMemo(() => {
    const origens = ['CARLOS', 'GABRIELA'];
    const result = origens.map(origem => {
      const entradas = aportes.filter(a => a.origem === origem && a.tipo === 'APORTE').reduce((acc, a) => acc + a.valor, 0);
      const retiradas = aportes.filter(a => a.origem === origem && a.tipo === 'RETIRADA').reduce((acc, a) => acc + a.valor, 0);
      return {
        nome: origem,
        entradas,
        retiradas,
        saldo: entradas - retiradas
      };
    });
    // Outros
    const entradasOutros = aportes.filter(a => !origens.includes(a.origem) && a.tipo === 'APORTE').reduce((acc, a) => acc + a.valor, 0);
    const retiradasOutros = aportes.filter(a => !origens.includes(a.origem) && a.tipo === 'RETIRADA').reduce((acc, a) => acc + a.valor, 0);
    result.push({
      nome: 'OUTROS',
      entradas: entradasOutros,
      retiradas: retiradasOutros,
      saldo: entradasOutros - retiradasOutros
    });
    return result;
  }, [aportes]);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Aportes e Retiradas</h1>
          <p className="text-gray-600">
            Gerencie o fluxo de caixa da sua conta na corretora
          </p>
        </div>
        <div className="flex items-center mt-4 md:mt-0">
          <div className="bg-white shadow rounded-lg px-4 py-3 mr-4">
            <span className="block text-sm text-gray-500">Saldo Total</span>
            <span className={`text-lg font-semibold ${saldoTotal >= 0 ? 'text-success-600' : 'text-red-600'}`}>
              {formatCurrency(saldoTotal)}
            </span>
          </div>
          <button
            className="btn-primary flex items-center"
            onClick={() => setIsOpen(true)}
          >
            <Plus className="mr-2 h-5 w-5" />
            Novo Registro
          </button>
        </div>
      </div>
      
      {/* Cards de totais por origem */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {totaisPorOrigem.map(card => (
          <div key={card.nome} className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{card.nome}</h3>
              <p className={`text-xl font-bold ${card.saldo >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(card.saldo)}
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Entradas</span>
                <span className="text-sm text-gray-900">{formatCurrency(card.entradas)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Retiradas</span>
                <span className="text-sm text-gray-900">{formatCurrency(card.retiradas)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Lista de Aportes */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Histórico de Movimentações</h3>
        
        {aportes.length === 0 ? (
          <div className="text-center py-12">
            <ArrowDownToLine className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma movimentação registrada</h3>
            <p className="mt-1 text-sm text-gray-500">
              Comece registrando seus aportes e retiradas.
            </p>
            <div className="mt-6">
              <button 
                onClick={() => setIsOpen(true)}
                className="btn-primary"
              >
                Registrar Primeiro Aporte
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {aportesAgrupados.map((grupo, grupoIndex) => (
              <div key={grupoIndex} className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                  <h5 className="text-sm font-medium text-gray-900 flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                    {grupo.data}
                  </h5>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Origem</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {grupo.aportes.map((aporte) => (
                        <tr key={aporte.listIndex} className="hover:bg-gray-50">
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                            {formatShortDate(aporte.data)}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              aporte.tipo === 'APORTE' 
                                ? 'bg-success-100 text-success-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              <span className="mr-1">
                                {aporte.tipo === 'APORTE' ? (
                                  <ArrowDownToLine className="h-3 w-3" />
                                ) : (
                                  <ArrowUpFromLine className="h-3 w-3" />
                                )}
                              </span>
                              {aporte.tipo}
                            </span>
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {aporte.origem}
                            </span>
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                            {formatCurrency(aporte.valor)}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEditAporte(aporte)}
                                className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-full transition-colors"
                                title="Editar registro"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleRemoveAporte(aporte)}
                                className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-full transition-colors"
                                title="Remover registro"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Modal para adicionar/editar aporte */}
      <AporteModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={editingId ? 'Editar Movimentação' : 'Nova Movimentação'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="data" className="block text-sm font-medium text-gray-700 mb-1">
              Data
            </label>
            <input
              type="date"
              id="data"
              name="data"
              value={formData.data}
              onChange={handleChange}
              className="input-field w-full"
              required
            />
          </div>
          
          <div>
            <label htmlFor="tipo" className="block text-sm font-medium text-gray-700 mb-1">
              Tipo
            </label>
            <select
              id="tipo"
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              className="input-field w-full"
              required
            >
              {TIPOS.map(tipo => (
                <option key={tipo} value={tipo}>{tipo}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="origem" className="block text-sm font-medium text-gray-700 mb-1">
              Origem
            </label>
            <select
              id="origem"
              name="origem"
              value={formData.origem}
              onChange={handleChange}
              className="input-field w-full"
              required
            >
              {ORIGENS.map(origem => (
                <option key={origem} value={origem}>{origem}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="valor" className="block text-sm font-medium text-gray-700 mb-1">
              Valor (R$)
            </label>
            <input
              ref={valorInputRef}
              type="number"
              id="valor"
              name="valor"
              value={formData.valor}
              onChange={handleChange}
              min="0.01"
              step="0.01"
              placeholder="0.00"
              className="input-field w-full"
              required
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="btn-secondary"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              {editingId ? 'Atualizar' : 'Adicionar'}
            </button>
          </div>
        </form>
      </AporteModal>
    </div>
  );
};

export default AportesComponent;