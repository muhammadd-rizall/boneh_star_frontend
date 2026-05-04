import { useState, useEffect, useCallback } from 'react';
import { reviewService } from '../services/ReviewService';
import type { CustomerReview, ReviewFormData, UpdateReviewFormData } from '../types/Review';

export function useReviews() {
  const [reviews, setReviews] = useState<CustomerReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      const response = await reviewService.getAll();
      setReviews(response.data.data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const createReview = async (data: ReviewFormData) => {
    const result = await reviewService.create(data);
    await fetchReviews();
    return result;
  };

  const updateReview = async (id: string, data: UpdateReviewFormData) => {
    const result = await reviewService.update(id, data);
    await fetchReviews();
    return result;
  };

  return { reviews, loading, error, refresh: fetchReviews, createReview, updateReview };
}
