/**
 * Parse datetime string dari backend sebagai UTC.
 * Backend Laravel mengembalikan format "2026-08-19 02:02:00" (tanpa timezone marker).
 * Tanpa penanganan ini, browser akan memparsanya sebagai waktu lokal → jam salah.
 * Dengan menambahkan 'Z', browser memparsanya sebagai UTC → dikonversi ke WIB (UTC+7) secara benar.
 */
const parseUTC = (dateStr: string): Date => {
  if (!dateStr) return new Date(NaN);
  // Jika sudah ada timezone marker (Z atau +HH:MM), gunakan langsung
  if (dateStr.endsWith('Z') || dateStr.includes('+')) return new Date(dateStr);
  // Ganti spasi dengan 'T' dan tambahkan 'Z' agar diparse sebagai UTC
  return new Date(dateStr.replace(' ', 'T') + 'Z');
};

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
  if (!date) return '';
  const d = parseUTC(date);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString('id-ID', {
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

export const formatTimeAgo = (date: Date | string | number): string => {
  const now = new Date();
  const past = typeof date === 'string' ? parseUTC(date) : new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;
  
  return past.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short'
  });
};

export const formatDateDMY = (date: Date | string | number): string => {
  if (!date) return '';
  const d = typeof date === 'string' ? parseUTC(date) : new Date(date);
  if (isNaN(d.getTime())) return '';
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear().toString().slice(-2);
  return `${day}/${month}/${year}`;
};

export const formatNumberWithDots = (val: string | number): string => {
  if (val === undefined || val === null || val === '') return '';
  
  let num: number;
  if (typeof val === 'string') {
    if (/^\d+\.\d{1,2}$/.test(val)) {
      num = Math.round(parseFloat(val));
    } else {
      const cleanStr = val.replace(/\D/g, '');
      num = cleanStr ? parseInt(cleanStr, 10) : 0;
    }
  } else {
    num = Math.round(val);
  }
  
  return new Intl.NumberFormat('id-ID').format(num);
};

export const parseDotsToNumber = (val: string | number): number => {
  if (typeof val === 'number') return val;
  if (/^\d+\.\d{1,2}$/.test(val)) {
    return Math.round(parseFloat(val));
  }
  const cleanStr = val.replace(/\D/g, '');
  return cleanStr ? parseInt(cleanStr, 10) : 0;
};

