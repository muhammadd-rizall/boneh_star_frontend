import axios from '@/api/Axios';

export interface DashboardData {
  stats: {
    label: string;
    value: string;
    sub: string;
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
}

export const dashboardService = {
  getDashboardData: async (): Promise<DashboardData> => {
    const response = await axios.get('/admin/dashboard');
    return response.data.data;
  }
};

export default dashboardService;
