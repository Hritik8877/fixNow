import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signupUser } from '@/store/authSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Wrench, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

export default function SignupPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', role: 'user' });
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector(s => s.auth);

  const update = (field, val) => setForm(prev => ({ ...prev, [field]: val }));

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) { toast.error('Please fill all required fields'); return; }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    const result = await dispatch(signupUser(form));
    if (signupUser.fulfilled.match(result)) {
      toast.success('Account created successfully!');
      const redirectMap = { admin: '/admin', technician: '/technician', user: '/dashboard' };
      navigate(redirectMap[form.role] || '/dashboard');
    } else {
      toast.error(result.payload || 'Signup failed');
    }
  };

  const roles = [
    { value: 'user', label: 'User', desc: 'Concierge access' },
    { value: 'technician', label: 'Expert', desc: 'Join our guild' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12 transition-colors duration-500" data-testid="signup-page">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <Wrench className="w-6 h-6 text-white dark:text-background" strokeWidth={2.5} />
            </div>
            <span className="font-black text-2xl tracking-tighter text-foreground font-manrope">FixNow</span>
          </Link>
          <h1 className="text-3xl font-black text-foreground tracking-tight font-manrope">Join the Elite</h1>
          <p className="text-sm font-medium text-zinc-500 mt-2">Experience concierge home services</p>
        </div>

        <div className="bg-surface rounded-3xl border border-outline-variant shadow-2xl p-8 sm:p-10">
          <form onSubmit={handleSignup} className="space-y-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">Full Name *</Label>
              <Input value={form.name} onChange={e => update('name', e.target.value)} placeholder="Enter the full Name"
                className="rounded-2xl h-14 bg-surface-container-low border-outline-variant focus:ring-primary text-foreground font-medium" data-testid="signup-name-input" />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">Email *</Label>
              <Input type="email" value={form.email} onChange={e => update('email', e.target.value)} placeholder="example@gmail.com"
                className="rounded-2xl h-14 bg-surface-container-low border-outline-variant focus:ring-primary text-foreground font-medium" data-testid="signup-email-input" />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">Phone</Label>
              <Input type="tel" value={form.phone} onChange={e => update('phone', e.target.value)} placeholder="9876543210"
                className="rounded-2xl h-14 bg-surface-container-low border-outline-variant focus:ring-primary text-foreground font-medium" data-testid="signup-phone-input" />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">Password *</Label>
              <div className="relative">
                <Input type={showPassword ? 'text' : 'password'} value={form.password} onChange={e => update('password', e.target.value)}
                  placeholder="Min 6 characters" className="rounded-2xl h-14 bg-surface-container-low border-outline-variant focus:ring-primary text-foreground font-medium pr-12" data-testid="signup-password-input" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-foreground transition-colors">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <div className="space-y-3">
              <Label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">Identity Selection</Label>
              <RadioGroup value={form.role} onValueChange={val => update('role', val)} className="flex gap-4" data-testid="signup-role-select">
                {roles.map(r => (
                  <label key={r.value}
                    className={`flex-1 cursor-pointer rounded-2xl border-2 p-4 transition-all ${form.role === r.value ? 'border-primary bg-primary/10 shadow-lg shadow-primary/5' : 'border-outline-variant hover:border-zinc-400 dark:hover:border-zinc-600 bg-surface-container-low/30'}`}
                    data-testid={`signup-role-${r.value}`}>
                    <RadioGroupItem value={r.value} className="sr-only" />
                    <p className="font-bold text-foreground font-manrope">{r.label}</p>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-tight mt-1">{r.desc}</p>
                  </label>
                ))}
              </RadioGroup>
            </div>
            <Button type="submit" disabled={loading} className="w-full h-14 rounded-2xl premium-gradient-btn text-white dark:text-background font-black text-lg uppercase tracking-widest shadow-xl shadow-primary/20 mt-4" data-testid="signup-submit-btn">
              {loading ? 'Processing...' : 'Create Account'}
            </Button>
          </form>
          <p className="text-center text-sm font-bold text-zinc-500 mt-8">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline" data-testid="goto-login-link">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
