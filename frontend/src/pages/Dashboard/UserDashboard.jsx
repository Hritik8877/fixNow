import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchBookings, submitReviewApi } from '@/store/bookingsSlice';
import { fetchServices } from '@/store/servicesSlice';
import { ArrowRight, Package, Clock, CheckCircle2, XCircle, ChevronDown, ChevronUp, Star, MapPin, ReceiptText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ServiceCard from '@/components/ServiceCard';
import BookingCard from '@/components/BookingCard';
import OrderTimeline from '@/components/OrderTimeline';
import Sidebar from '@/layouts/Sidebar';
import EmptyState from '@/components/EmptyState';
import Loader from '@/components/Loader';

const statusColors = {
  pending: 'bg-amber-500 text-white',
  accepted: 'bg-primary text-background',
  'in-progress': 'bg-primary text-background',
  completed: 'bg-emerald-500 text-white',
  cancelled: 'bg-red-500 text-white',
};

function OrderHistoryItem({ booking }) {
  const [expanded, setExpanded] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  const serviceName = booking.serviceId?.name || 'Service';

  const handleSubmitReview = async () => {
    if (rating === 0) return alert('Please select a rating');
    setIsSubmitting(true);
    try {
      await dispatch(submitReviewApi({ 
        serviceId: booking.serviceId || booking.serviceId?._id || booking.serviceId, 
        bookingId: booking._id, 
        rating, 
        comment 
      })).unwrap();
    } catch (err) {
      alert(err || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-surface rounded-[32px] border border-outline-variant shadow-sm overflow-hidden transition-all hover:shadow-md" data-testid={`order-history-${booking._id}`}>
      <button onClick={() => setExpanded(!expanded)} className="w-full p-8 flex items-center justify-between text-left transition-colors" data-testid={`toggle-timeline-${booking._id}`}>
        <div className="flex items-center gap-6 flex-1 min-w-0">
          {booking.serviceId?.image && (
            <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 border border-outline-variant">
              <img src={booking.serviceId.image} alt="" className="w-full h-full object-cover" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-3 flex-wrap mb-1">
              <h4 className="font-bold text-lg text-foreground truncate font-manrope">{serviceName}</h4>
              <Badge className={`rounded-full text-[10px] font-black uppercase tracking-widest px-3 py-1 border-0 ${statusColors[booking.status]}`}>{booking.status}</Badge>
            </div>
            <div className="flex items-center gap-4 text-xs font-bold text-zinc-500 uppercase tracking-widest">
              <span>{booking.date}</span>
              <div className="w-1 h-1 rounded-full bg-outline-variant" />
              <span>{booking.time}</span>
              <div className="w-1 h-1 rounded-full bg-outline-variant" />
              <span className="text-foreground font-manrope font-black">₹{booking.total?.toLocaleString()}</span>
            </div>
          </div>
        </div>
        <div className="shrink-0 ml-4 w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center border border-outline-variant">
          {expanded ? <ChevronUp className="w-5 h-5 text-foreground" /> : <ChevronDown className="w-5 h-5 text-foreground" />}
        </div>
      </button>
      {expanded && (
        <div className="px-8 pb-8 pt-4 border-t border-outline-variant bg-surface-container-low/30">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Package className="w-4 h-4 text-zinc-500" />
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Technician: <span className="text-foreground">{booking.technicianId?.name || 'Assigned soon'}</span></p>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-zinc-500 mt-0.5" />
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest leading-relaxed">Location: <span className="text-foreground">{booking.address}</span></p>
              </div>
            </div>
            <div className="bg-surface rounded-2xl p-6 border border-outline-variant shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                    <ReceiptText className="w-4 h-4 text-primary" />
                    <h5 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Status Overview</h5>
                </div>
                <OrderTimeline timeline={booking.timeline} currentStatus={booking.status} />
            </div>
          </div>
          
          {booking.status === 'completed' && !booking.isReviewed && (
            <div className="mt-8 pt-8 border-t border-outline-variant" data-testid={`review-form-${booking._id}`}>
              <h5 className="text-lg font-bold text-foreground mb-4 font-manrope">Share Your Experience</h5>
              <div className="flex gap-2 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} onClick={() => setRating(star)} className={`text-3xl transition-all duration-200 transform hover:scale-110 ${rating >= star ? 'text-primary fill-primary' : 'text-zinc-200'}`}>
                    <Star className={`w-8 h-8 ${rating >= star ? 'fill-yellow-400 text-yellow-400' : 'text-zinc-200 dark:text-zinc-800'}`} />
                  </button>
                ))}
              </div>
              <textarea 
                value={comment} 
                onChange={(e) => setComment(e.target.value)}
                placeholder="How was the service? Your feedback helps us maintain excellence." 
                className="w-full text-sm p-5 rounded-2xl border border-outline-variant bg-surface-container-low resize-none focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none transition-all mb-4 text-foreground font-medium"
                rows={3}
              />
              <Button onClick={handleSubmitReview} disabled={isSubmitting || rating === 0} className="w-full h-14 premium-gradient-btn text-background font-black text-lg rounded-2xl shadow-xl shadow-primary/10 transition-all hover:scale-[1.01]" data-testid={`submit-review-${booking._id}`}>
                {isSubmitting ? 'Finalizing...' : 'Submit Review'}
              </Button>
            </div>
          )}
          {booking.status === 'completed' && booking.isReviewed && (
            <div className="mt-8 pt-6 border-t border-outline-variant flex items-center justify-center gap-3 text-emerald-600 text-sm font-black uppercase tracking-widest bg-emerald-500/10 rounded-2xl py-4">
              <CheckCircle2 className="w-6 h-6" />
              <span>Review Verified</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function UserDashboard() {
  const { user } = useSelector(s => s.auth);
  const { bookings, loading: bookingsLoading, fetched: bookingsFetched } = useSelector(s => s.bookings);
  const { allServices, fetched: servicesFetched } = useSelector(s => s.services);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!bookingsFetched) dispatch(fetchBookings());
    if (!servicesFetched) dispatch(fetchServices());
  }, [dispatch, bookingsFetched, servicesFetched]);

  const activeBookings = bookings.filter(b => ['pending', 'accepted', 'in-progress'].includes(b.status));
  const completedBookings = bookings.filter(b => b.status === 'completed');
  const cancelledBookings = bookings.filter(b => b.status === 'cancelled');
  const recommended = allServices.filter(s => s.popular).slice(0, 3);

  const stats = [
    { label: 'Active', value: activeBookings.length, icon: Clock, color: 'bg-primary/10 text-primary-container' },
    { label: 'Done', value: completedBookings.length, icon: CheckCircle2, color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Denied', value: cancelledBookings.length, icon: XCircle, color: 'bg-red-50 text-red-600' },
    { label: 'Total', value: bookings.length, icon: Package, color: 'bg-zinc-900 text-white' },
  ];

  if (bookingsLoading && !bookingsFetched) return <div className="flex min-h-[calc(100vh-5rem)] bg-background transition-colors duration-500"><Sidebar role="user" /><main className="flex-1"><Loader text="Initializing your concierge..." /></main></div>;

  return (
    <div className="flex min-h-[calc(100vh-5rem)] bg-background transition-colors duration-500" data-testid="user-dashboard">
      <Sidebar role="user" />
      <main className="flex-1 p-8 md:p-12 lg:p-16 overflow-auto">
        {/* Welcome */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-high border border-outline-variant text-foreground text-[10px] font-black uppercase tracking-widest mb-4">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /> Premium Member
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-foreground tracking-tight font-manrope">
            Greetings, {user?.name?.split(' ')[0] || 'Member'}
          </h1>
          <p className="text-zinc-500 font-medium mt-2 font-inter">Managing your elite service architecture.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map(stat => (
            <div key={stat.label} className="bg-surface rounded-[32px] border border-outline-variant p-8 shadow-sm transition-transform hover:scale-[1.02]" data-testid={`stat-${stat.label.toLowerCase()}`}>
              <div className={`w-12 h-12 rounded-2xl ${stat.color} flex items-center justify-center mb-6`}>
                <stat.icon className="w-6 h-6" strokeWidth={2.5} />
              </div>
              <p className="text-4xl font-black text-foreground font-manrope tracking-tighter mb-1">{stat.value}</p>
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">{stat.label} Tasks</p>
            </div>
          ))}
        </div>

        {/* Active Bookings */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-foreground tracking-tight font-manrope">Live Operations</h2>
          </div>
          {activeBookings.length === 0 ? (
            <div className="bg-surface rounded-[40px] border border-outline-variant p-12 text-center shadow-sm">
              <EmptyState title="No active operations" description="Ready to schedule your next maintenance session?" actionLabel="Access Catalog" onAction={() => window.location.href = '/services'} />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeBookings.map(b => <BookingCard key={b._id} booking={b} />)}
            </div>
          )}
        </div>

        {/* Order History */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-foreground tracking-tight font-manrope" data-testid="order-history-heading">Service Ledger</h2>
          </div>
          {bookings.length === 0 ? (
            <EmptyState title="Ledger is empty" description="Your service history will be archived here" />
          ) : (
            <div className="space-y-6" data-testid="order-history-list">
              {bookings.map(b => <OrderHistoryItem key={b._id} booking={b} />)}
            </div>
          )}
        </div>

        {/* Recommended */}
        {recommended.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight font-manrope">Curated for You</h2>
              <Link to="/services">
                <Button variant="ghost" className="text-primary font-black text-[10px] uppercase tracking-widest gap-2 hover:bg-primary/5 px-6 py-6 rounded-2xl" data-testid="view-all-recommended">
                  Expand Catalog <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recommended.map(s => <ServiceCard key={s._id} service={s} isPremium={true} />)}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
