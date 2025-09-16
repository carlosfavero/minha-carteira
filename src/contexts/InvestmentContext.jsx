import { createContext, useContext, useReducer, useEffect } from 'react';

// Dados iniciais de exemplo
const initialData = {
  ativos: [
    // FIIs
    {
      codigo: "BTHF11",
      tipo: "FII",
      quantidade: 506,
      precoMedio: 10.18,
      valorInvestido: 5151.08,
      cotacaoAtual: 8.62,
      valorAtual: 4360.92,
      rentabilidade: -15.34,
      dividendYield: 8.5,
      percentualCarteira: 2.15,
      percentualIdeal: 2.0,
      comprar: false,
      proventos: [
        {
          data: "2025-07-15",
          valor: 0.01,
          tipo: "RENDIMENTO"
        }
      ],
      operacoes: [
        {
          data: "2019-10-02",
          tipo: "COMPRA",
          quantidade: 506,
          preco: 10.18,
          valor: 5151.08,
          corretagem: 0.00
        }
      ]
    },
    {
      codigo: "KNRI11",
      tipo: "FII",
      quantidade: 31,
      precoMedio: 146.08,
      valorInvestido: 4528.48,
      cotacaoAtual: 146.15,
      valorAtual: 4530.65,
      rentabilidade: 0.05,
      dividendYield: 9.2,
      percentualCarteira: 1.89,
      percentualIdeal: 2.0,
      comprar: false,
      proventos: [],
      operacoes: [
        {
          data: "2019-10-02",
          tipo: "COMPRA",
          quantidade: 31,
          preco: 146.08,
          valor: 4528.48,
          corretagem: 0.00
        }
      ]
    },
    {
      codigo: "HGLG11",
      tipo: "FII",
      quantidade: 32,
      precoMedio: 157.20,
      valorInvestido: 5030.40,
      cotacaoAtual: 157.70,
      valorAtual: 5046.40,
      rentabilidade: 0.32,
      dividendYield: 8.8,
      percentualCarteira: 2.10,
      percentualIdeal: 2.0,
      comprar: false,
      proventos: [],
      operacoes: [
        {
          data: "2019-10-02",
          tipo: "COMPRA",
          quantidade: 32,
          preco: 157.20,
          valor: 5030.40,
          corretagem: 0.00
        }
      ]
    },
    {
      codigo: "VISC11",
      tipo: "FII",
      quantidade: 44,
      precoMedio: 107.35,
      valorInvestido: 4723.40,
      cotacaoAtual: 106.58,
      valorAtual: 4689.52,
      rentabilidade: -0.72,
      dividendYield: 9.1,
      percentualCarteira: 1.97,
      percentualIdeal: 2.0,
      comprar: false,
      proventos: [],
      operacoes: [
        {
          data: "2020-01-08",
          tipo: "COMPRA",
          quantidade: 44,
          preco: 107.35,
          valor: 4723.40,
          corretagem: 0.00
        }
      ]
    },
    {
      codigo: "MXRF11",
      tipo: "FII",
      quantidade: 520,
      precoMedio: 9.87,
      valorInvestido: 5132.40,
      cotacaoAtual: 9.78,
      valorAtual: 5085.60,
      rentabilidade: 0.00,
      dividendYield: 8.9,
      percentualCarteira: 2.14,
      percentualIdeal: 2.0,
      comprar: false,
      proventos: [],
      operacoes: [
        {
          data: "2020-06-03",
          tipo: "COMPRA",
          quantidade: 520,
          preco: 9.87,
          valor: 5132.40,
          corretagem: 0.00
        }
      ]
    },
    {
      codigo: "RECT11",
      tipo: "FII",
      quantidade: 124,
      precoMedio: 41.64,
      valorInvestido: 5163.36,
      cotacaoAtual: 32.43,
      valorAtual: 4021.32,
      rentabilidade: 0.00,
      dividendYield: 9.5,
      percentualCarteira: 2.15,
      percentualIdeal: 2.0,
      comprar: false,
      proventos: [],
      operacoes: [
        {
          data: "2021-02-25",
          tipo: "COMPRA",
          quantidade: 124,
          preco: 41.64,
          valor: 5163.36,
          corretagem: 0.00
        }
      ]
    },
    {
      codigo: "TORD11",
      tipo: "FII",
      quantidade: 53,
      precoMedio: 39.74,
      valorInvestido: 2106.22,
      cotacaoAtual: 3.13,
      valorAtual: 165.89,
      rentabilidade: 0.00,
      dividendYield: 9.3,
      percentualCarteira: 0.88,
      percentualIdeal: 1.0,
      comprar: false,
      proventos: [],
      operacoes: [
        {
          data: "2021-02-25",
          tipo: "COMPRA",
          quantidade: 53,
          preco: 39.74,
          valor: 2106.22,
          corretagem: 0.00
        }
      ]
    },
    {
      codigo: "VINO11",
      tipo: "FII",
      quantidade: 387,
      precoMedio: 8.23,
      valorInvestido: 3185.01,
      cotacaoAtual: 4.98,
      valorAtual: 1926.26,
      rentabilidade: 0.00,
      dividendYield: 8.7,
      percentualCarteira: 1.33,
      percentualIdeal: 1.5,
      comprar: false,
      proventos: [],
      operacoes: [
        {
          data: "2021-03-17",
          tipo: "COMPRA",
          quantidade: 387,
          preco: 8.23,
          valor: 3185.01,
          corretagem: 0.00
        }
      ]
    },
    {
      codigo: "TGAR11",
      tipo: "FII",
      quantidade: 59,
      precoMedio: 102.46,
      valorInvestido: 6043.14,
      cotacaoAtual: 86.86,
      valorAtual: 5124.74,
      rentabilidade: 0.00,
      dividendYield: 9.0,
      percentualCarteira: 2.52,
      percentualIdeal: 2.5,
      comprar: false,
      proventos: [],
      operacoes: [
        {
          data: "2021-08-10",
          tipo: "COMPRA",
          quantidade: 59,
          preco: 102.46,
          valor: 6043.14,
          corretagem: 0.00
        }
      ]
    },
    {
      codigo: "IRDM11",
      tipo: "FII",
      quantidade: 63,
      precoMedio: 79.47,
      valorInvestido: 5008.61,
      cotacaoAtual: 60.69,
      valorAtual: 3823.47,
      rentabilidade: 0.00,
      dividendYield: 8.6,
      percentualCarteira: 2.09,
      percentualIdeal: 2.0,
      comprar: false,
      proventos: [],
      operacoes: [
        {
          data: "2021-10-26",
          tipo: "COMPRA",
          quantidade: 63,
          preco: 79.47,
          valor: 5008.61,
          corretagem: 0.00
        }
      ]
    },
    {
      codigo: "DEVA11",
      tipo: "FII",
      quantidade: 100,
      precoMedio: 50.62,
      valorInvestido: 5062.00,
      cotacaoAtual: 26.98,
      valorAtual: 2698.00,
      rentabilidade: 0.00,
      dividendYield: 9.4,
      percentualCarteira: 2.11,
      percentualIdeal: 2.0,
      comprar: false,
      proventos: [],
      operacoes: [
        {
          data: "2022-01-10",
          tipo: "COMPRA",
          quantidade: 100,
          preco: 50.62,
          valor: 5062.00,
          corretagem: 0.00
        }
      ]
    },
    {
      codigo: "HABT11",
      tipo: "FII",
      quantidade: 66,
      precoMedio: 87.04,
      valorInvestido: 5744.64,
      cotacaoAtual: 76.92,
      valorAtual: 5076.72,
      rentabilidade: 0.00,
      dividendYield: 8.4,
      percentualCarteira: 2.40,
      percentualIdeal: 2.5,
      comprar: false,
      proventos: [],
      operacoes: [
        {
          data: "2022-04-04",
          tipo: "COMPRA",
          quantidade: 66,
          preco: 87.04,
          valor: 5744.64,
          corretagem: 0.00
        }
      ]
    },
    {
      codigo: "CPTS11",
      tipo: "FII",
      quantidade: 682,
      precoMedio: 7.67,
      valorInvestido: 5232.94,
      cotacaoAtual: 7.38,
      valorAtual: 5033.16,
      rentabilidade: 0.00,
      dividendYield: 8.8,
      percentualCarteira: 2.18,
      percentualIdeal: 2.0,
      comprar: false,
      proventos: [],
      operacoes: [
        {
          data: "2022-08-31",
          tipo: "COMPRA",
          quantidade: 682,
          preco: 7.67,
          valor: 5232.94,
          corretagem: 0.00
        }
      ]
    },
    {
      codigo: "HCTR11",
      tipo: "FII",
      quantidade: 160,
      precoMedio: 35.50,
      valorInvestido: 5680.00,
      cotacaoAtual: 22.47,
      valorAtual: 3595.20,
      rentabilidade: 0.00,
      dividendYield: 9.1,
      percentualCarteira: 2.37,
      percentualIdeal: 2.5,
      comprar: false,
      proventos: [],
      operacoes: [
        {
          data: "2022-09-21",
          tipo: "COMPRA",
          quantidade: 160,
          preco: 35.50,
          valor: 5680.00,
          corretagem: 0.00
        }
      ]
    },
    {
      codigo: "HGCR11",
      tipo: "FII",
      quantidade: 61,
      precoMedio: 98.86,
      valorInvestido: 6028.46,
      cotacaoAtual: 93.76,
      valorAtual: 5720.36,
      rentabilidade: 0.00,
      dividendYield: 8.9,
      percentualCarteira: 2.52,
      percentualIdeal: 2.5,
      comprar: false,
      proventos: [],
      operacoes: [
        {
          data: "2023-02-16",
          tipo: "COMPRA",
          quantidade: 61,
          preco: 98.86,
          valor: 6028.46,
          corretagem: 0.00
        }
      ]
    },
    {
      codigo: "XPML11",
      tipo: "FII",
      quantidade: 56,
      precoMedio: 107.18,
      valorInvestido: 6002.08,
      cotacaoAtual: 105.75,
      valorAtual: 5922.00,
      rentabilidade: 0.00,
      dividendYield: 9.2,
      percentualCarteira: 2.50,
      percentualIdeal: 2.5,
      comprar: false,
      proventos: [],
      operacoes: [
        {
          data: "2023-03-03",
          tipo: "COMPRA",
          quantidade: 56,
          preco: 107.18,
          valor: 6002.08,
          corretagem: 0.00
        }
      ]
    },
    {
      codigo: "BTLG11",
      tipo: "FII",
      quantidade: 53,
      precoMedio: 99.01,
      valorInvestido: 5249.53,
      cotacaoAtual: 102.55,
      valorAtual: 5435.15,
      rentabilidade: 0.00,
      dividendYield: 9.5,
      percentualCarteira: 2.19,
      percentualIdeal: 2.0,
      comprar: false,
      proventos: [],
      operacoes: [
        {
          data: "2023-03-03",
          tipo: "COMPRA",
          quantidade: 53,
          preco: 99.01,
          valor: 5249.53,
          corretagem: 0.00
        }
      ]
    },
    {
      codigo: "BTAL11",
      tipo: "FII",
      quantidade: 66,
      precoMedio: 79.16,
      valorInvestido: 5224.56,
      cotacaoAtual: 79.81,
      valorAtual: 5265.46,
      rentabilidade: 0.00,
      dividendYield: 8.7,
      percentualCarteira: 2.18,
      percentualIdeal: 2.0,
      comprar: false,
      proventos: [],
      operacoes: [
        {
          data: "2023-05-18",
          tipo: "COMPRA",
          quantidade: 66,
          preco: 79.16,
          valor: 5224.56,
          corretagem: 0.00
        }
      ]
    },
    {
      codigo: "XPIN11",
      tipo: "FII",
      quantidade: 72,
      precoMedio: 74.51,
      valorInvestido: 5364.72,
      cotacaoAtual: 73.42,
      valorAtual: 5286.24,
      rentabilidade: 0.00,
      dividendYield: 9.0,
      percentualCarteira: 2.24,
      percentualIdeal: 2.0,
      comprar: false,
      proventos: [],
      operacoes: [
        {
          data: "2023-06-09",
          tipo: "COMPRA",
          quantidade: 72,
          preco: 74.51,
          valor: 5364.72,
          corretagem: 0.00
        }
      ]
    },
    {
      codigo: "ALZR11",
      tipo: "FII",
      quantidade: 520,
      precoMedio: 10.67,
      valorInvestido: 5548.40,
      cotacaoAtual: 10.60,
      valorAtual: 5512.00,
      rentabilidade: 0.00,
      dividendYield: 8.6,
      percentualCarteira: 2.31,
      percentualIdeal: 2.0,
      comprar: false,
      proventos: [],
      operacoes: [
        {
          data: "2023-06-20",
          tipo: "COMPRA",
          quantidade: 520,
          preco: 10.67,
          valor: 5548.40,
          corretagem: 0.00
        }
      ]
    },
    {
      codigo: "RZTR11",
      tipo: "FII",
      quantidade: 61,
      precoMedio: 91.19,
      valorInvestido: 5564.59,
      cotacaoAtual: 93.47,
      valorAtual: 5701.67,
      rentabilidade: 0.00,
      dividendYield: 8.8,
      percentualCarteira: 2.32,
      percentualIdeal: 2.0,
      comprar: false,
      proventos: [],
      operacoes: [
        {
          data: "2023-07-07",
          tipo: "COMPRA",
          quantidade: 61,
          preco: 91.19,
          valor: 5564.59,
          corretagem: 0.00
        }
      ]
    },
    {
      codigo: "HGRU11",
      tipo: "FII",
      quantidade: 43,
      precoMedio: 124.12,
      valorInvestido: 5337.16,
      cotacaoAtual: 124.95,
      valorAtual: 5370.85,
      rentabilidade: 0.00,
      dividendYield: 9.1,
      percentualCarteira: 2.23,
      percentualIdeal: 2.0,
      comprar: false,
      proventos: [],
      operacoes: [
        {
          data: "2023-07-11",
          tipo: "COMPRA",
          quantidade: 43,
          preco: 124.12,
          valor: 5337.16,
          corretagem: 0.00
        }
      ]
    },
    {
      codigo: "JSRE11",
      tipo: "FII",
      quantidade: 84,
      precoMedio: 66.32,
      valorInvestido: 5568.88,
      cotacaoAtual: 61.95,
      valorAtual: 5203.80,
      rentabilidade: 0.00,
      dividendYield: 8.9,
      percentualCarteira: 2.32,
      percentualIdeal: 2.0,
      comprar: false,
      proventos: [],
      operacoes: [
        {
          data: "2023-08-08",
          tipo: "COMPRA",
          quantidade: 84,
          preco: 66.32,
          valor: 5568.88,
          corretagem: 0.00
        }
      ]
    },
    {
      codigo: "GGRC11",
      tipo: "FII",
      quantidade: 513,
      precoMedio: 10.62,
      valorInvestido: 5449.06,
      cotacaoAtual: 9.89,
      valorAtual: 5072.57,
      rentabilidade: 0.00,
      dividendYield: 8.7,
      percentualCarteira: 2.27,
      percentualIdeal: 2.0,
      comprar: false,
      proventos: [],
      operacoes: [
        {
          data: "2023-12-27",
          tipo: "COMPRA",
          quantidade: 513,
          preco: 10.62,
          valor: 5449.06,
          corretagem: 0.00
        }
      ]
    },
    // Ações
    {
      codigo: "AGRO3",
      tipo: "ACAO",
      quantidade: 92,
      precoMedio: 21.91,
      valorInvestido: 2015.72,
      cotacaoAtual: 20.52,
      valorAtual: 1887.84,
      rentabilidade: 0.00,
      dividendYield: 3.2,
      percentualCarteira: 0.84,
      percentualIdeal: 1.0,
      comprar: false,
      proventos: [],
      operacoes: [
        {
          data: "2025-09-15",
          tipo: "COMPRA",
          quantidade: 92,
          preco: 21.91,
          valor: 2015.72,
          corretagem: 0.00
        }
      ]
    },
    {
      codigo: "ALOS3",
      tipo: "ACAO",
      quantidade: 7,
      precoMedio: 21.70,
      valorInvestido: 151.90,
      cotacaoAtual: 24.37,
      valorAtual: 170.59,
      rentabilidade: 0.00,
      dividendYield: 2.8,
      percentualCarteira: 0.06,
      percentualIdeal: 0.5,
      comprar: false,
      proventos: [],
      operacoes: [
        {
          data: "2025-09-15",
          tipo: "COMPRA",
          quantidade: 7,
          preco: 21.70,
          valor: 151.90,
          corretagem: 0.00
        }
      ]
    },
    {
      codigo: "AZZA3",
      tipo: "ACAO",
      quantidade: 35,
      precoMedio: 58.32,
      valorInvestido: 2041.20,
      cotacaoAtual: 33.39,
      valorAtual: 1168.65,
      rentabilidade: 0.00,
      dividendYield: 1.5,
      percentualCarteira: 0.85,
      percentualIdeal: 1.0,
      comprar: false,
      proventos: [],
      operacoes: [
        {
          data: "2025-09-15",
          tipo: "COMPRA",
          quantidade: 35,
          preco: 58.32,
          valor: 2041.20,
          corretagem: 0.00
        }
      ]
    },
    {
      codigo: "B3SA3",
      tipo: "ACAO",
      quantidade: 140,
      precoMedio: 12.04,
      valorInvestido: 1685.60,
      cotacaoAtual: 13.35,
      valorAtual: 1870.00,
      rentabilidade: 0.00,
      dividendYield: 4.2,
      percentualCarteira: 0.70,
      percentualIdeal: 1.0,
      comprar: false,
      proventos: [],
      operacoes: [
        {
          data: "2025-09-15",
          tipo: "COMPRA",
          quantidade: 140,
          preco: 12.04,
          valor: 1685.60,
          corretagem: 0.00
        }
      ]
    },
    {
      codigo: "BBAS3",
      tipo: "ACAO",
      quantidade: 8,
      precoMedio: 14.51,
      valorInvestido: 116.08,
      cotacaoAtual: 21.86,
      valorAtual: 174.88,
      rentabilidade: 0.00,
      dividendYield: 6.8,
      percentualCarteira: 0.05,
      percentualIdeal: 0.5,
      comprar: false,
      proventos: [],
      operacoes: [
        {
          data: "2025-09-15",
          tipo: "COMPRA",
          quantidade: 8,
          preco: 14.51,
          valor: 116.08,
          corretagem: 0.00
        }
      ]
    },
    {
      codigo: "BBDC4",
      tipo: "ACAO",
      quantidade: 107,
      precoMedio: 12.08,
      valorInvestido: 1292.56,
      cotacaoAtual: 16.97,
      valorAtual: 1815.79,
      rentabilidade: 0.00,
      dividendYield: 5.9,
      percentualCarteira: 0.54,
      percentualIdeal: 1.0,
      comprar: false,
      proventos: [],
      operacoes: [
        {
          data: "2025-09-15",
          tipo: "COMPRA",
          quantidade: 107,
          preco: 12.08,
          valor: 1292.56,
          corretagem: 0.00
        }
      ]
    },
    {
      codigo: "BMGB4",
      tipo: "ACAO",
      quantidade: 412,
      precoMedio: 3.38,
      valorInvestido: 1392.56,
      cotacaoAtual: 3.81,
      valorAtual: 1570.72,
      rentabilidade: 0.00,
      dividendYield: 7.1,
      percentualCarteira: 0.58,
      percentualIdeal: 1.0,
      comprar: false,
      proventos: [],
      operacoes: [
        {
          data: "2025-09-15",
          tipo: "COMPRA",
          quantidade: 412,
          preco: 3.38,
          valor: 1392.56,
          corretagem: 0.00
        }
      ]
    },
    {
      codigo: "BRSR6",
      tipo: "ACAO",
      quantidade: 102,
      precoMedio: 11.51,
      valorInvestido: 1174.02,
      cotacaoAtual: 11.60,
      valorAtual: 1183.20,
      rentabilidade: 0.00,
      dividendYield: 4.3,
      percentualCarteira: 0.49,
      percentualIdeal: 1.0,
      comprar: false,
      proventos: [],
      operacoes: [
        {
          data: "2025-09-15",
          tipo: "COMPRA",
          quantidade: 102,
          preco: 11.51,
          valor: 1174.02,
          corretagem: 0.00
        }
      ]
    },
    {
      codigo: "CAML3",
      tipo: "ACAO",
      quantidade: 395,
      precoMedio: 5.34,
      valorInvestido: 2109.30,
      cotacaoAtual: 5.13,
      valorAtual: 2026.35,
      rentabilidade: 0.00,
      dividendYield: 3.9,
      percentualCarteira: 0.88,
      percentualIdeal: 1.0,
      comprar: false,
      proventos: [],
      operacoes: [
        {
          data: "2025-09-15",
          tipo: "COMPRA",
          quantidade: 395,
          preco: 5.34,
          valor: 2109.30,
          corretagem: 0.00
        }
      ]
    },
    {
      codigo: "CMIG4",
      tipo: "ACAO",
      quantidade: 130,
      precoMedio: 10.26,
      valorInvestido: 1333.80,
      cotacaoAtual: 11.13,
      valorAtual: 1446.90,
      rentabilidade: 0.00,
      dividendYield: 5.2,
      percentualCarteira: 0.56,
      percentualIdeal: 1.0,
      comprar: false,
      proventos: [],
      operacoes: [
        {
          data: "2025-09-15",
          tipo: "COMPRA",
          quantidade: 130,
          preco: 10.26,
          valor: 1333.80,
          corretagem: 0.00
        }
      ]
    },
    {
      codigo: "COGN3",
      tipo: "ACAO",
      quantidade: 270,
      precoMedio: 4.17,
      valorInvestido: 1125.90,
      cotacaoAtual: 3.04,
      valorAtual: 820.80,
      rentabilidade: 0.00,
      dividendYield: 2.1,
      percentualCarteira: 0.47,
      percentualIdeal: 1.0,
      comprar: false,
      proventos: [],
      operacoes: [
        {
          data: "2025-09-15",
          tipo: "COMPRA",
          quantidade: 270,
          preco: 4.17,
          valor: 1125.90,
          corretagem: 0.00
        }
      ]
    },
    {
      codigo: "CSNA3",
      tipo: "ACAO",
      quantidade: 182,
      precoMedio: 11.65,
      valorInvestido: 2120.30,
      cotacaoAtual: 7.87,
      valorAtual: 1432.34,
      rentabilidade: 0.00,
      dividendYield: 3.8,
      percentualCarteira: 0.89,
      percentualIdeal: 1.0,
      comprar: false,
      proventos: [],
      operacoes: [
        {
          data: "2025-09-15",
          tipo: "COMPRA",
          quantidade: 182,
          preco: 11.65,
          valor: 2120.30,
          corretagem: 0.00
        }
      ]
    },
    {
      codigo: "EGIE3",
      tipo: "ACAO",
      quantidade: 50,
      precoMedio: 37.83,
      valorInvestido: 1891.50,
      cotacaoAtual: 40.69,
      valorAtual: 2034.50,
      rentabilidade: 0.00,
      dividendYield: 4.5,
      percentualCarteira: 0.79,
      percentualIdeal: 1.0,
      comprar: false,
      proventos: [],
      operacoes: [
        {
          data: "2025-09-15",
          tipo: "COMPRA",
          quantidade: 50,
          preco: 37.83,
          valor: 1891.50,
          corretagem: 0.00
        }
      ]
    },
    {
      codigo: "FLRY3",
      tipo: "ACAO",
      quantidade: 143,
      precoMedio: 13.38,
      valorInvestido: 1913.34,
      cotacaoAtual: 15.58,
      valorAtual: 2227.94,
      rentabilidade: 0.00,
      dividendYield: 4.1,
      percentualCarteira: 0.80,
      percentualIdeal: 1.0,
      comprar: false,
      proventos: [],
      operacoes: [
        {
          data: "2025-09-15",
          tipo: "COMPRA",
          quantidade: 143,
          preco: 13.38,
          valor: 1913.34,
          corretagem: 0.00
        }
      ]
    },
    {
      codigo: "GOAU4",
      tipo: "ACAO",
      quantidade: 180,
      precoMedio: 9.50,
      valorInvestido: 1710.00,
      cotacaoAtual: 9.43,
      valorAtual: 1697.40,
      rentabilidade: 0.00,
      dividendYield: 3.2,
      percentualCarteira: 0.71,
      percentualIdeal: 1.0,
      comprar: false,
      proventos: [],
      operacoes: [
        {
          data: "2025-09-15",
          tipo: "COMPRA",
          quantidade: 180,
          preco: 9.50,
          valor: 1710.00,
          corretagem: 0.00
        }
      ]
    },
    {
      codigo: "GRND3",
      tipo: "ACAO",
      quantidade: 350,
      precoMedio: 6.25,
      valorInvestido: 2187.50,
      cotacaoAtual: 5.19,
      valorAtual: 1816.50,
      rentabilidade: 0.00,
      dividendYield: 2.8,
      percentualCarteira: 0.91,
      percentualIdeal: 1.0,
      comprar: false,
      proventos: [],
      operacoes: [
        {
          data: "2025-09-15",
          tipo: "COMPRA",
          quantidade: 350,
          preco: 6.25,
          valor: 2187.50,
          corretagem: 0.00
        }
      ]
    },
    {
      codigo: "ISAE4",
      tipo: "ACAO",
      quantidade: 87,
      precoMedio: 23.26,
      valorInvestido: 2023.62,
      cotacaoAtual: 23.33,
      valorAtual: 2029.71,
      rentabilidade: 0.00,
      dividendYield: 4.8,
      percentualCarteira: 0.85,
      percentualIdeal: 1.0,
      comprar: false,
      proventos: [],
      operacoes: [
        {
          data: "2025-09-15",
          tipo: "COMPRA",
          quantidade: 87,
          preco: 23.26,
          valor: 2023.62,
          corretagem: 0.00
        }
      ]
    },
    {
      codigo: "ITSA4",
      tipo: "ACAO",
      quantidade: 220,
      precoMedio: 10.69,
      valorInvestido: 2351.80,
      cotacaoAtual: 11.14,
      valorAtual: 2450.80,
      rentabilidade: 0.00,
      dividendYield: 6.2,
      percentualCarteira: 0.98,
      percentualIdeal: 1.0,
      comprar: false,
      proventos: [],
      operacoes: [
        {
          data: "2025-09-15",
          tipo: "COMPRA",
          quantidade: 220,
          preco: 10.69,
          valor: 2351.80,
          corretagem: 0.00
        }
      ]
    },
    {
      codigo: "JHSF3",
      tipo: "ACAO",
      quantidade: 395,
      precoMedio: 4.65,
      valorInvestido: 1836.75,
      cotacaoAtual: 5.51,
      valorAtual: 2176.45,
      rentabilidade: 0.00,
      dividendYield: 2.5,
      percentualCarteira: 0.77,
      percentualIdeal: 1.0,
      comprar: false,
      proventos: [],
      operacoes: [
        {
          data: "2025-09-15",
          tipo: "COMPRA",
          quantidade: 395,
          preco: 4.65,
          valor: 1836.75,
          corretagem: 0.00
        }
      ]
    },
    {
      codigo: "KLBN4",
      tipo: "ACAO",
      quantidade: 475,
      precoMedio: 4.05,
      valorInvestido: 1923.75,
      cotacaoAtual: 3.70,
      valorAtual: 1757.50,
      rentabilidade: 0.00,
      dividendYield: 3.5,
      percentualCarteira: 0.80,
      percentualIdeal: 1.0,
      comprar: false,
      proventos: [],
      operacoes: [
        {
          data: "2025-09-15",
          tipo: "COMPRA",
          quantidade: 475,
          preco: 4.05,
          valor: 1923.75,
          corretagem: 0.00
        }
      ]
    },
    {
      codigo: "MYPK3",
      tipo: "ACAO",
      quantidade: 50,
      precoMedio: 11.81,
      valorInvestido: 590.50,
      cotacaoAtual: 13.70,
      valorAtual: 685.00,
      rentabilidade: 0.00,
      dividendYield: 3.9,
      percentualCarteira: 0.25,
      percentualIdeal: 0.5,
      comprar: false,
      proventos: [],
      operacoes: [
        {
          data: "2025-09-15",
          tipo: "COMPRA",
          quantidade: 50,
          preco: 11.81,
          valor: 590.50,
          corretagem: 0.00
        }
      ]
    },
    {
      codigo: "ODPV3",
      tipo: "ACAO",
      quantidade: 100,
      precoMedio: 9.58,
      valorInvestido: 958.00,
      cotacaoAtual: 13.30,
      valorAtual: 1330.00,
      rentabilidade: 0.00,
      dividendYield: 4.1,
      percentualCarteira: 0.40,
      percentualIdeal: 1.0,
      comprar: false,
      proventos: [],
      operacoes: [
        {
          data: "2025-09-15",
          tipo: "COMPRA",
          quantidade: 100,
          preco: 9.58,
          valor: 958.00,
          corretagem: 0.00
        }
      ]
    },
    {
      codigo: "PTBL3",
      tipo: "ACAO",
      quantidade: 410,
      precoMedio: 4.10,
      valorInvestido: 1681.00,
      cotacaoAtual: 3.99,
      valorAtual: 1635.90,
      rentabilidade: 0.00,
      dividendYield: 3.2,
      percentualCarteira: 0.70,
      percentualIdeal: 1.0,
      comprar: false,
      proventos: [],
      operacoes: [
        {
          data: "2025-09-15",
          tipo: "COMPRA",
          quantidade: 410,
          preco: 4.10,
          valor: 1681.00,
          corretagem: 0.00
        }
      ]
    },
    {
      codigo: "RAPT3",
      tipo: "ACAO",
      quantidade: 135,
      precoMedio: 7.08,
      valorInvestido: 955.80,
      cotacaoAtual: 6.50,
      valorAtual: 877.50,
      rentabilidade: 0.00,
      dividendYield: 2.9,
      percentualCarteira: 0.40,
      percentualIdeal: 1.0,
      comprar: false,
      proventos: [],
      operacoes: [
        {
          data: "2025-09-15",
          tipo: "COMPRA",
          quantidade: 135,
          preco: 7.08,
          valor: 955.80,
          corretagem: 0.00
        }
      ]
    },
    {
      codigo: "SANB3",
      tipo: "ACAO",
      quantidade: 30,
      precoMedio: 13.05,
      valorInvestido: 391.50,
      cotacaoAtual: 13.63,
      valorAtual: 408.90,
      rentabilidade: 0.00,
      dividendYield: 5.5,
      percentualCarteira: 0.16,
      percentualIdeal: 0.5,
      comprar: false,
      proventos: [],
      operacoes: [
        {
          data: "2025-09-15",
          tipo: "COMPRA",
          quantidade: 30,
          preco: 13.05,
          valor: 391.50,
          corretagem: 0.00
        }
      ]
    },
    {
      codigo: "SAPR4",
      tipo: "ACAO",
      quantidade: 100,
      precoMedio: 4.05,
      valorInvestido: 405.00,
      cotacaoAtual: 7.18,
      valorAtual: 718.00,
      rentabilidade: 0.00,
      dividendYield: 4.8,
      percentualCarteira: 0.17,
      percentualIdeal: 0.5,
      comprar: false,
      proventos: [],
      operacoes: [
        {
          data: "2025-09-15",
          tipo: "COMPRA",
          quantidade: 100,
          preco: 4.05,
          valor: 405.00,
          corretagem: 0.00
        }
      ]
    },
    {
      codigo: "TAEE4",
      tipo: "ACAO",
      quantidade: 181,
      precoMedio: 11.64,
      valorInvestido: 2107.84,
      cotacaoAtual: 11.71,
      valorAtual: 2119.51,
      rentabilidade: 0.00,
      dividendYield: 5.1,
      percentualCarteira: 0.88,
      percentualIdeal: 1.0,
      comprar: false,
      proventos: [],
      operacoes: [
        {
          data: "2025-09-15",
          tipo: "COMPRA",
          quantidade: 181,
          preco: 11.64,
          valor: 2107.84,
          corretagem: 0.00
        }
      ]
    },
    {
      codigo: "TASA4",
      tipo: "ACAO",
      quantidade: 203,
      precoMedio: 10.72,
      valorInvestido: 2176.16,
      cotacaoAtual: 4.99,
      valorAtual: 1012.97,
      rentabilidade: 0.00,
      dividendYield: 4.9,
      percentualCarteira: 0.91,
      percentualIdeal: 1.0,
      comprar: false,
      proventos: [],
      operacoes: [
        {
          data: "2025-09-15",
          tipo: "COMPRA",
          quantidade: 203,
          preco: 10.72,
          valor: 2176.16,
          corretagem: 0.00
        }
      ]
    },
    {
      codigo: "TRIS3",
      tipo: "ACAO",
      quantidade: 250,
      precoMedio: 6.64,
      valorInvestido: 1660.00,
      cotacaoAtual: 7.37,
      valorAtual: 1842.50,
      rentabilidade: 0.00,
      dividendYield: 3.1,
      percentualCarteira: 0.69,
      percentualIdeal: 1.0,
      comprar: false,
      proventos: [],
      operacoes: [
        {
          data: "2025-09-15",
          tipo: "COMPRA",
          quantidade: 250,
          preco: 6.64,
          valor: 1660.00,
          corretagem: 0.00
        }
      ]
    },
    {
      codigo: "USIM5",
      tipo: "ACAO",
      quantidade: 320,
      precoMedio: 6.63,
      valorInvestido: 2121.60,
      cotacaoAtual: 4.52,
      valorAtual: 1446.40,
      rentabilidade: 0.00,
      dividendYield: 2.8,
      percentualCarteira: 0.89,
      percentualIdeal: 1.0,
      comprar: false,
      proventos: [],
      operacoes: [
        {
          data: "2025-09-15",
          tipo: "COMPRA",
          quantidade: 320,
          preco: 6.63,
          valor: 2121.60,
          corretagem: 0.00
        }
      ]
    },
    {
      codigo: "VALE3",
      tipo: "ACAO",
      quantidade: 36,
      precoMedio: 59.12,
      valorInvestido: 2128.32,
      cotacaoAtual: 57.44,
      valorAtual: 2067.84,
      rentabilidade: 0.00,
      dividendYield: 4.8,
      percentualCarteira: 0.87,
      percentualIdeal: 1.0,
      comprar: false,
      proventos: [
        {
          data: "2025-08-30",
          valor: 0.01,
          tipo: "DIVIDENDO"
        }
      ],
      operacoes: [
        {
          data: "2025-09-15",
          tipo: "COMPRA",
          quantidade: 36,
          preco: 59.12,
          valor: 2128.32,
          corretagem: 0.00
        }
      ]
    },
    {
      codigo: "WIZC3",
      tipo: "ACAO",
      quantidade: 280,
      precoMedio: 6.17,
      valorInvestido: 1727.60,
      cotacaoAtual: 8.21,
      valorAtual: 2298.80,
      rentabilidade: 0.00,
      dividendYield: 3.2,
      percentualCarteira: 0.96,
      percentualIdeal: 1.0,
      comprar: false,
      proventos: [],
      operacoes: [
        {
          data: "2025-09-15",
          tipo: "COMPRA",
          quantidade: 280,
          preco: 6.17,
          valor: 1727.60,
          corretagem: 0.00
        }
      ]
    }
  ],
  aportes: [
    {
      id: 1,
      data: "2025-08-15",
      tipo: "APORTE",
      origem: "CARLOS",
      valor: 5000.00
    },
    {
      id: 2,
      data: "2025-08-25",
      tipo: "APORTE",
      origem: "GABRIELA",
      valor: 3000.00
    }
  ],
  configuracoes: {
    percentualIdealPorAtivo: 2.99,
    metaRentabilidade: 10.0,
    valorTotalInvestido: 11503.45,
    valorAtualCarteira: 11836.00,
    rentabilidadeTotal: 2.89,
    totalProventos: 195.50,
    yieldMedioCarteira: 11.17,
    alocacaoIdeal: {
      acoes: {
        total: 40,
        porAtivo: {
          "PETR4": 5.0,
          "ITUB4": 3.5,
          "BBDC4": 3.0,
          "WEGE3": 2.5,
          "MGLU3": 2.0,
          "ABEV3": 2.0,
          "PETR3": 2.0,
          "ITSA4": 1.5,
          "B3SA3": 1.5,
          "RENT3": 1.5,
          "JBSS3": 1.5,
          "ELET3": 1.5,
          "SUZB3": 1.5,
          "LREN3": 1.0,
          "RADL3": 1.0,
          "EQTL3": 1.0,
          "CPLE6": 1.0,
          "EGIE3": 1.0,
          "TAEE11": 1.0,
          "CSNA3": 0.8,
          "GGBR4": 0.8,
          "USIM5": 0.8,
          "VALE3": 5.0,
          "WIZC3": 1.0,
          "BRFS3": 0.7
        }
      },
      fiis: {
        total: 60,
        porAtivo: {
          "HGLG11": 4.0,
          "VISC11": 3.5,
          "XPML11": 3.0,
          "BCFF11": 3.0,
          "HSML11": 2.5,
          "MXRF11": 2.5,
          "BTLG11": 2.5,
          "RBRF11": 2.5,
          "CPTS11": 2.0,
          "KNRI11": 2.0,
          "HFOF11": 2.0,
          "VGHF11": 2.0,
          "IRDM11": 2.0,
          "RECR11": 2.0,
          "DEVA11": 1.5,
          "RBRR11": 1.5,
          "RBVA11": 1.5,
          "XPLG11": 1.5,
          "TGAR11": 1.5,
          "VINO11": 1.0,
          "RZTR11": 1.0,
          "RCRB11": 1.0,
          "HABT11": 1.0
        }
      }
    }
  }
};

// Ações do reducer
const actionTypes = {
  ADD_ATIVO: 'ADD_ATIVO',
  UPDATE_ATIVO: 'UPDATE_ATIVO',
  REMOVE_ATIVO: 'REMOVE_ATIVO',
  ADD_OPERACAO: 'ADD_OPERACAO',
  UPDATE_OPERACAO: 'UPDATE_OPERACAO',
  REMOVE_OPERACAO: 'REMOVE_OPERACAO',
  ADD_PROVENTO: 'ADD_PROVENTO',
  UPDATE_PROVENTO: 'UPDATE_PROVENTO',
  REMOVE_PROVENTO: 'REMOVE_PROVENTO',
  ADD_APORTE: 'ADD_APORTE',
  UPDATE_APORTE: 'UPDATE_APORTE',
  REMOVE_APORTE: 'REMOVE_APORTE',
  UPDATE_CONFIGURACOES: 'UPDATE_CONFIGURACOES',
  LOAD_DATA: 'LOAD_DATA',
  SAVE_DATA: 'SAVE_DATA'
};

// Funções utilitárias
const calcularPrecoMedio = (operacoes) => {
  const compras = operacoes.filter(op => op.tipo === 'COMPRA');
  const totalValor = compras.reduce((sum, op) => sum + (op.valor || 0), 0);
  const totalQuantidade = compras.reduce((sum, op) => sum + (op.quantidade || 0), 0);
  return totalQuantidade > 0 ? totalValor / totalQuantidade : 0;
};

const calcularQuantidadeTotal = (operacoes) => {
  return operacoes.reduce((total, op) => {
    const quantidade = op.quantidade || 0;
    return op.tipo === 'COMPRA' ? total + quantidade : total - quantidade;
  }, 0);
};

const calcularValorInvestido = (operacoes) => {
  const compras = operacoes.filter(op => op.tipo === 'COMPRA');
  return compras.reduce((sum, op) => sum + (op.valor || 0) + (op.corretagem || 0), 0);
};

const calcularDividendYield = (proventos, valorInvestido) => {
  const proventosUltimos12Meses = proventos ? proventos.reduce((sum, prov) => sum + (prov.valor || 0), 0) : 0;
  return valorInvestido > 0 ? (proventosUltimos12Meses / valorInvestido) * 100 : 0;
};

const calcularRentabilidade = (valorAtual, valorInvestido, proventos) => {
  const totalProventos = proventos ? proventos.reduce((sum, prov) => sum + (prov.valor || 0), 0) : 0;
  const resultado = valorAtual + totalProventos - valorInvestido;
  return valorInvestido > 0 ? (resultado / valorInvestido) * 100 : 0;
};

// Reducer
const investmentReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.ADD_ATIVO:
      return {
        ...state,
        ativos: [...state.ativos, action.payload]
      };

    case actionTypes.UPDATE_ATIVO:
      return {
        ...state,
        ativos: state.ativos.map(ativo => {
          if (ativo.codigo === action.payload.codigo) {
            return { ...ativo, ...action.payload };
          }
          return ativo;
        })
      };

    case actionTypes.REMOVE_ATIVO:
      return {
        ...state,
        ativos: state.ativos.filter(ativo => ativo.codigo !== action.payload)
      };

    case actionTypes.ADD_OPERACAO: {
      const { codigo, operacao } = action.payload;
      const novosAtivos = state.ativos.map(ativo => {
        if (ativo.codigo === codigo) {
          const novasOperacoes = [...ativo.operacoes, operacao];
          const novaQuantidade = calcularQuantidadeTotal(novasOperacoes);
          const novoPrecoMedio = calcularPrecoMedio(novasOperacoes);
          const novoValorInvestido = calcularValorInvestido(novasOperacoes);
          const novoValorAtual = novaQuantidade * ativo.cotacaoAtual;

          // Recalcular rentabilidade incluindo proventos
          const totalProventos = ativo.proventos ? ativo.proventos.reduce((sum, prov) => sum + (prov.valor || 0), 0) : 0;
          const novaRentabilidade = novoValorInvestido > 0 ?
            ((novoValorAtual + totalProventos - novoValorInvestido) / novoValorInvestido) * 100 : 0;

          return {
            ...ativo,
            operacoes: novasOperacoes,
            quantidade: novaQuantidade,
            precoMedio: novoPrecoMedio,
            valorInvestido: novoValorInvestido,
            valorAtual: novoValorAtual,
            rentabilidade: parseFloat(novaRentabilidade.toFixed(2))
          };
        }
        return ativo;
      });

      return { ...state, ativos: novosAtivos };
    }

    case actionTypes.UPDATE_OPERACAO: {
      const { codigo, index, operacao } = action.payload;
      const novosAtivos = state.ativos.map(ativo => {
        if (ativo.codigo === codigo) {
          const novasOperacoes = [...ativo.operacoes];
          novasOperacoes[index] = operacao;

          const novaQuantidade = calcularQuantidadeTotal(novasOperacoes);
          const novoPrecoMedio = calcularPrecoMedio(novasOperacoes);
          const novoValorInvestido = calcularValorInvestido(novasOperacoes);
          const novoValorAtual = novaQuantidade * ativo.cotacaoAtual;

          // Recalcular rentabilidade incluindo proventos
          const totalProventos = ativo.proventos ? ativo.proventos.reduce((sum, prov) => sum + (prov.valor || 0), 0) : 0;
          const novaRentabilidade = novoValorInvestido > 0 ?
            ((novoValorAtual + totalProventos - novoValorInvestido) / novoValorInvestido) * 100 : 0;

          return {
            ...ativo,
            operacoes: novasOperacoes,
            quantidade: novaQuantidade,
            precoMedio: novoPrecoMedio,
            valorInvestido: novoValorInvestido,
            valorAtual: novoValorAtual,
            rentabilidade: parseFloat(novaRentabilidade.toFixed(2))
          };
        }
        return ativo;
      });

      return { ...state, ativos: novosAtivos };
    }

    case actionTypes.REMOVE_OPERACAO: {
      const { codigo, index } = action.payload;
      const novosAtivos = state.ativos.map(ativo => {
        if (ativo.codigo === codigo) {
          const novasOperacoes = ativo.operacoes.filter((_, i) => i !== index);

          // Se não sobrar nenhuma operação, remove o ativo inteiro
          if (novasOperacoes.length === 0) {
            return null;
          }

          const novaQuantidade = calcularQuantidadeTotal(novasOperacoes);
          const novoPrecoMedio = calcularPrecoMedio(novasOperacoes);
          const novoValorInvestido = calcularValorInvestido(novasOperacoes);
          const novoValorAtual = novaQuantidade * ativo.cotacaoAtual;

          // Recalcular rentabilidade incluindo proventos
          const totalProventos = ativo.proventos ? ativo.proventos.reduce((sum, prov) => sum + (prov.valor || 0), 0) : 0;
          const novaRentabilidade = novoValorInvestido > 0 ?
            ((novoValorAtual + totalProventos - novoValorInvestido) / novoValorInvestido) * 100 : 0;

          return {
            ...ativo,
            operacoes: novasOperacoes,
            quantidade: novaQuantidade,
            precoMedio: novoPrecoMedio,
            valorInvestido: novoValorInvestido,
            valorAtual: novoValorAtual,
            rentabilidade: parseFloat(novaRentabilidade.toFixed(2))
          };
        }
        return ativo;
      });

      // Filtra qualquer ativo que tenha retornado null (sem operações)
      const ativosRestantes = novosAtivos.filter(ativo => ativo !== null);

      return { ...state, ativos: ativosRestantes };
    }

    case actionTypes.ADD_PROVENTO: {
      const { codigo, provento } = action.payload;
      const novosAtivos = state.ativos.map(ativo => {
        if (ativo.codigo === codigo) {
          const novosProventos = [...ativo.proventos, provento];
          const novoDividendYield = calcularDividendYield(novosProventos, ativo.valorInvestido || 0);

          // Recalcular rentabilidade incluindo o novo provento
          const totalProventos = novosProventos.reduce((sum, prov) => sum + (prov.valor || 0), 0);
          const valorInvestido = ativo.valorInvestido || 0;
          const novaRentabilidade = valorInvestido > 0 ?
            ((ativo.valorAtual + totalProventos - valorInvestido) / valorInvestido) * 100 : 0;

          return {
            ...ativo,
            proventos: novosProventos,
            dividendYield: novoDividendYield,
            rentabilidade: parseFloat(novaRentabilidade.toFixed(2))
          };
        }
        return ativo;
      });

      return { ...state, ativos: novosAtivos };
    }

    case actionTypes.UPDATE_PROVENTO: {
      const { codigo, index, provento } = action.payload;
      const novosAtivos = state.ativos.map(ativo => {
        if (ativo.codigo === codigo) {
          const novosProventos = [...ativo.proventos];
          novosProventos[index] = provento;
          const novoDividendYield = calcularDividendYield(novosProventos, ativo.valorInvestido || 0);

          // Recalcular rentabilidade incluindo o provento atualizado
          const totalProventos = novosProventos.reduce((sum, prov) => sum + (prov.valor || 0), 0);
          const valorInvestido = ativo.valorInvestido || 0;
          const novaRentabilidade = valorInvestido > 0 ?
            ((ativo.valorAtual + totalProventos - valorInvestido) / valorInvestido) * 100 : 0;

          return {
            ...ativo,
            proventos: novosProventos,
            dividendYield: novoDividendYield,
            rentabilidade: parseFloat(novaRentabilidade.toFixed(2))
          };
        }
        return ativo;
      });

      return { ...state, ativos: novosAtivos };
    }

    case actionTypes.REMOVE_PROVENTO: {
      const { codigo, index } = action.payload;
      const novosAtivos = state.ativos.map(ativo => {
        if (ativo.codigo === codigo) {
          const novosProventos = ativo.proventos.filter((_, i) => i !== index);
          const novoDividendYield = calcularDividendYield(novosProventos, ativo.valorInvestido || 0);

          // Recalcular rentabilidade após remover o provento
          const totalProventos = novosProventos.reduce((sum, prov) => sum + (prov.valor || 0), 0);
          const valorInvestido = ativo.valorInvestido || 0;
          const novaRentabilidade = valorInvestido > 0 ?
            ((ativo.valorAtual + totalProventos - valorInvestido) / valorInvestido) * 100 : 0;

          return {
            ...ativo,
            proventos: novosProventos,
            dividendYield: novoDividendYield,
            rentabilidade: parseFloat(novaRentabilidade.toFixed(2))
          };
        }
        return ativo;
      });

      return { ...state, ativos: novosAtivos };
    }

    case actionTypes.ADD_APORTE: {
      const novoAporte = {
        ...action.payload,
        id: Date.now()  // Gera um ID único com base no timestamp
      };
      return {
        ...state,
        aportes: [...state.aportes, novoAporte]
      };
    }

    case actionTypes.UPDATE_APORTE: {
      const aporteAtualizado = action.payload;
      return {
        ...state,
        aportes: state.aportes.map(aporte => 
          aporte.id === aporteAtualizado.id ? aporteAtualizado : aporte
        )
      };
    }

    case actionTypes.REMOVE_APORTE: {
      const idParaRemover = action.payload;
      return {
        ...state,
        aportes: state.aportes.filter(aporte => aporte.id !== idParaRemover)
      };
    }

    case actionTypes.UPDATE_CONFIGURACOES:
      return {
        ...state,
        configuracoes: { ...state.configuracoes, ...action.payload }
      };

    case actionTypes.LOAD_DATA:
      return action.payload;

    default:
      return state;
  }
};

// Context
const InvestmentContext = createContext();

// Provider
export const InvestmentProvider = ({ children }) => {
  const [state, dispatch] = useReducer(investmentReducer, initialData);

  // Carregar dados do localStorage ao inicializar
  useEffect(() => {
    const savedData = localStorage.getItem('investment-data');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        dispatch({ type: actionTypes.LOAD_DATA, payload: parsedData });
      } catch (error) {
        console.error('Erro ao carregar dados salvos:', error);
      }
    }
  }, []);

  // Salvar dados no localStorage sempre que o estado mudar
  useEffect(() => {
    localStorage.setItem('investment-data', JSON.stringify(state));
  }, [state]);

  // Ações
  const addAtivo = (ativo) => {
    dispatch({ type: actionTypes.ADD_ATIVO, payload: ativo });
  };

  const updateAtivo = (ativo) => {
    dispatch({ type: actionTypes.UPDATE_ATIVO, payload: ativo });
  };

  const removeAtivo = (codigo) => {
    dispatch({ type: actionTypes.REMOVE_ATIVO, payload: codigo });
  };

  const addOperacao = (codigo, operacao) => {
    dispatch({ type: actionTypes.ADD_OPERACAO, payload: { codigo, operacao } });
  };

  const updateOperacao = (codigo, index, operacao) => {
    dispatch({ type: actionTypes.UPDATE_OPERACAO, payload: { codigo, index, operacao } });
  };

  const removeOperacao = (codigo, index) => {
    dispatch({ type: actionTypes.REMOVE_OPERACAO, payload: { codigo, index } });
  };

  const addProvento = (codigo, provento) => {
    dispatch({ type: actionTypes.ADD_PROVENTO, payload: { codigo, provento } });
  };

  const updateProvento = (codigo, index, provento) => {
    dispatch({ type: actionTypes.UPDATE_PROVENTO, payload: { codigo, index, provento } });
  };

  const removeProvento = (codigo, index) => {
    dispatch({ type: actionTypes.REMOVE_PROVENTO, payload: { codigo, index } });
  };

  const updateConfiguracoes = (configuracoes) => {
    dispatch({ type: actionTypes.UPDATE_CONFIGURACOES, payload: configuracoes });
  };

  // Função para recalcular rentabilidade de todos os ativos
  const recalcularRentabilidades = async () => {
    const ativosAtualizados = state.ativos.map(ativo => {
      const totalProventos = ativo.proventos ? ativo.proventos.reduce((sum, prov) => sum + (prov.valor || 0), 0) : 0;

      // Garantir que os valores sejam números válidos
      const valorAtual = (ativo.quantidade || 0) * (ativo.cotacaoAtual || 0);
      const valorInvestido = ativo.valorInvestido || 0;

      const rentabilidade = valorInvestido > 0
        ? ((valorAtual + totalProventos - valorInvestido) / valorInvestido) * 100
        : 0;

      return {
        ...ativo,
        valorAtual: valorAtual,
        rentabilidade: parseFloat(rentabilidade.toFixed(2))
      };
    });

    // Atualizar todos os ativos de uma vez
    ativosAtualizados.forEach(ativo => {
      dispatch({
        type: actionTypes.UPDATE_ATIVO,
        payload: ativo
      });
    });

    // Pequeno delay para mostrar o loading
    await new Promise(resolve => setTimeout(resolve, 800));
  };

  // Funções para gerenciamento de aportes
  const addAporte = (aporte) => {
    dispatch({ type: actionTypes.ADD_APORTE, payload: aporte });
  };

  const updateAporte = (aporte) => {
    dispatch({ type: actionTypes.UPDATE_APORTE, payload: aporte });
  };

  const removeAporte = (id) => {
    dispatch({ type: actionTypes.REMOVE_APORTE, payload: id });
  };

  // Cálculos derivados
  const getResumoCarteira = () => {
    const valorTotalInvestido = state.ativos.reduce((sum, ativo) => sum + (ativo.valorInvestido || 0), 0);
    const valorAtualCarteira = state.ativos.reduce((sum, ativo) => sum + (ativo.valorAtual || 0), 0);
    const rentabilidadeTotal = valorTotalInvestido > 0 ?
      ((valorAtualCarteira - valorTotalInvestido) / valorTotalInvestido) * 100 : 0;
    const totalProventos = state.ativos.reduce((sum, ativo) =>
      sum + (ativo.proventos ? ativo.proventos.reduce((pSum, prov) => pSum + (prov.valor || 0), 0) : 0), 0);
    const yieldMedioCarteira = valorTotalInvestido > 0 ?
      (totalProventos / valorTotalInvestido) * 100 : 0;

    return {
      valorTotalInvestido,
      valorAtualCarteira,
      rentabilidadeTotal,
      totalProventos,
      yieldMedioCarteira
    };
  };

  const getDistribuicaoTipos = () => {
    const resumo = getResumoCarteira();
    const acoes = state.ativos.filter(ativo => ativo.tipo === 'ACAO')
      .reduce((sum, ativo) => sum + (ativo.valorAtual || 0), 0);
    const fiis = state.ativos.filter(ativo => ativo.tipo === 'FII')
      .reduce((sum, ativo) => sum + (ativo.valorAtual || 0), 0);

    return {
      acoes: resumo.valorAtualCarteira > 0 ? (acoes / resumo.valorAtualCarteira) * 100 : 0,
      fiis: resumo.valorAtualCarteira > 0 ? (fiis / resumo.valorAtualCarteira) * 100 : 0
    };
  };

  // Função para gerar sugestão de aporte baseado na alocação ideal
  const gerarSugestaoDeAporte = (valorTotal) => {
    if (!valorTotal || valorTotal <= 0) return [];

    const alocacaoIdeal = state.configuracoes.alocacaoIdeal;
    const sugestoes = [];

    // Calcular valor total atual da carteira
    const valorTotalAtual = state.ativos.reduce((sum, ativo) => sum + (ativo.valorAtual || 0), 0);

    // Separar ativos por classe
    const ativosPorClasse = {
      acoes: state.ativos.filter(ativo => ativo.tipo === 'ACAO'),
      fiis: state.ativos.filter(ativo => ativo.tipo === 'FII')
    };

    // Processar cada classe
    Object.keys(ativosPorClasse).forEach(classe => {
      const ativosClasse = ativosPorClasse[classe];
      if (ativosClasse.length === 0) return;

      const configClasse = alocacaoIdeal[classe];
      if (!configClasse) return;

      // Valor atual da classe
      const valorAtualClasse = ativosClasse.reduce((sum, ativo) => sum + (ativo.valorAtual || 0), 0);

      // Percentual ideal da classe no total
      const percentualIdealClasse = configClasse.total;

      // Valor ideal da classe no aporte
      const valorIdealClasse = (valorTotal * percentualIdealClasse) / 100;

      // Calcular percentuais ideais considerando ativos com % ideal = 0
      const ativosComPercentualFixo = ativosClasse.filter(ativo => 
        configClasse.porAtivo && configClasse.porAtivo[ativo.codigo] && configClasse.porAtivo[ativo.codigo] > 0
      );
      const ativosComPercentualZero = ativosClasse.filter(ativo => 
        !configClasse.porAtivo || !configClasse.porAtivo[ativo.codigo] || configClasse.porAtivo[ativo.codigo] === 0
      );
      
      // Percentual total já alocado para ativos com % fixo
      const percentualTotalFixo = ativosComPercentualFixo.reduce((sum, ativo) => 
        sum + (configClasse.porAtivo[ativo.codigo] || 0), 0
      );
      
      // Percentual restante para distribuição entre ativos com % = 0
      const percentualRestante = 100 - percentualTotalFixo;
      const percentualPorAtivoZero = ativosComPercentualZero.length > 0 ? 
        percentualRestante / ativosComPercentualZero.length : 0;

      // Processar cada ativo da classe
      ativosClasse.forEach(ativo => {
        // Percentual atual do ativo na classe
        const percentualAtualAtivo = valorAtualClasse > 0 ? 
          (ativo.valorAtual / valorAtualClasse) * 100 : 0;

        // Percentual ideal do ativo na classe
        let percentualIdealAtivo;
        if (configClasse.porAtivo && configClasse.porAtivo[ativo.codigo] && configClasse.porAtivo[ativo.codigo] > 0) {
          // Ativo com percentual fixo definido
          percentualIdealAtivo = configClasse.porAtivo[ativo.codigo];
        } else {
          // Ativo com percentual = 0, recebe distribuição igualitária do restante
          percentualIdealAtivo = percentualPorAtivoZero;
        }

        // Atualizar o percentual ideal do ativo
        ativo.percentualIdeal = percentualIdealAtivo;

        // Calcular score para priorização
        let score = (percentualIdealAtivo - percentualAtualAtivo) * 0.6;

        // Bonus se cotação estiver abaixo do preço médio
        if (ativo.precoMedio && ativo.cotacaoAtual < ativo.precoMedio) {
          const desvalorizacao = (ativo.precoMedio - ativo.cotacaoAtual) / ativo.precoMedio;
          score += desvalorizacao * 0.4;
        }

        sugestoes.push({
          ticker: ativo.codigo,
          classe: classe,
          valorAtual: ativo.valorAtual,
          percentualAtual: percentualAtualAtivo,
          percentualIdeal: percentualIdealAtivo,
          precoMedio: ativo.precoMedio,
          cotacaoAtual: ativo.cotacaoAtual,
          score: score,
          recomendacao: 0 // Será calculado depois
        });
      });
    });

    // Filtrar apenas ativos com score positivo (subalocados)
    const ativosPrioritarios = sugestoes.filter(sugestao => sugestao.score > 0);

    if (ativosPrioritarios.length === 0) return [];

    // Calcular recomendações baseado nos scores
    const totalScore = ativosPrioritarios.reduce((sum, ativo) => sum + ativo.score, 0);

    ativosPrioritarios.forEach(ativo => {
      const proporcao = ativo.score / totalScore;
      ativo.recomendacao = Math.round(valorTotal * proporcao);
    });

    // Ordenar por score decrescente
    return ativosPrioritarios.sort((a, b) => b.score - a.score);
  };

  const value = {
    state,
    actions: {
      addAtivo,
      updateAtivo,
      removeAtivo,
      addOperacao,
      updateOperacao,
      removeOperacao,
      addProvento,
      updateProvento,
      removeProvento,
      addAporte,
      updateAporte,
      removeAporte,
      updateConfiguracoes,
      recalcularRentabilidades
    },
    computed: {
      getResumoCarteira,
      getDistribuicaoTipos,
      gerarSugestaoDeAporte
    }
  };

  return (
    <InvestmentContext.Provider value={value}>
      {children}
    </InvestmentContext.Provider>
  );
};

// Hook personalizado
export const useInvestment = () => {
  const context = useContext(InvestmentContext);
  if (!context) {
    throw new Error('useInvestment deve ser usado dentro de InvestmentProvider');
  }
  
  // Extraindo valores para facilitar o uso
  const { state, actions, computed } = context;
  
  return {
    ativos: state.ativos,
    aportes: state.aportes,
    configuracoes: state.configuracoes,
    addAtivo: actions.addAtivo,
    updateAtivo: actions.updateAtivo,
    removeAtivo: actions.removeAtivo,
    addOperacao: actions.addOperacao,
    updateOperacao: actions.updateOperacao,
    removeOperacao: actions.removeOperacao,
    addProvento: actions.addProvento,
    updateProvento: actions.updateProvento,
    removeProvento: actions.removeProvento,
    addAporte: actions.addAporte,
    updateAporte: actions.updateAporte,
    removeAporte: actions.removeAporte,
    updateConfiguracoes: actions.updateConfiguracoes,
    recalcularRentabilidades: actions.recalcularRentabilidades,
    getResumoCarteira: computed.getResumoCarteira,
    getDistribuicaoTipos: computed.getDistribuicaoTipos,
    gerarSugestaoDeAporte: computed.gerarSugestaoDeAporte
  };
};