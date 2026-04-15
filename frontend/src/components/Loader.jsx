import { Loader2 } from 'lucide-react';

export default function Loader({ text = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20" data-testid="loader">
      <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-3" />
      <p className="text-sm text-zinc-400">{text}</p>
    </div>
  );
}
