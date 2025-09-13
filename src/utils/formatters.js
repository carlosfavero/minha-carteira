/**
 * Formata um valor numérico para moeda brasileira (R$)
 * @param {number} value - Valor a ser formatado
 * @returns {string} Valor formatado como moeda
 */
export const formatCurrency = (value) => {
  const formatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
  return formatter.format(value);
};

/**
 * Formata um valor numérico para porcentagem
 * @param {number} value - Valor a ser formatado
 * @param {number} decimalPlaces - Número de casas decimais
 * @returns {string} Valor formatado como porcentagem
 */
export const formatPercent = (value, decimalPlaces = 2) => {
  const formatter = new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces
  });
  return formatter.format(value / 100);
};

/**
 * Formata um valor numérico com separador de milhares
 * @param {number} value - Valor a ser formatado
 * @param {number} decimalPlaces - Número de casas decimais
 * @returns {string} Valor formatado
 */
export const formatNumber = (value, decimalPlaces = 2) => {
  const formatter = new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces
  });
  return formatter.format(value);
};