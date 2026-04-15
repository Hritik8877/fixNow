import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Wrench, Lock, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const navigate = useNavigate();

  const passwordStrength = (pwd) => {
    if (pwd.length === 0) return null;
    if (pwd.length < 6) return { label: 'Too short', color: '#ef4444', width: '20%' };
    if (pwd.length < 8) return { label: 'Weak', color: '#f97316', width: '40%' };
    if (!/[A-Z]/.test(pwd) || !/[0-9]/.test(pwd)) return { label: 'Fair', color: '#eab308', width: '60%' };
    if (!/[^A-Za-z0-9]/.test(pwd)) return { label: 'Good', color: '#22c55e', width: '80%' };
    return { label: 'Strong', color: '#16a34a', width: '100%' };
  };

  const strength = passwordStrength(newPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) { toast.error('Please fill all fields'); return; }
    if (newPassword.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    if (newPassword !== confirmPassword) { toast.error('Passwords do not match'); return; }

    setLoading(true);
    try {
      await api.post('/auth/reset-password', { newPassword });
      setDone(true);
      toast.success('Password reset successfully!');
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="w-full max-w-md text-center">
          <div className="bg-surface rounded-3xl border border-outline-variant shadow-2xl p-10">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center animate-bounce-once">
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              </div>
            </div>
            <h2 className="text-2xl font-black text-foreground font-manrope mb-3">Password Reset!</h2>
            <p className="text-zinc-500 text-sm font-medium">
              Your password has been changed successfully. Redirecting to login…
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12" data-testid="reset-password-page">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <Wrench className="w-6 h-6 text-white dark:text-background" strokeWidth={2.5} />
            </div>
            <span className="font-black text-2xl tracking-tighter text-foreground font-manrope">FixNow</span>
          </Link>
          <h1 className="text-3xl font-black text-foreground tracking-tight font-manrope">Set New Password</h1>
          <p className="text-sm font-medium text-zinc-500 mt-2">
            Choose a strong password for your account.
          </p>
        </div>

        <div className="bg-surface rounded-3xl border border-outline-variant shadow-2xl p-8 sm:p-10">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Lock className="w-8 h-8 text-primary" />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* New Password */}
            <div className="space-y-2">
              <Label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">
                New Password
              </Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showNew ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  className="rounded-2xl h-14 bg-surface-container-low border-outline-variant focus:ring-primary text-foreground font-medium pr-12"
                  data-testid="new-password-input"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-foreground transition-colors"
                >
                  {showNew ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Password strength bar */}
              {strength && (
                <div className="pt-1 space-y-1">
                  <div className="h-1.5 w-full bg-surface-container-low rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{ width: strength.width, backgroundColor: strength.color }}
                    />
                  </div>
                  <p className="text-[11px] font-bold px-1" style={{ color: strength.color }}>
                    {strength.label}
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className={`rounded-2xl h-14 bg-surface-container-low border-outline-variant focus:ring-primary text-foreground font-medium pr-12
                    ${confirmPassword && newPassword !== confirmPassword ? 'border-red-500 focus:ring-red-500/20' : ''}
                    ${confirmPassword && newPassword === confirmPassword ? 'border-green-500 focus:ring-green-500/20' : ''}
                  `}
                  data-testid="confirm-password-input"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-foreground transition-colors"
                >
                  {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {confirmPassword && newPassword !== confirmPassword && (
                <p className="text-[11px] font-bold text-red-500 px-1">Passwords don't match</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-14 rounded-2xl premium-gradient-btn text-white dark:text-background font-black text-lg uppercase tracking-widest shadow-xl shadow-primary/20"
              data-testid="reset-password-btn"
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
