import { Link } from 'react-router-dom';
import { Wrench, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-background text-zinc-600 dark:text-zinc-300 border-t border-outline-variant" data-testid="footer">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-24">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-6 group">
              <div className="w-10 h-10 rounded-[12px] premium-gradient-btn flex items-center justify-center shadow-primary/20 transition-transform group-hover:scale-110">
                <Wrench className="w-5 h-5 text-background" strokeWidth={2} />
              </div>
              <span className="font-black text-2xl text-foreground font-manrope tracking-tighter">FixNow</span>
            </Link>
            <p className="text-sm font-medium text-zinc-500 leading-relaxed font-inter">
              The digital concierge for elite home maintenance. Certified professionals, redefined excellence.
            </p>
          </div>
          <div>
            <h4 className="font-black text-foreground text-[10px] uppercase tracking-[0.2em] mb-8 font-manrope">Solutions</h4>
            <ul className="space-y-4">
              {['AC Systems', 'Refrigerator', 'Washing Machine', 'CCTV Camera', 'Digital Board'].map(item => (
                <li key={item}><Link to="/services" className="text-sm font-semibold text-zinc-500 hover:text-primary transition-colors">{item}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-black text-foreground text-[10px] uppercase tracking-[0.2em] mb-8 font-manrope">Platform</h4>
            <ul className="space-y-4">
              {['About Us', 'Concierge Mode', 'Service Ledger', 'Partnerships', 'Privacy'].map(item => (
                <li key={item}><span className="text-sm font-semibold text-zinc-500 hover:text-foreground transition-colors cursor-pointer">{item}</span></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-black text-foreground text-[10px] uppercase tracking-[0.2em] mb-8 font-manrope">Inquiries</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-sm font-semibold text-zinc-500 hover:text-foreground transition-colors"><Mail className="w-4 h-4 text-primary" /> support@fixnow.com</li>
              <li className="flex items-center gap-3 text-sm font-semibold text-zinc-500 hover:text-foreground transition-colors"><Phone className="w-4 h-4 text-primary" /> +91 8409397263</li>
              <li className="flex items-center gap-3 text-sm font-semibold text-zinc-500 hover:text-foreground transition-colors"><MapPin className="w-4 h-4 text-primary" /> Mumbai HQ</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-outline-variant mt-20 pt-10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">&copy; {new Date().getFullYear()} FixNow Elite. All rights reserved.</p>
          <div className="flex gap-8">
            {['Instagram', 'Twitter', 'LinkedIn'].map(social => (
              <span key={social} className="text-[10px] font-bold text-zinc-600 hover:text-foreground transition-colors cursor-pointer uppercase tracking-widest">{social}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
