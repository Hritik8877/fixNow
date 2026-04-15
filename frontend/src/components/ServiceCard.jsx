import { Link } from 'react-router-dom';
import { Star, Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function ServiceCard({ service, isPremium = false }) {
  const discount = Math.round(((service.originalPrice - service.price) / service.originalPrice) * 100);

  const cardClasses = isPremium 
    ? "group bg-surface-container-low/80 dark:bg-surface-container-low/50 backdrop-blur-md rounded-[32px] border border-outline-variant hover:border-primary/30 transition-all duration-500 overflow-hidden" 
    : "group bg-surface rounded-2xl border border-outline-variant shadow-sm card-hover overflow-hidden";

  const titleClasses = isPremium ? "text-xl font-bold text-foreground mb-2 font-manrope" : "font-semibold text-foreground mb-2 line-clamp-1 font-outfit";
  const textClasses = isPremium ? "text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-4 line-clamp-2 font-inter" : "text-sm text-zinc-500 line-clamp-2 mb-3";
  const priceClasses = isPremium ? "text-2xl font-black text-foreground font-manrope" : "text-lg font-bold text-foreground";

  return (
    <div className={cardClasses} data-testid={`service-card-${service._id}`}>
      <div className="relative h-56 overflow-hidden">
        <img src={service.image} alt={service.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        <div className={`absolute inset-0 bg-gradient-to-t ${isPremium ? 'from-background/80 dark:from-background via-transparent' : 'from-background/40'} to-transparent`} />
        {service.popular && (
          <Badge className={`absolute top-4 left-4 ${isPremium ? 'bg-primary text-white dark:text-background' : 'bg-amber-400 text-amber-900'} hover:opacity-90 rounded-full text-[10px] uppercase tracking-widest font-black px-3 py-1`} data-testid={`popular-badge-${service._id}`}>
            Popular
          </Badge>
        )}
        {discount > 0 && (
          <Badge className={`absolute top-4 right-4 ${isPremium ? 'bg-background/20 text-foreground backdrop-blur-md border border-white/20' : 'bg-emerald-500 text-white'} hover:opacity-90 rounded-full text-[10px] font-bold px-3 py-1`}>
            {discount}% OFF
          </Badge>
        )}
      </div>
      <div className="p-8">
        <div className="flex items-center justify-between mb-3 text-[10px] uppercase tracking-[0.2em] font-bold text-primary">
          <span>{service.category.replace('-', ' ')}</span>
          <div className="flex items-center gap-1.5 bg-primary/5 px-2 py-1 rounded-lg">
            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
            <span className="text-foreground">{service.rating}</span>
          </div>
        </div>
        <h3 className={titleClasses}>{service.name}</h3>
        <p className={textClasses}>{service.shortDesc}</p>
        
        <div className="flex items-center gap-4 mb-8 text-zinc-500 dark:text-zinc-400 font-medium text-xs">
          <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {service.duration}</div>
          <div className="w-1 h-1 rounded-full bg-zinc-200 dark:bg-zinc-800" />
          <div>{service.reviewCount} Reviews</div>
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-outline-variant">
          <div className="flex flex-col">
            <span className={priceClasses}>₹{service.price.toLocaleString()}</span>
            {service.originalPrice > service.price && (
              <span className="text-xs text-zinc-500 line-through decoration-primary/50">₹{service.originalPrice.toLocaleString()}</span>
            )}
          </div>
          <Link to={`/services/${service._id}`}>
            <Button size="lg" className={`rounded-2xl transition-all duration-300 ${isPremium ? 'premium-gradient-btn text-white dark:text-background font-bold h-12 px-6' : 'bg-primary text-white h-10 px-5 text-sm gap-2'}`} data-testid={`book-btn-${service._id}`}>
              Book <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
