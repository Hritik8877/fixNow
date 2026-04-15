import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchServices } from '@/store/servicesSlice';
import { Search, MapPin, ArrowRight, Star, Shield, Clock, CheckCircle2, Wind, Snowflake, Waves, Camera, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import ServiceCard from '@/components/ServiceCard';
import Footer from '@/layouts/Footer';
import { categories, testimonials, locations, IMAGES } from '@/data/mockData';

const iconMap = { Wind, Snowflake, Waves, Camera, Monitor };

function HeroSection() {
  const navigate = useNavigate();
  const [location, setLocation] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    navigate(`/services${searchQuery ? `?search=${searchQuery}` : ''}`);
  };

  return (
    <section className="relative min-h-screen flex items-center bg-background overflow-hidden transition-colors duration-500" data-testid="hero-section">
      <div className="absolute inset-0 z-0">
        <img src={IMAGES.hero} alt="Home services" className="w-full h-full object-cover opacity-60 dark:opacity-40 brightness-110 dark:brightness-50 transition-opacity" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/60 to-background" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 dark:bg-primary/10 rounded-full blur-[120px] animate-pulse" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-20 w-full">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-widest mb-6 animate-fade-in-up">
            <Shield className="w-3 h-3" /> Trusted Home Concierge
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black text-foreground tracking-tighter leading-[0.9] mb-8 animate-fade-in-up stagger-1 font-manrope">
            Expert Care.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-container">Seamlessly Delivered.</span>
          </h1>
          <p className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed mb-12 max-w-xl animate-fade-in-up stagger-2 font-inter">
            Experience the next generation of home maintenance. Certified technicians, transparent pricing, and instant booking.
          </p>
          
          <div className="glass p-2 rounded-3xl flex flex-col md:flex-row gap-2 animate-fade-in-up stagger-3" data-testid="hero-search-bar">
            <div className="flex items-center gap-3 bg-zinc-100/50 dark:bg-white/5 rounded-2xl px-5 h-16 flex-1 min-w-[200px]">
              <MapPin className="w-5 h-5 text-primary" />
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger className="border-0 bg-transparent text-foreground shadow-none h-full px-0 focus:ring-0 font-medium" data-testid="hero-location-select">
                  <SelectValue placeholder="City" />
                </SelectTrigger>
                <SelectContent className="glass border-outline-variant text-foreground rounded-2xl">
                  {locations.map(loc => <SelectItem key={loc} value={loc} className="hover:bg-primary/20 focus:bg-primary/20">{loc}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-3 bg-zinc-100/50 dark:bg-white/5 rounded-2xl px-5 h-16 flex-[2] min-w-[300px]">
              <Search className="w-5 h-5 text-zinc-500" />
              <Input 
                placeholder="What can we fix for you?" 
                value={searchQuery} 
                onChange={e => setSearchQuery(e.target.value)}
                className="border-0 bg-transparent text-foreground shadow-none h-full px-0 focus-visible:ring-0 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 font-medium" 
                data-testid="hero-search-input"
                onKeyDown={e => e.key === 'Enter' && handleSearch()} 
              />
            </div>
            <Button 
              className="h-16 px-10 rounded-2xl premium-gradient-btn text-white dark:text-background font-bold text-lg" 
              onClick={handleSearch} 
              data-testid="hero-search-btn"
            >
              Search
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-8 mt-12 animate-fade-in-up stagger-4">
            <div className="flex items-center gap-3 text-zinc-500 dark:text-zinc-400 text-sm font-medium">
              <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
              </div>
              Verified Experts
            </div>
            <div className="flex items-center gap-3 text-zinc-500 dark:text-zinc-400 text-sm font-medium">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Shield className="w-4 h-4 text-primary" />
              </div>
              $1M Protection
            </div>
            <div className="flex items-center gap-3 text-zinc-500 dark:text-zinc-400 text-sm font-medium">
              <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center">
                <Clock className="w-4 h-4 text-amber-500 dark:text-amber-400" />
              </div>
              Same Day Fix
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CategoriesSection() {
  return (
    <section className="py-32 px-6 md:px-12 bg-background relative overflow-hidden" data-testid="categories-section">
      <div className="absolute right-0 top-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px]" />
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <p className="text-primary font-bold uppercase tracking-widest text-xs mb-4">Curated Specialties</p>
            <h2 className="text-4xl sm:text-5xl font-black text-foreground font-manrope">World-class services,<br /> right at your doorstep.</h2>
          </div>
          <p className="text-zinc-500 max-w-xs font-inter">We've selected the most trusted professionals for every home need.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat, i) => {
            const Icon = iconMap[cat.icon] || Wind;
            return (
              <Link to={`/services?category=${cat.id}`} key={cat.id}
                className={`group relative overflow-hidden rounded-[32px] border border-outline-variant bg-surface-container-low p-8 transition-all duration-500 hover:border-primary/30 hover:bg-surface-container-high ${i === 0 ? 'lg:col-span-2 lg:row-span-1' : ''}`}
                data-testid={`category-card-${cat.id}`}>
                <div className="flex flex-col h-full justify-between gap-12">
                  <div className={`w-14 h-14 rounded-2xl ${cat.color} bg-opacity-10 dark:bg-opacity-10 border border-outline-variant flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <Icon className="w-7 h-7" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-2xl mb-2 font-manrope">{cat.name}</h3>
                    <p className="text-zinc-500 dark:text-zinc-500 text-sm leading-relaxed mb-6 line-clamp-2">{cat.description}</p>
                    <div className="flex items-center justify-between pt-4 border-t border-outline-variant">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-600 group-hover:text-primary transition-colors">{cat.serviceCount} Services Available</span>
                      <ArrowRight className="w-5 h-5 text-zinc-400 dark:text-zinc-700 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function PopularServices() {
  const dispatch = useDispatch();
  const { allServices, fetched } = useSelector(s => s.services);
  useEffect(() => { if (!fetched) dispatch(fetchServices()); }, [dispatch, fetched]);
  const popular = allServices.slice(0, 6);
  return (
    <section className="py-32 px-6 md:px-12 bg-surface-container-low/30" data-testid="popular-services-section">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-16">
          <div>
            <p className="text-primary font-bold uppercase tracking-widest text-xs mb-4">Trending Now</p>
            <h2 className="text-4xl sm:text-5xl font-black text-foreground font-manrope">Most Requested</h2>
          </div>
          <Link to="/services">
            <Button variant="outline" className="rounded-2xl border-outline-variant text-foreground hover:bg-surface-container-low h-12 px-6 font-bold" data-testid="view-all-services-btn">
              Explore All <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {popular.map(service => <ServiceCard key={service._id} service={service} isPremium={true} />)}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { icon: Search, title: 'Discover', desc: 'Browse our catalog of premium services or search for exactly what you need.' },
    { icon: Clock, title: 'Schedule', desc: 'Choose a time slot that fits your lifestyle. Our pros are punctual and ready.' },
    { icon: CheckCircle2, title: 'Transform', desc: 'Relax as our vetted professionals handle the hard work with surgical precision.' },
  ];
  return (
    <section className="py-32 px-6 md:px-12 bg-background" data-testid="how-it-works-section">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <p className="text-primary font-bold uppercase tracking-widest text-xs mb-4">Innovation in service</p>
          <h2 className="text-4xl sm:text-5xl font-black text-foreground font-manrope">The FixNow Protocol</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          <div className="hidden md:block absolute top-1/3 left-1/4 right-1/4 h-[2px] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
          {steps.map((step, i) => (
            <div key={i} className="relative z-10 group" data-testid={`how-step-${i}`}>
              <div className="w-24 h-24 rounded-[32px] bg-surface-container-high border border-outline-variant flex items-center justify-center mx-auto mb-8 transition-all duration-500 group-hover:bg-primary group-hover:scale-110 shadow-2xl">
                <step.icon className="w-10 h-10 text-primary group-hover:text-white dark:group-hover:text-background transition-colors" strokeWidth={1.5} />
              </div>
              <div className="text-center">
                <div className="text-[10px] font-black text-primary uppercase tracking-widest mb-2">Phase 0{i + 1}</div>
                <h3 className="font-bold text-foreground text-2xl mb-4 font-manrope">{step.title}</h3>
                <p className="text-zinc-500 dark:text-zinc-500 text-sm leading-relaxed max-w-[240px] mx-auto font-inter">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  return (
    <section className="py-32 px-6 md:px-12 bg-surface-container-low/50" data-testid="testimonials-section">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <p className="text-primary font-bold uppercase tracking-widest text-xs mb-4">Trust is earned</p>
          <h2 className="text-4xl sm:text-5xl font-black text-foreground font-manrope">Client Stories</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map(t => (
            <div key={t.id} className="glass border border-outline-variant p-12 rounded-[40px] relative overflow-hidden group" data-testid={`testimonial-${t.id}`}>
              <div className="absolute top-0 right-0 p-8">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star key={star} className={`w-4 h-4 ${star <= t.rating ? 'fill-yellow-400 text-yellow-400' : 'fill-outline-variant text-outline-variant'}`} />
                  ))}
                </div>
              </div>
              <div className="relative z-10">
                <p className="text-xl text-zinc-600 dark:text-zinc-300 font-medium italic mb-10 leading-relaxed font-inter">"{t.comment}"</p>
                <div className="flex items-center gap-4">
                  <Avatar className="w-14 h-14 border-2 border-primary/20">
                    <AvatarFallback className="bg-primary/10 text-primary text-lg font-bold uppercase">{t.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-lg font-bold text-foreground font-manrope">{t.name}</p>
                    <p className="text-sm text-zinc-500 uppercase tracking-widest font-semibold">{t.role}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  const navigate = useNavigate();
  return (
    <section className="py-32 px-6 md:px-12 bg-background" data-testid="cta-section">
      <div className="max-w-7xl mx-auto">
        <div className="relative overflow-hidden rounded-[56px] bg-gradient-to-br from-primary-container via-primary-container to-blue-700 p-16 md:p-24 text-center">
          <div className="absolute inset-0 opacity-20 mix-blend-overlay">
            <img src={IMAGES.abstract} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/20 rounded-full blur-[100px]" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary/30 rounded-full blur-[100px]" />
          
          <div className="relative z-10">
            <h2 className="text-5xl sm:text-7xl font-black text-white dark:text-background tracking-tighter mb-8 font-manrope">Ready for the upgrade?</h2>
            <p className="text-blue-100 dark:text-blue-100 text-xl mb-12 max-w-2xl mx-auto font-inter opacity-90">Join thousands of homeowners who prioritize quality. Your first project starts here.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Button size="lg" className="h-16 px-12 rounded-[20px] bg-white dark:bg-background text-primary-container hover:bg-zinc-100 transition-all font-bold text-lg" onClick={() => navigate('/signup')} data-testid="cta-signup-btn">
                Experience FixNow
              </Button>
              <Button size="lg" variant="outline" className="h-16 px-12 rounded-[20px] border-white/30 text-white hover:bg-white/10 font-bold text-lg backdrop-blur-sm" onClick={() => navigate('/services')} data-testid="cta-browse-btn">
                Our Services
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function LandingPage() {
  return (
    <div className="bg-background selection:bg-primary selection:text-background" data-testid="landing-page">
      <HeroSection />
      <div className="relative">
        <CategoriesSection />
        <PopularServices />
        <HowItWorks />
        <TestimonialsSection />
        <CTASection />
      </div>
      <Footer />
    </div>
  );
}
