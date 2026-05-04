import React from 'react';
import type { ReviewFormData } from '../types/Review';
import Button from '@/components/ui/Button';
import Textarea from '@/components/ui/Textarea';
import StarRating from './StarRating';

interface Props {
  bookingId: string;
  onSubmit: (data: ReviewFormData) => Promise<void>;
  onCancel: () => void;
}

export default function ReviewForm({ bookingId, onSubmit, onCancel }: Props) {
  const [rating, setRating] = React.useState(5);
  const [comment, setComment] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit({ booking_id: bookingId, rating, comment });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-2">
        <label className="text-sm font-bold text-slate-700">Berikan Penilaian Anda</label>
        <StarRating rating={rating} onRatingChange={setRating} size={32} />
      </div>

      <Textarea
        label="Ulasan Anda"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Bagikan pengalaman perjalanan Anda bersama kami..."
        required
      />

      <div className="flex gap-3">
        <Button type="button" variant="ghost" onClick={onCancel} className="flex-1" disabled={loading}>
          Batal
        </Button>
        <Button type="submit" loading={loading} className="flex-1">
          Kirim Ulasan
        </Button>
      </div>
    </form>
  );
}
