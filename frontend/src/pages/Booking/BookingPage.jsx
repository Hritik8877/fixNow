import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { createBooking } from '@/store/bookingsSlice';
import { fetchServices } from '@/store/servicesSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Separator } from '@/components/ui/separator';
import Loader from '@/components/Loader';
import { ArrowLeft, MapPin, Clock, Shield, CreditCard, Banknote, Calendar as CalendarIcon, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

const timeSlots = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'];

export default function BookingPage() {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector(s => s.auth);
  const { allServices, fetched } = useSelector(s => s.services);

  const [date, setDate] = useState(undefined);
  const [time, setTime] = useState('');
  const [address, setAddress] = useState(user?.addresses?.[0]?.address || '');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (!fetched) dispatch(fetchServices()); }, [dispatch, fetched]);

  if (!isAuthenticated) { navigate('/login'); return null; }

  const service = allServices.find(s => s._id === serviceId);
  if (!fetched) return <Loader />;
  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="text-center">
          <h2 className="text-2xl font-black text-zinc-900 font-manrope">Service not found</h2>
          <Button onClick={() => navigate('/services')} className="mt-6 rounded-2xl bg-zinc-900 text-white hover:bg-zinc-800 h-12 px-8 font-bold">Browse Services</Button>
        </div>
      </div>
    );
  }

  const handleConfirm = async () => {
    if (!date) { toast.error('Please select a date'); return; }
    if (!time) { toast.error('Please select a time slot'); return; }
    if (!address.trim()) { toast.error('Please enter your address'); return; }

    if (paymentMethod === 'card') {
      toast.error('Online payment is currently unavailable. Please use Cash on Delivery.');
      return;
    }

    setLoading(true);
    const result = await dispatch(createBooking({
      serviceId: service._id,
      date: date.toISOString().split('T')[0],
      time, address,
      paymentMethod,
    }));

    if (createBooking.fulfilled.match(result)) {
      toast.success('Thank you! Your booking is confirmed.');
      navigate('/dashboard');
    } else {
      toast.error(result.payload || 'Booking failed. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background pb-20 transition-colors duration-500" data-testid="booking-page">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 text-sm font-bold text-zinc-400 hover:text-foreground mb-10 transition-all"
          data-testid="booking-back-btn"
        >
          <div className="w-8 h-8 rounded-full bg-surface border border-outline-variant flex items-center justify-center group-hover:bg-foreground group-hover:text-background transition-all shadow-sm">
            <ArrowLeft className="w-4 h-4" />
          </div>
          Back to Services
        </button>

        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mb-4">
              <CheckCircle2 className="w-3 h-3" /> Step 02: Configuration
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-foreground tracking-tight font-manrope">Secure Appointment</h1>
            <p className="text-zinc-500 font-medium mt-2 font-inter">Personalize your {service.name} service experience.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-8 space-y-8">
            <section className="bg-surface rounded-[40px] border border-outline-variant p-10 shadow-sm transition-all" data-testid="date-selection">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <CalendarIcon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground font-manrope">Preferred Date</h2>
                  <p className="text-xs text-zinc-500 font-medium">When should we visit?</p>
                </div>
              </div>
              <div className="flex justify-center md:justify-start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                  className="rounded-3xl border border-zinc-100 p-4 font-inter"
                  data-testid="booking-calendar"
                />
              </div>
            </section>

            <section className="bg-surface rounded-[40px] border border-outline-variant p-10 shadow-sm transition-all" data-testid="time-selection">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-amber-500" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground font-manrope">Arrival Window</h2>
                  <p className="text-xs text-zinc-500 font-medium">Choose a convenient time slot.</p>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {timeSlots.map(slot => (
                  <button key={slot} onClick={() => setTime(slot)} data-testid={`time-slot-${slot.replace(/\s/g, '-')}`}
                    className={`py-4 px-3 rounded-2xl text-xs font-bold transition-all cursor-pointer border ${time === slot ? 'bg-foreground text-background border-foreground shadow-xl' : 'bg-surface-container-low text-zinc-500 border-outline-variant hover:border-zinc-400 dark:hover:border-zinc-600'}`}>
                    {slot}
                  </button>
                ))}
              </div>
            </section>

            <section className="bg-surface rounded-[40px] border border-outline-variant p-10 shadow-sm transition-all" data-testid="address-section">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-emerald-500" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground font-manrope">Service Location</h2>
                  <p className="text-xs text-zinc-500 font-medium">Where is the job located?</p>
                </div>
              </div>
              <div className="space-y-4">
                {user?.addresses?.map((addr, i) => (
                  <button key={i} onClick={() => setAddress(addr.address)} data-testid={`saved-address-${i}`}
                    className={`w-full text-left p-6 rounded-[28px] border-2 transition-all cursor-pointer ${address === addr.address ? 'border-primary bg-primary/5' : 'border-outline-variant bg-surface hover:border-zinc-300 dark:hover:border-zinc-700'}`}>
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-2 h-2 rounded-full ${address === addr.address ? 'bg-primary' : 'bg-zinc-300'}`} />
                      <span className="text-[10px] font-black uppercase tracking-[0.15em] text-zinc-500">{addr.label}</span>
                    </div>
                    <p className="text-sm font-bold text-foreground">{addr.address}</p>
                  </button>
                ))}
                <div className="mt-8">
                  <Label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3 block px-1">Or provide new address</Label>
                  <Input value={address} onChange={e => setAddress(e.target.value)} placeholder="House #, Building, Street, Area"
                    className="rounded-2xl h-16 bg-surface-container-low border-outline-variant px-6 font-medium focus:ring-primary shadow-none transition-all text-foreground" data-testid="booking-address-input" />
                </div>
              </div>
            </section>

            <section className="bg-surface rounded-[40px] border border-outline-variant p-10 shadow-sm transition-all" data-testid="payment-method-section">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-surface-container-high flex items-center justify-center border border-outline-variant">
                  <CreditCard className="w-6 h-6 text-foreground" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground font-manrope">Payment Strategy</h2>
                  <p className="text-xs text-zinc-500 font-medium">Securely finalize your order.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => setPaymentMethod('cash')}
                  className={`flex items-center gap-5 p-6 rounded-[28px] border-2 transition-all cursor-pointer ${paymentMethod === 'cash' ? 'border-foreground bg-foreground text-background' : 'border-outline-variant bg-surface-container-low hover:border-zinc-300 dark:hover:border-zinc-700'}`}
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${paymentMethod === 'cash' ? 'bg-background/20 text-background dark:text-foreground' : 'bg-surface text-zinc-400 shadow-sm'}`}>
                    <Banknote className="w-7 h-7" strokeWidth={1.5} />
                  </div>
                  <div className="text-left">
                    <p className="font-black text-sm uppercase tracking-wide">On Completion</p>
                    <p className={`text-xs ${paymentMethod === 'cash' ? 'opacity-80' : 'text-zinc-500'}`}>Pay after service</p>
                  </div>
                </button>

                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`flex items-center gap-5 p-6 rounded-[28px] border-2 transition-all cursor-pointer ${paymentMethod === 'card' ? 'border-primary bg-primary text-white shadow-xl shadow-primary/20' : 'border-outline-variant bg-surface-container-low opacity-60'}`}
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${paymentMethod === 'card' ? 'bg-white/10 text-white' : 'bg-surface text-zinc-400 shadow-sm'}`}>
                    <CreditCard className="w-7 h-7" strokeWidth={1.5} />
                  </div>
                  <div className="text-left">
                    <p className="font-black text-sm uppercase tracking-wide">Online Now</p>
                    <p className={`text-xs ${paymentMethod === 'card' ? 'opacity-80' : 'text-zinc-500'}`}>Coming Soon</p>
                  </div>
                </button>
              </div>
            </section>
          </div>

          <aside className="lg:col-span-4 lg:sticky lg:top-12">
            <div className="bg-surface text-foreground rounded-[48px] p-10 shadow-xl border border-outline-variant relative overflow-hidden" data-testid="order-summary">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-[60px]" />

              <h2 className="text-2xl font-black mb-8 font-manrope text-foreground">Order Summary</h2>

              <div className="flex gap-5 mb-8">
                <div className="w-20 h-20 rounded-[24px] overflow-hidden shrink-0 border border-outline-variant">
                  <img src={service.image} alt={service.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col justify-center">
                  <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">{service.category.replace('-', ' ')}</span>
                  <h4 className="font-bold text-lg text-current font-manrope leading-tight mb-2">{service.name}</h4>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 bg-zinc-100 dark:bg-white/5 py-1 px-2 rounded-lg w-max">
                    <Clock className="w-3 h-3 text-primary" /> {service.duration}
                  </div>
                </div>
              </div>

              <div className="space-y-4 py-8 border-y border-outline-variant font-inter">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500 text-sm font-medium">Scheduled Visit</span>
                  <span className="text-current font-bold">{date ? date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '---'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500 text-sm font-medium">Arrival Time</span>
                  <span className="text-current font-bold">{time || '---'}</span>
                </div>
              </div>

              <div className="pt-8 space-y-4 font-inter">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500 font-medium">Service Base</span>
                  <span className="text-zinc-400 font-bold">₹{service.originalPrice?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500 font-medium">Premium Discount</span>
                  <span className="text-primary font-bold">-₹{(service.originalPrice - service.price).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-end pt-6">
                  <div>
                    <p className="text-zinc-500 text-[10px] uppercase font-black tracking-widest mb-1">Total investment</p>
                    <span className="text-4xl font-black text-current font-manrope">₹{service.price?.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-bold opacity-60">
                    <Shield className="w-3 h-3 text-emerald-500" /> Insured
                  </div>
                </div>
              </div>

              <Button
                className="w-full h-16 rounded-[24px] premium-gradient-btn text-white font-black text-lg mt-10 transition-all hover:scale-[1.02] active:scale-[0.98]"
                onClick={handleConfirm}
                disabled={loading}
                data-testid="confirm-booking-btn"
              >
                {loading ? 'Confirming...' : 'Complete Booking'}
              </Button>

              <p className="text-[10px] font-bold text-zinc-600 text-center mt-6 uppercase tracking-wider">
                By booking you agree to our premium terms
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
