import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin } from 'lucide-react';

const statusStyles = {
  pending: 'bg-amber-500 text-white',
  accepted: 'bg-primary text-background',
  'in-progress': 'bg-primary text-background',
  completed: 'bg-emerald-500 text-white',
  cancelled: 'bg-red-500 text-white',
};

export default function BookingCard({ booking, showActions, onStatusChange }) {
  const serviceName = booking.serviceId?.name || 'Service';
  const techName = booking.technicianId?.name || 'Unassigned';

  return (
    <div className="bg-surface rounded-[32px] border border-outline-variant p-8 shadow-sm transition-all hover:shadow-lg hover:scale-[1.01]" data-testid={`booking-card-${booking._id}`}>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h4 className="font-black text-lg text-foreground font-manrope leading-tight mb-1">{serviceName}</h4>
          <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Order ID: #{booking._id?.slice(-6)}</p>
        </div>
        <Badge className={`rounded-full text-[10px] font-black uppercase tracking-widest px-3 py-1 border-0 ${statusStyles[booking.status]}`} data-testid={`booking-status-${booking._id}`}>
          {booking.status}
        </Badge>
      </div>
      
      <div className="space-y-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-surface-container-low flex items-center justify-center border border-outline-variant">
            <Calendar className="w-4 h-4 text-zinc-500" />
          </div>
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">{booking.date}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-surface-container-low flex items-center justify-center border border-outline-variant">
            <Clock className="w-4 h-4 text-zinc-500" />
          </div>
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">{booking.time}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-surface-container-low flex items-center justify-center border border-outline-variant">
            <MapPin className="w-4 h-4 text-zinc-500" />
          </div>
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider line-clamp-1">{booking.address}</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-6 border-t border-outline-variant">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">Technician</p>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-[10px] font-black text-primary uppercase">{techName[0]}</span>
            </div>
            <p className="text-sm font-bold text-foreground font-manrope">{techName}</p>
          </div>
        </div>
        <div className="text-right">
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">Total</p>
            <p className="text-xl font-black text-foreground font-manrope">₹{booking.total?.toLocaleString()}</p>
        </div>
      </div>

      {showActions && onStatusChange && (
        <div className="mt-8 pt-6 border-t border-outline-variant flex flex-col gap-3">
          {booking.status === 'pending' && (
            <div className="flex gap-4">
                <Button onClick={() => onStatusChange(booking._id, 'accepted')} className="flex-1 h-12 rounded-2xl premium-gradient-btn text-white dark:text-background font-black text-xs uppercase" data-testid={`accept-booking-${booking._id}`}>Confirm</Button>
                <Button variant="outline" onClick={() => onStatusChange(booking._id, 'cancelled')} className="flex-1 h-12 rounded-2xl border-outline-variant text-zinc-500 font-black text-xs uppercase hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30" data-testid={`reject-booking-${booking._id}`}>Reject</Button>
            </div>
          )}
          {booking.status === 'accepted' && (
            <Button onClick={() => onStatusChange(booking._id, 'in-progress')} className="w-full h-12 rounded-2xl bg-foreground text-background font-black text-xs uppercase shadow-xl" data-testid={`start-booking-${booking._id}`}>Begin Service</Button>
          )}
          {booking.status === 'in-progress' && (
            <Button onClick={() => onStatusChange(booking._id, 'completed')} className="w-full h-12 rounded-2xl bg-emerald-500 text-white font-black text-xs uppercase shadow-xl shadow-emerald-500/10" data-testid={`complete-booking-${booking._id}`}>Mark Finalized</Button>
          )}
        </div>
      )}
    </div>
  );
}
