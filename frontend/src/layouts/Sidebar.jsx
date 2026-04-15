import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, ClipboardList, Users, BarChart3, Settings, Wrench, Plus } from 'lucide-react';

const sidebarLinks = {
  user: [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/dashboard/bookings', icon: ClipboardList, label: 'My Bookings' },
    { to: '/profile', icon: Settings, label: 'Profile' },
  ],
  technician: [
    { to: '/technician', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/technician/services', icon: Package, label: 'My Services' },
    { to: '/technician/orders', icon: ClipboardList, label: 'Orders' },
    { to: '/profile', icon: Settings, label: 'Profile' },
  ],
  admin: [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/users', icon: Users, label: 'Users' },
    { to: '/admin/bookings', icon: ClipboardList, label: 'Bookings' },
    { to: '/admin/stats', icon: BarChart3, label: 'Statistics' },
    { to: '/profile', icon: Settings, label: 'Profile' },
  ],
};

export default function Sidebar({ role = 'user' }) {
  const links = sidebarLinks[role] || sidebarLinks.user;

  return (
    <aside className="hidden lg:flex flex-col w-72 min-h-[calc(100vh-5rem)] bg-surface border-r border-outline-variant p-6 transition-colors duration-500" data-testid="sidebar">
      <div className="flex flex-col gap-2">
        {links.map(link => (
          <NavLink key={link.to} to={link.to} end
            data-testid={`sidebar-link-${link.label.toLowerCase().replace(/\s/g, '-')}`}
            className={({ isActive }) =>
              `flex items-center gap-3 px-5 py-3.5 rounded-2xl text-sm font-bold transition-all ${isActive ? 'bg-primary text-white dark:text-background shadow-lg shadow-primary/10' : 'text-zinc-500 hover:bg-surface-container-low hover:text-foreground'}`
            }>
            {({ isActive }) => (
              <>
                <link.icon className={`w-5 h-5 ${isActive ? 'text-current' : 'text-zinc-400'}`} strokeWidth={2} />
                <span className="font-manrope tracking-tight">{link.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
      
      <div className="mt-auto pt-8 border-t border-outline-variant">
        <div className="bg-primary/5 rounded-[24px] p-6 border border-primary/10">
          <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-2">Concierge Support</p>
          <p className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-4 leading-relaxed font-inter">Need assistance with your premium service?</p>
          <button className="w-full py-3 rounded-xl bg-surface text-foreground text-xs font-bold border border-outline-variant hover:border-primary transition-all shadow-sm">
            Contact Support
          </button>
        </div>
      </div>
    </aside>
  );
}
