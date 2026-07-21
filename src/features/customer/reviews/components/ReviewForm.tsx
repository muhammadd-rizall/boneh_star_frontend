import React from 'react';
import type { ReviewFormData } from '../types/Review';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { DialogFooter } from "@/components/ui/Dialog";
import StarRating from './StarRating';

interface Props {
  bookingId: string;
  initialRating?: number;
  initialComment?: string;
  onSubmit: (data: ReviewFormData) => Promise<void>;
  onCancel?: () => void;
}

export default function ReviewForm({ bookingId, initialRating = 5, initialComment = '', onSubmit, onCancel }: Props) {
  const [rating, setRating] = React.useState(initialRating);
  const [comment, setComment] = React.useState(initialComment);
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-10">
      <div className="flex flex-col items-center gap-4 text-center">
        <div>
          <h3 className="text-lg font-black tracking-tight text-slate-950">Bagaimana perjalanan Anda?</h3>
          <p className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-widest">Berikan penilaian bintang untuk layanan kami</p>
        </div>
        <StarRating rating={rating} onRatingChange={setRating} size={40} />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Detail Pengalaman</label>
        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Ceritakan apa yang Anda sukai atau area yang perlu kami tingkatkan..."
          className="rounded-[2rem] border-slate-100 min-h-[120px] focus:border-orange-500"
          required
        />
      </div>

      <DialogFooter>
        {onCancel && (
          <Button 
            type="button" 
            variant="ghost" 
            onClick={onCancel} 
            className="px-10 font-bold" 
            disabled={loading}
          >
            Batal
          </Button>
        )}
        <Button 
          type="submit" 
          variant="primary"
          loading={loading} 
          className="flex-1"
        >
          Kirim Ulasan
        </Button>
      </DialogFooter>
    </form>
  );
}
