import React from 'react';
import { Star } from 'lucide-react';

interface Props {
  rating: number;
  onRatingChange?: (rating: number) => void;
  maxRating?: number;
  size?: number;
  readonly?: boolean;
}

export default function StarRating({ 
  rating, 
  onRatingChange, 
  maxRating = 5, 
  size = 20, 
  readonly = false 
}: Props) {
  const [hoverRating, setHoverRating] = React.useState(0);

  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: maxRating }).map((_, i) => {
        const starValue = i + 1;
        const isActive = hoverRating ? starValue <= hoverRating : starValue <= rating;
        
        return (
          <button
            key={i}
            type="button"
            disabled={readonly}
            onClick={() => onRatingChange?.(starValue)}
            onMouseEnter={() => !readonly && setHoverRating(starValue)}
            onMouseLeave={() => !readonly && setHoverRating(0)}
            className={`${readonly ? 'cursor-default' : 'cursor-pointer'} transition-all hover:scale-110 active:scale-90 duration-200`}
          >
            <Star
              size={size}
              className={`transition-colors duration-300 ${
                isActive 
                  ? 'fill-amber-400 text-amber-400 drop-shadow-sm' 
                  : 'text-slate-200'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}
