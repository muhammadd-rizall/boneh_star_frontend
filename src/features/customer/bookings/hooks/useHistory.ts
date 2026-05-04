import { useState, useCallback } from 'react';
import { historyService } from '../services/HistoryService';
import type { CustomerBooking } from '../types/Booking';

export function useHistory() {
  const [history, setHistory] = useState<CustomerBooking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = useCallback(async () => {
    try {
      setLoading(true);
      const data = await historyService.getHistory();
      setHistory(data.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  return { history, loading, refresh: fetchHistory };
}
