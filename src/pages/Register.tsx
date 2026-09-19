import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '@/services/auth';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { Loader2 } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const { notify } = useToast();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  // مطابقة أسماء الحقول مع المتوقع في الـ Backend (RegisterDto)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    passwordHash: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authService.register(formData);

      if (response && response.token) {
        login(response.token, {
          id: response.userId || response.id || '',
          email: formData.email,
          name: formData.fullName,
          role: response.role || 'User',
        });
      }

      notify('Account created successfully!');
      navigate('/');
    } catch (error: unknown) {
      notify((error as Error).message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-12">
      <div className="rounded-2xl border border-white/5 bg-surface p-8 shadow-xl">
        <h1 className="mb-6 text-2xl font-bold text-white">Create an Account</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-white/70">Full Name</label>
            <input
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-black/20 p-3 text-sm text-white focus:border-ember focus:outline-none"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-white/70">Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-black/20 p-3 text-sm text-white focus:border-ember focus:outline-none"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-white/70">Password</label>
            <input
              type="password"
              required
              value={formData.passwordHash}
              onChange={(e) => setFormData({ ...formData, passwordHash: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-black/20 p-3 text-sm text-white focus:border-ember focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-ember py-3 text-sm font-semibold text-white transition-all hover:bg-orange-500 disabled:opacity-50"
          >
            {loading && <Loader2 size={18} className="animate-spin" />}
            Register
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-white/50">
          Already have an account?{' '}
          <Link to="/login" className="text-ember hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}