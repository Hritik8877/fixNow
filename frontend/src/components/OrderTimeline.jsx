import { CheckCircle2, Clock, Truck, PackageCheck, XCircle } from 'lucide-react';

const statusConfig = {
  pending: { icon: Clock, color: 'text-amber-500 bg-amber-50 dark:bg-amber-500/10 border-amber-500/20', label: 'Booking Created' },
  accepted: { icon: CheckCircle2, color: 'text-primary bg-primary/5 border-primary/20', label: 'Accepted' },
  'in-progress': { icon: Truck, color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 border-indigo-500/20', label: 'In Progress' },
  completed: { icon: PackageCheck, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-500/20', label: 'Completed' },
  cancelled: { icon: XCircle, color: 'text-red-500 bg-red-50 dark:bg-red-500/10 border-red-500/20', label: 'Cancelled' },
};

export default function OrderTimeline({ timeline = [], currentStatus }) {
  if (!timeline || timeline.length === 0) return null;

  return (
    <div className="relative" data-testid="order-timeline">
      {timeline.map((entry, i) => {
        const config = statusConfig[entry.status] || statusConfig.pending;
        const Icon = config.icon;
        const isLast = i === timeline.length - 1;
        const ts = new Date(entry.timestamp);
        const dateStr = ts.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
        const timeStr = ts.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

        return (
          <div key={i} className="flex gap-4 relative" data-testid={`timeline-entry-${entry.status}`}>
            {/* Vertical line */}
            {!isLast && (
              <div className="absolute left-[19px] top-10 w-0.5 h-[calc(100%-16px)] bg-outline-variant" />
            )}
            {/* Icon */}
            <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 z-10 ${config.color}`}>
              <Icon className="w-5 h-5" strokeWidth={1.5} />
            </div>
            {/* Content */}
            <div className={`pb-6 ${isLast ? 'pb-0' : ''}`}>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-foreground font-manrope">{config.label}</h4>
                {isLast && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-black uppercase tracking-wider">Current</span>
                )}
              </div>
              <p className="text-xs text-zinc-500 mt-0.5 font-inter">{entry.note}</p>
              <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-tight mt-1">{dateStr} at {timeStr}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
