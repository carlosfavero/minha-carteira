# 📈 Minha Carteira - Sistema de Controle de Investimentos

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)

Uma aplicação web completa em ReactJS para controle e acompanhamento de investimentos em ações e FIIs (Fundos Imobiliários) com funcionalidades de registro de operações, proventos e dashboard analítico.

## ✨ Funcionalidades

### 🎯 Dashboard Principal
- **Resumo Geral**: Valor investido, valor atual, rentabilidade total e proventos recebidos
- **Distribuição da Carteira**: Gráficos de pizza para visualizar ações vs FIIs
- **Performance**: Melhores e piores performers da carteira
- **Análises Visuais**: Gráficos interativos com Recharts

### 💼 Gestão de Ativos
- ✅ Adicionar novos ativos (ações/FIIs)
- ✅ Visualizar lista completa com filtros e ordenação
- ✅ Editar informações dos ativos
- ✅ Excluir ativos da carteira
- ✅ Categorização automática por tipo

### 📊 Registro de Operações
- ✅ **Compras**: Data, quantidade, preço, corretagem
- ✅ **Vendas**: Data, quantidade, preço, corretagem
- ✅ Cálculo automático do preço médio
- ✅ Histórico completo de operações

### 💰 Controle de Proventos
- 🚧 Dividendos (ações)
- 🚧 Rendimentos (FIIs)
- 🚧 Juros sobre Capital Próprio (JCP)
- 🚧 Cálculo automático do Dividend Yield

### 📈 Análises e Relatórios
- 🚧 Sugestões de rebalanceamento
- 🚧 Simulador de aportes
- 🚧 Comparação com benchmarks
- 🚧 Relatórios específicos por tipo de ativo

## 🚀 Tecnologias Utilizadas

- **[React 18](https://reactjs.org/)** - Biblioteca para construção de interfaces
- **[Vite](https://vitejs.dev/)** - Build tool rápida e moderna
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework CSS utilitário
- **[Recharts](https://recharts.org/)** - Biblioteca de gráficos para React
- **[Lucide React](https://lucide.dev/)** - Ícones SVG modernos
- **[Date-fns](https://date-fns.org/)** - Biblioteca para manipulação de datas

## 🛠️ Instalação e Configuração

### Pré-requisitos
- Node.js (versão 18 ou superior)
- npm ou yarn

### Passos para instalação

1. **Clone o repositório**
   ```bash
   git clone https://github.com/seu-usuario/minha-carteira.git
   cd minha-carteira
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Execute o projeto**
   ```bash
   npm run dev
   ```

4. **Acesse a aplicação**
   Abra [http://localhost:5173](http://localhost:5173) no seu navegador

## 📱 Como Usar

### 1. Dashboard
- Visualize o resumo geral da sua carteira
- Acompanhe gráficos de distribuição e performance
- Monitore os melhores e piores performers

### 2. Adicionando um Ativo
1. Vá para a seção "Meus Ativos"
2. Clique em "Adicionar Ativo"
3. Preencha as informações:
   - Código do ativo (ex: VALE3, BTLG11)
   - Tipo (Ação ou FII)
   - Quantidade comprada
   - Preço de compra
   - Cotação atual
   - Corretagem (opcional)
   - Data da compra

### 3. Registrando Operações
1. Vá para a seção "Operações"
2. Clique em "Nova Operação"
3. Selecione o ativo e preencha os dados da operação
4. O sistema calculará automaticamente o novo preço médio

### 4. Acompanhando Performance
- **Rentabilidade**: Calculada automaticamente com base no valor investido vs valor atual
- **Dividend Yield**: Calculado com base nos proventos recebidos
- **Percentual da Carteira**: Distribuição de cada ativo na carteira

## 🗂️ Estrutura do Projeto

```
src/
├── components/           # Componentes React
│   ├── Header.jsx       # Cabeçalho com resumo rápido
│   ├── Sidebar.jsx      # Menu de navegação lateral
│   ├── Dashboard.jsx    # Dashboard principal
│   ├── AtivosTable.jsx  # Tabela de ativos
│   ├── OperacoesForm.jsx # Formulário de operações
│   └── AddAtivoModal.jsx # Modal para adicionar ativos
├── contexts/            # Contexts do React
│   └── InvestmentContext.jsx # Context global dos investimentos
├── App.jsx             # Componente principal
├── main.jsx           # Ponto de entrada da aplicação
└── index.css          # Estilos globais
```

## 💾 Armazenamento de Dados

Os dados são armazenados localmente no **localStorage** do navegador, incluindo:
- Lista de ativos
- Histórico de operações
- Registros de proventos
- Configurações do usuário

> **Nota**: Para backup dos dados, você pode exportar/importar via JSON (funcionalidade em desenvolvimento)

## 🎨 Interface e Design

### Design System
- **Cores**: 
  - Verde para lucros e valores positivos
  - Vermelho para prejuízos e valores negativos
  - Azul para elementos neutros e primários
- **Layout**: Responsivo e otimizado para desktop e mobile
- **Tipografia**: Hierarquia clara com números destacados
- **Componentes**: Reutilizáveis e consistentes

### Responsividade
- ✅ Desktop (1024px+)
- ✅ Tablet (768px - 1023px)
- ✅ Mobile (até 767px)

## 🔮 Roadmap

### Próximas Funcionalidades
- [ ] 📊 Módulo completo de proventos
- [ ] 🔄 Sugestões de rebalanceamento inteligente
- [ ] 📈 Comparação com índices (IBOV, IFIX)
- [ ] 💱 Calculadora de IR para vendas
- [ ] 📤 Export/Import de dados (CSV/JSON)
- [ ] 🔔 Notificações de eventos importantes
- [ ] 📱 Aplicativo mobile (React Native)
- [ ] 🔐 Autenticação e sincronização na nuvem

### Melhorias Técnicas
- [ ] 🧪 Testes unitários e de integração
- [ ] 🚀 Deploy automatizado
- [ ] 📊 Analytics de uso
- [ ] ♿ Melhorias de acessibilidade
- [ ] 🌍 Internacionalização (i18n)

## 🤝 Contribuindo

Contribuições são sempre bem-vindas! Para contribuir:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🙏 Agradecimentos

- [React Team](https://reactjs.org/) pela excelente biblioteca
- [Tailwind CSS](https://tailwindcss.com/) pelo framework CSS incrível
- [Recharts](https://recharts.org/) pelas visualizações de dados
- [Lucide](https://lucide.dev/) pelos ícones bonitos e consistentes

---

⭐ **Se este projeto foi útil para você, considere dar uma estrela!**

📧 **Dúvidas ou sugestões?** Abra uma [issue](https://github.com/seu-usuario/minha-carteira/issues) ou entre em contato.

---

**Desenvolvido com ❤️ para a comunidade de investidores brasileiros**+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
