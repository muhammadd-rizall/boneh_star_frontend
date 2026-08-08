import axios from '@/api/Axios';

export interface DashboardData {
  stats: {
    label: string;
    value: string;
    sub: string;
    icon?: string;
    trendLabel?: string;
    trend?: 'up' | 'down';
    color: 'emerald' | 'violet' | 'sky' | 'amber' | 'slate' | 'rose';
    href?: string;
  }[];
  recent_activity: {
    icon: string;
    color: string;
    text: string;
    time: string;
  }[];
  monthly_chart: {
    month: string;
    count: number;
  }[];
}

let cachedDashboard: DashboardData | null = null;

export const dashboardService = {
  getDashboardData: async (): Promise<DashboardData> => {
    if (cachedDashboard) return cachedDashboard;
    const response = await axios.get('/admin/dashboard');
    cachedDashboard = response.data.data;
    return response.data.data;
  },

  clearCache: () => {
    cachedDashboard = null;
  }
};

export default dashboardService;
