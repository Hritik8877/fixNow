import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchServices } from '@/store/servicesSlice';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import ReviewCard from '@/components/ReviewCard';
import Loader from '@/components/Loader';
import Footer from '@/layouts/Footer';
import { Star, Clock, Shield, CheckCircle2, ArrowLeft } from 'lucide-react';

export default function ServiceDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(s => s.auth);
  const { allServices, fetched } = useSelector(s => s.services);

  const [reviews, setReviews] = useState([]);
  const [techInfo, setTechInfo] = useState(null);

  useEffect(() => { if (!fetched) dispatch(fetchServices()); }, [dispatch, fetched]);

  const service = allServices.find(s => s._id === id);

  useEffect(() => {
    if (id) {
      api.get(`/reviews/${id}`).then(r => setReviews(r.data)).catch(() => {});
    }
  }, [id]);

  if (!fetched) return <Loader />;
  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background transition-colors duration-500">
        <div className="text-center">
          <h2 className="text-xl font-black text-foreground mb-4 font-manrope">Service not found</h2>
          <Button onClick={() => navigate('/services')} className="rounded-2xl premium-gradient-btn text-white dark:text-background h-12 px-8 font-black uppercase tracking-widest">Browse Services</Button>
        </div>
      </div>
    );
  }

  const discount = Math.round(((service.originalPrice - service.price) / service.originalPrice) * 100);
  const handleBook = () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    navigate(`/booking/${service._id}`);
  };

  return (
    <div className="bg-background min-h-screen transition-colors duration-500" data-testid="service-detail-page">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        <button onClick={() => navigate(-1)} className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-primary mb-8 transition-all" data-testid="back-btn">
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> Back to services
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <div className="relative rounded-[40px] overflow-hidden h-64 sm:h-[400px] border border-outline-variant shadow-2xl">
              <img src={service.image} alt={service.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
              <div className="absolute bottom-10 left-10 right-10">
                <Badge className="bg-primary text-white dark:text-background rounded-full text-[10px] font-black uppercase tracking-widest px-4 py-1.5 mb-4 border-0 hover:bg-primary">{service.category.replace('-', ' ')}</Badge>
                <h1 className="text-4xl sm:text-5xl font-black text-white font-manrope leading-tight">{service.name}</h1>
              </div>
              {service.popular && <Badge className="absolute top-6 left-6 bg-amber-400 text-amber-900 hover:bg-amber-400 rounded-full text-[10px] font-black uppercase tracking-widest px-4 py-1.5 border-0">Popular Choice</Badge>}
            </div>

            <div className="bg-surface rounded-[32px] border border-outline-variant p-10 shadow-sm">
              <h2 className="text-2xl font-black text-foreground mb-6 font-manrope tracking-tight">About Experience</h2>
              <p className="text-base text-zinc-500 font-medium leading-relaxed mb-8 font-inter">{service.description}</p>
              
              <div className="pt-8 border-t border-outline-variant">
                <h3 className="text-sm font-black text-foreground uppercase tracking-[0.2em] mb-6 font-manrope">Superior Inclusions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {service.features?.map((f, i) => (
                    <div key={i} className="flex items-center gap-4 text-sm font-bold text-zinc-500 bg-surface-container-low/50 p-4 rounded-2xl border border-outline-variant">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0" strokeWidth={3} /> <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-black text-foreground mb-8 font-manrope tracking-tight">Verified Reviews <span className="text-primary ml-2">{reviews.length}</span></h2>
              {reviews.length === 0 ? (
                <div className="bg-surface-container-low/30 border-2 border-dashed border-outline-variant rounded-3xl p-12 text-center">
                   <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest">No feedback documented yet</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {reviews.map(r => <ReviewCard key={r._id} review={r} />)}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-surface rounded-[40px] border border-outline-variant p-10 shadow-2xl" data-testid="booking-sidebar">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl font-black text-foreground font-manrope tracking-tighter">₹{service.price?.toLocaleString()}</span>
                {service.originalPrice > service.price && (
                  <span className="text-lg font-bold text-zinc-500 line-through decoration-red-500/50 decoration-2">₹{service.originalPrice?.toLocaleString()}</span>
                )}
              </div>
              {discount > 0 && (
                <div className="inline-flex px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest mb-8 border border-emerald-500/20">
                  Exclusive {discount}% OFF
                </div>
              )}
              
              <Separator className="my-8 bg-outline-variant" />
              
              <div className="space-y-4 mb-10">
                <div className="flex items-center gap-4 text-sm font-bold text-zinc-500">
                  <div className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center border border-outline-variant"><Clock className="w-5 h-5 text-primary" /></div>
                  Duration: {service.duration}
                </div>
                <div className="flex items-center gap-4 text-sm font-bold text-zinc-500">
                  <div className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center border border-outline-variant"><Star className="w-5 h-5 fill-yellow-400 text-yellow-400" /></div>
                  Rating: {service.rating} ({service.reviewCount} Reviews)
                </div>
                <div className="flex items-center gap-4 text-sm font-bold text-zinc-500">
                  <div className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center border border-outline-variant"><Shield className="w-5 h-5 text-blue-500" /></div>
                  Premium Warranty Included
                </div>
              </div>

              <Button className="w-full h-16 rounded-2xl premium-gradient-btn text-white dark:text-background font-black text-lg uppercase tracking-widest shadow-xl shadow-primary/20" onClick={handleBook} data-testid="book-now-btn">
                Reserve Service
              </Button>
              <p className="text-center text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-6">Flexible cancellation policy</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
