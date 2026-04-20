export const formatCurrency = (amount: number | string) => {
  const value = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

export const formatMonth = (month: number) => {
  const date = new Date();
  date.setMonth(month - 1);
  return date.toLocaleString('id-ID', { month: 'long' });
};
