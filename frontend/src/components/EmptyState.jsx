import { PackageOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function EmptyState({ icon: Icon = PackageOpen, title = 'Nothing here yet', description = 'Check back later or try a different filter.', actionLabel, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center p-20 text-center" data-testid="empty-state">
      <div className="w-24 h-24 rounded-[32px] bg-surface-container-low flex items-center justify-center mb-8 border border-outline-variant shadow-sm">
        <Icon className="w-10 h-10 text-zinc-400" strokeWidth={1} />
      </div>
      <h3 className="text-xl font-black text-foreground mb-2 font-manrope">{title}</h3>
      <p className="text-sm font-medium text-zinc-500 max-w-sm font-inter">{description}</p>
      {actionLabel && onAction && (
        <Button className="mt-8 h-12 px-8 rounded-2xl bg-foreground text-background font-black text-xs uppercase tracking-widest hover:bg-foreground/90 transition-all shadow-xl" onClick={onAction} data-testid="empty-state-action">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
