import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '@/store/authSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Wrench, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

export default function LoginPage() {
  const [role, setRole] = useState('user');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector(s => s.auth);


  const handleTabChange = (val) => {
    setRole(val);
    setEmail('');
    setPassword('');
    dispatch(clearError());
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) { toast.error('Please fill all fields'); return; }
    const result = await dispatch(loginUser({ email, password, role }));
    if (loginUser.fulfilled.match(result)) {
      toast.success('Login successful!');
      const redirectMap = { admin: '/admin', technician: '/technician', user: '/dashboard' };
      navigate(redirectMap[role] || '/dashboard');
    } else {
      toast.error(result.payload || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12 transition-colors duration-500" data-testid="login-page">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <Wrench className="w-6 h-6 text-white dark:text-background" strokeWidth={2.5} />
            </div>
            <span className="font-black text-2xl tracking-tighter text-foreground font-manrope">FixNow</span>
          </Link>
          <h1 className="text-3xl font-black text-foreground tracking-tight font-manrope">Welcome back</h1>
          <p className="text-sm font-medium text-zinc-500 mt-2">Sign in to your premium concierge account</p>
        </div>

        <div className="bg-surface rounded-3xl border border-outline-variant shadow-2xl p-8 sm:p-10">
          <Tabs value={role} onValueChange={handleTabChange}>
            <TabsList className="w-full mb-8 bg-surface-container-low rounded-2xl h-14 p-1 border border-outline-variant" data-testid="role-tabs">
              <TabsTrigger value="user" className="flex-1 rounded-xl text-xs font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white dark:data-[state=active]:text-background transition-all" data-testid="role-tab-user">User</TabsTrigger>
              <TabsTrigger value="technician" className="flex-1 rounded-xl text-xs font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white dark:data-[state=active]:text-background transition-all" data-testid="role-tab-technician">Tech</TabsTrigger>
              <TabsTrigger value="admin" className="flex-1 rounded-xl text-xs font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white dark:data-[state=active]:text-background transition-all" data-testid="role-tab-admin">Admin</TabsTrigger>
            </TabsList>

            {['user', 'technician', 'admin'].map(r => (
              <TabsContent key={r} value={r}>
                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">Email</Label>
                    <Input type="email" value={email} onChange={e => setEmail(e.target.value)}
                      placeholder={`${r}@gmail.com`} className="rounded-2xl h-14 bg-surface-container-low border-outline-variant focus:ring-primary text-foreground font-medium"
                      data-testid="login-email-input" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">Password</Label>
                    <div className="relative">
                      <Input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                        placeholder="Enter password" className="rounded-2xl h-14 bg-surface-container-low border-outline-variant focus:ring-primary text-foreground font-medium pr-12"
                        data-testid="login-password-input" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-foreground transition-colors" data-testid="toggle-password-btn">
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-end -mt-2">
                    <Link
                      to="/forgot-password"
                      className="text-xs font-bold text-primary hover:underline"
                      data-testid="forgot-password-link"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <Button type="submit" disabled={loading} className="w-full h-14 rounded-2xl premium-gradient-btn text-white dark:text-background font-black text-lg uppercase tracking-widest shadow-xl shadow-primary/20" data-testid="login-submit-btn">
                    {loading ? 'Authenticating...' : 'Sign In'}
                  </Button>
                </form>
              </TabsContent>
            ))}
          </Tabs>
          <p className="text-center text-sm font-bold text-zinc-500 mt-8">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary hover:underline" data-testid="goto-signup-link">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
