import { useSelector, useDispatch } from 'react-redux';
import { setFilter, setSortBy, fetchServices } from '@/store/servicesSlice';
import { useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import ServiceCard from '@/components/ServiceCard';
import FilterPanel from '@/components/FilterPanel';
import EmptyState from '@/components/EmptyState';
import Loader from '@/components/Loader';
import Footer from '@/layouts/Footer';

export default function ServicesPage() {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const { filteredServices, filters, sortBy, loading, fetched } = useSelector(s => s.services);

  useEffect(() => {
    if (!fetched) dispatch(fetchServices());
  }, [dispatch, fetched]);

  useEffect(() => {
    const cat = searchParams.get('category');
    const search = searchParams.get('search');
    if (cat) dispatch(setFilter({ category: cat }));
    if (search) dispatch(setFilter({ search }));
  }, [searchParams, dispatch]);

  return (
    <div className="bg-background min-h-screen pb-20 transition-colors duration-500" data-testid="services-page">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mb-4">
            <Search className="w-3 h-3" /> Catalog
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-foreground tracking-tight font-manrope">Elite Services</h1>
          <p className="text-zinc-500 font-medium mt-2">{filteredServices.length} premium solutions curated for you</p>
        </div>

        <div className="flex flex-col sm:row gap-4 mb-12">
          <div className="flex items-center gap-3 bg-surface rounded-2xl border border-outline-variant px-5 shadow-sm flex-1 group focus-within:border-primary transition-all">
            <Search className="w-5 h-5 text-zinc-400 group-focus-within:text-primary" />
            <Input placeholder="Search services..." value={filters.search} onChange={e => dispatch(setFilter({ search: e.target.value }))}
              className="border-0 bg-transparent shadow-none h-14 px-0 focus-visible:ring-0 font-medium text-foreground" data-testid="services-search-input" />
          </div>
          <Select value={sortBy} onValueChange={val => dispatch(setSortBy(val))}>
            <SelectTrigger className="rounded-2xl h-14 bg-surface border-outline-variant w-full sm:w-64 font-bold text-foreground shadow-sm" data-testid="services-sort-select">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-outline-variant shadow-xl bg-surface text-foreground">
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="reviews">Most Reviews</SelectItem>
            </SelectContent>
          </Select>
          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="outline" className="rounded-2xl h-14 gap-3 border-outline-variant font-bold text-foreground hover:bg-surface-container-low" data-testid="mobile-filter-btn">
                <SlidersHorizontal className="w-5 h-5" /> Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full sm:w-80 p-8 bg-surface border-r border-outline-variant overflow-y-auto">
              <FilterPanel />
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex gap-12 items-start">
          <div className="hidden lg:block w-80 shrink-0 sticky top-24">
            <div className="bg-surface rounded-[32px] border border-outline-variant p-8 shadow-sm">
              <FilterPanel />
            </div>
          </div>
          <div className="flex-1">
            {loading && !fetched ? <Loader /> : filteredServices.length === 0 ? (
              <EmptyState title="No services found" description="Try adjusting your filters or search query" />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-8" data-testid="services-grid">
                {filteredServices.map(s => <ServiceCard key={s._id} service={s} isPremium={true} />)}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
