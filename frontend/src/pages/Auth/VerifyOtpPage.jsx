import { useState, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Wrench, ShieldCheck, ArrowLeft, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';

export default function VerifyOtpPage() {
  const [digits, setDigits] = useState(Array(6).fill(''));
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  const focusNext = (index) => {
    if (index < 5) inputRefs.current[index + 1]?.focus();
  };
  const focusPrev = (index) => {
    if (index > 0) inputRefs.current[index - 1]?.focus();
  };

  const handleChange = (index, value) => {
    // Accept only digits
    if (!/^\d*$/.test(value)) return;
    const next = [...digits];
    next[index] = value.slice(-1); // Only last character if paste
    setDigits(next);
    if (value) focusNext(index);
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index]) focusPrev(index);
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setDigits(pasted.split(''));
      inputRefs.current[5]?.focus();
    }
    e.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otp = digits.join('');
    if (otp.length < 6) { toast.error('Please enter the full 6-digit OTP'); return; }

    setLoading(true);
    try {
      await api.post('/auth/verify-otp', { otp });
      toast.success('OTP verified!');
      navigate('/reset-password');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid or expired OTP');
      setDigits(Array(6).fill(''));
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) { toast.error('Email not found. Please start over.'); navigate('/forgot-password'); return; }
    setResending(true);
    try {
      await api.post('/auth/forgot-password', { email });
      toast.success('New OTP sent!');
      setDigits(Array(6).fill(''));
      inputRefs.current[0]?.focus();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12" data-testid="verify-otp-page">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <Wrench className="w-6 h-6 text-white dark:text-background" strokeWidth={2.5} />
            </div>
            <span className="font-black text-2xl tracking-tighter text-foreground font-manrope">FixNow</span>
          </Link>
          <h1 className="text-3xl font-black text-foreground tracking-tight font-manrope">Check your email</h1>
          <p className="text-sm font-medium text-zinc-500 mt-2">
            We sent a 6-digit code to{' '}
            <span className="text-primary font-bold">{email || 'your email'}</span>
          </p>
        </div>

        <div className="bg-surface rounded-3xl border border-outline-variant shadow-2xl p-8 sm:p-10">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <ShieldCheck className="w-8 h-8 text-primary" />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* OTP Boxes */}
            <div className="flex justify-center gap-3" onPaste={handlePaste}>
              {digits.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => (inputRefs.current[i] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  className="w-12 h-14 text-center text-2xl font-black rounded-2xl border-2 bg-surface-container-low
                             border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20
                             outline-none transition-all text-foreground caret-primary"
                  data-testid={`otp-input-${i}`}
                />
              ))}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-14 rounded-2xl premium-gradient-btn text-white dark:text-background font-black text-lg uppercase tracking-widest shadow-xl shadow-primary/20"
              data-testid="verify-otp-btn"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </Button>
          </form>

          {/* Resend */}
          <div className="text-center mt-6">
            <p className="text-sm text-zinc-500 font-medium">
              Didn't receive the code?{' '}
              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="text-primary font-bold hover:underline inline-flex items-center gap-1 disabled:opacity-60"
                data-testid="resend-otp-btn"
              >
                {resending && <RefreshCw className="w-3 h-3 animate-spin" />}
                Resend OTP
              </button>
            </p>
          </div>

          <Link
            to="/forgot-password"
            className="flex items-center justify-center gap-2 text-sm font-bold text-zinc-500 hover:text-primary transition-colors mt-4"
            data-testid="back-to-forgot-link"
          >
            <ArrowLeft className="w-4 h-4" />
            Change Email
          </Link>
        </div>
      </div>
    </div>
  );
}
