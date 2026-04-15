import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Wrench, ChevronDown, User, LayoutDashboard, LogOut, Menu } from 'lucide-react';
import { logout } from '@/store/authSlice';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import ThemeToggle from '@/components/ThemeToggle';

const navLinks = {
  guest: [
    { to: '/', label: 'Home' },
    { to: '/services', label: 'Explore Services' },
  ],
  user: [
    { to: '/', label: 'Home' },
    { to: '/services', label: 'Services' },
    { to: '/dashboard', label: 'Dashboard' },
  ],
  technician: [
    { to: '/', label: 'Home' },
    { to: '/technician', label: 'Service Center' },
  ],
  admin: [
    { to: '/', label: 'Home' },
    { to: '/admin', label: 'Console' },
  ],
};

export default function Navbar() {
  const { isAuthenticated, user } = useSelector(s => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const role = user?.role || 'guest';
  const links = navLinks[role] || navLinks.guest;
  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 glass border-b border-outline-variant" data-testid="navbar">
      <div className="max-w-7xl mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group" data-testid="navbar-logo">
          <div className="w-10 h-10 rounded-[14px] premium-gradient-btn flex items-center justify-center transition-transform group-hover:scale-105 shadow-primary/20">
            <Wrench className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-black text-2xl tracking-tighter font-manrope text-foreground">FixNow</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-2 bg-zinc-100/50 dark:bg-zinc-800/50 p-1 rounded-2xl border border-outline-variant">
          {links.map(link => (
            <Link key={link.to} to={link.to} data-testid={`nav-link-${link.label.toLowerCase()}`}
              className={`px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${isActive(link.to) ? 'bg-surface text-foreground shadow-sm' : 'text-zinc-500 hover:text-foreground hover:bg-surface-container-low'}`}>
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />
          {!isAuthenticated ? (
            <>
              <Button variant="ghost" className="rounded-xl font-bold text-sm text-zinc-500 hover:text-foreground" onClick={() => navigate('/login')} data-testid="nav-login-btn">Log in</Button>
              <Button className="rounded-xl premium-gradient-btn text-white font-bold h-11 px-6 shadow-sm shadow-primary/20" onClick={() => navigate('/signup')} data-testid="nav-signup-btn">Get Started</Button>
            </>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-2xl bg-zinc-100/50 dark:bg-zinc-800/50 border border-outline-variant hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all group" data-testid="nav-user-menu">
                  <Avatar className="w-8 h-8 border-2 border-background shadow-sm transition-transform group-hover:scale-105">
                    {user?.profileImage ? (
                      <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <AvatarFallback className="bg-primary/10 text-primary-container text-xs font-black">{initials}</AvatarFallback>
                    )}
                  </Avatar>
                  <span className="text-sm font-bold text-foreground max-w-[120px] truncate">{user?.name}</span>
                  <ChevronDown className="w-4 h-4 text-zinc-400 group-hover:text-foreground transition-colors" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 bg-background border border-outline-variant shadow-2xl">
                <DropdownMenuItem onClick={() => navigate('/profile')} className="rounded-xl py-2.5 font-semibold text-zinc-600 dark:text-zinc-400 focus:bg-surface-container-low focus:text-foreground cursor-pointer" data-testid="nav-profile-link">
                  <User className="w-4 h-4 mr-3 opacity-70" /> Profile Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate(role === 'admin' ? '/admin' : role === 'technician' ? '/technician' : '/dashboard')} className="rounded-xl py-2.5 font-semibold text-zinc-600 dark:text-zinc-400 focus:bg-surface-container-low focus:text-foreground cursor-pointer" data-testid="nav-dashboard-link">
                  <LayoutDashboard className="w-4 h-4 mr-3 opacity-70" /> Dashboard
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-2 bg-outline-variant" />
                <DropdownMenuItem onClick={handleLogout} className="rounded-xl py-2.5 font-bold text-red-500 focus:bg-red-50 dark:focus:bg-red-900/10 focus:text-red-600 cursor-pointer" data-testid="nav-logout-btn">
                  <LogOut className="w-4 h-4 mr-3" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Mobile Nav */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="rounded-xl" data-testid="mobile-menu-btn"><Menu className="w-6 h-6 text-foreground" /></Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:w-80 p-6 glass border-l border-outline-variant">
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-[14px] premium-gradient-btn flex items-center justify-center">
                  <Wrench className="w-5 h-5 text-white" />
                </div>
                <span className="font-black text-2xl font-manrope text-foreground">FixNow</span>
              </div>
              <ThemeToggle />
            </div>
            <div className="flex flex-col gap-3">
              {links.map(link => (
                <Link key={link.to} to={link.to} onClick={() => setOpen(false)}
                  className={`px-6 py-4 rounded-2xl text-sm font-bold uppercase tracking-widest transition-all ${isActive(link.to) ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-xl' : 'text-zinc-500 hover:bg-surface-container-low hover:text-foreground'}`}>
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-outline-variant my-6" />
              {!isAuthenticated ? (
                <div className="flex flex-col gap-3">
                  <Button variant="outline" className="h-14 rounded-2xl border-outline-variant font-bold text-foreground" onClick={() => { navigate('/login'); setOpen(false); }}>Log in</Button>
                  <Button className="h-14 rounded-2xl premium-gradient-btn text-white font-bold" onClick={() => { navigate('/signup'); setOpen(false); }}>Get Started</Button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link to="/profile" onClick={() => setOpen(false)} className="px-6 py-4 rounded-2xl text-sm font-bold text-zinc-500 hover:bg-surface-container-low flex items-center gap-3">
                    <User className="w-5 h-5" /> Profile Settings
                  </Link>
                  <button onClick={() => { handleLogout(); setOpen(false); }} className="px-6 py-4 rounded-2xl text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 text-left flex items-center gap-3">
                    <LogOut className="w-5 h-5" /> Logout
                  </button>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
