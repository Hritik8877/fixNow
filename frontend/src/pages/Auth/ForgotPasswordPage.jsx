import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Wrench, Mail, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) { toast.error('Please enter your email'); return; }

    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      toast.success('OTP sent! Check your inbox.');
      navigate('/verify-otp', { state: { email } });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12" data-testid="forgot-password-page">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <Wrench className="w-6 h-6 text-white dark:text-background" strokeWidth={2.5} />
            </div>
            <span className="font-black text-2xl tracking-tighter text-foreground font-manrope">FixNow</span>
          </Link>
          <h1 className="text-3xl font-black text-foreground tracking-tight font-manrope">Forgot Password?</h1>
          <p className="text-sm font-medium text-zinc-500 mt-2">
            No worries — we'll send a 6-digit OTP to your email.
          </p>
        </div>

        <div className="bg-surface rounded-3xl border border-outline-variant shadow-2xl p-8 sm:p-10">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Mail className="w-8 h-8 text-primary" />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">
                Email Address
              </Label>
              <Input
                id="forgot-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="rounded-2xl h-14 bg-surface-container-low border-outline-variant focus:ring-primary text-foreground font-medium"
                data-testid="forgot-email-input"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-14 rounded-2xl premium-gradient-btn text-white dark:text-background font-black text-lg uppercase tracking-widest shadow-xl shadow-primary/20"
              data-testid="forgot-submit-btn"
            >
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </Button>
          </form>

          <Link
            to="/login"
            className="flex items-center justify-center gap-2 text-sm font-bold text-zinc-500 hover:text-primary transition-colors mt-8"
            data-testid="back-to-login-link"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
