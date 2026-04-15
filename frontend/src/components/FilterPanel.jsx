import { useDispatch, useSelector } from 'react-redux';
import { setFilter, resetFilters } from '@/store/servicesSlice';
import { categories } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star, RotateCcw } from 'lucide-react';

export default function FilterPanel() {
  const dispatch = useDispatch();
  const { filters } = useSelector(s => s.services);

  return (
    <div className="space-y-10" data-testid="filter-panel">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black text-foreground uppercase tracking-[0.2em] font-manrope">Refine Search</h3>
        <Button variant="ghost" size="sm" className="text-[10px] font-black text-zinc-500 hover:text-red-500 uppercase tracking-widest gap-2 h-auto p-0" onClick={() => dispatch(resetFilters())} data-testid="reset-filters-btn">
          <RotateCcw className="w-3 h-3" /> Clear All
        </Button>
      </div>

      {/* Category */}
      <div className="space-y-4">
        <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 block px-1">Specialty</Label>
        <Select value={filters.category} onValueChange={val => dispatch(setFilter({ category: val === 'all' ? '' : val }))} data-testid="category-filter">
          <SelectTrigger className="rounded-2xl h-12 bg-surface-container-low border-outline-variant font-bold text-xs text-foreground" data-testid="category-filter-trigger">
            <SelectValue placeholder="All Specializations" />
          </SelectTrigger>
          <SelectContent className="rounded-2xl border-outline-variant shadow-xl overflow-hidden bg-surface text-foreground">
            <SelectItem value="all" className="font-bold text-xs">All Specializations</SelectItem>
            {categories.map(cat => (
              <SelectItem key={cat.id} value={cat.id} className="font-bold text-xs">{cat.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Price Range */}
      <div className="space-y-6">
        <div className="flex justify-between items-end px-1">
            <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 block">Investment Range</Label>
            <span className="text-xs font-black text-foreground font-manrope">₹0 - ₹{filters.maxPrice.toLocaleString()}</span>
        </div>
        <div className="px-2">
            <Slider
              min={0} max={10000} step={100}
              value={[filters.maxPrice]}
              onValueChange={([val]) => dispatch(setFilter({ maxPrice: val }))}
              className="mt-2"
              data-testid="price-filter-slider"
            />
        </div>
      </div>

      {/* Rating */}
      <div className="space-y-4">
        <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 block px-1">Quality Threshold</Label>
        <div className="grid grid-cols-2 gap-2">
          {[0, 3, 4, 4.5].map(rating => (
            <button key={rating} onClick={() => dispatch(setFilter({ minRating: rating }))}
              data-testid={`rating-filter-${rating}`}
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${filters.minRating === rating ? 'bg-foreground text-background border-foreground shadow-lg shadow-foreground/10' : 'bg-surface text-zinc-500 border-outline-variant hover:border-zinc-400 dark:hover:border-zinc-600 hover:text-foreground'}`}>
              {rating === 0 ? 'Any' : <><Star className={`w-3 h-3 ${filters.minRating === rating ? 'fill-yellow-400 text-yellow-400' : 'text-zinc-500'}`} fill={filters.minRating === rating ? 'currentColor' : 'none'} /> {rating}+</>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
