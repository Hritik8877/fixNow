import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Star } from 'lucide-react';

export default function ReviewCard({ review }) {
  const initials = review.userName?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';

  return (
    <div className="bg-surface rounded-3xl border border-outline-variant p-6 shadow-sm transition-all hover:border-primary/50" data-testid={`review-card-${review._id}`}>
      <div className="flex items-start gap-4 mb-4">
        <Avatar className="w-12 h-12 ring-2 ring-primary/5">
          <AvatarFallback className="bg-primary/10 text-primary text-sm font-black font-manrope">{initials}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="text-base font-black text-foreground font-manrope">{review.userName}</h4>
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{review.date}</span>
          </div>
          <div className="flex items-center gap-0.5 mt-1">
            {[1, 2, 3, 4, 5].map(star => (
              <Star key={star} className={`w-3.5 h-3.5 ${star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'fill-zinc-200 dark:fill-zinc-800 text-zinc-200 dark:text-zinc-800'}`} />
            ))}
          </div>
        </div>
      </div>
      <p className="text-sm font-medium text-zinc-500 leading-relaxed font-inter">{review.comment}</p>
    </div>
  );
}
