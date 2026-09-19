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
    <div className="mx-auto flex min-h-[75vh] max-w-md flex-col justify-center px-4 py-12">
      <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
        <h1 className="mb-2 text-2xl font-bold tracking-tight text-neutral-900">Create an Account</h1>
        <p className="mb-6 text-sm text-neutral-500">Sign up to get started with Artyy 3D</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">Full Name</label>
            <input
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full rounded-xl border border-neutral-300 bg-white p-3 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full rounded-xl border border-neutral-300 bg-white p-3 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">Password</label>
            <input
              type="password"
              required
              value={formData.passwordHash}
              onChange={(e) => setFormData({ ...formData, passwordHash: e.target.value })}
              className="w-full rounded-xl border border-neutral-300 bg-white p-3 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-orange-600 active:scale-95 disabled:opacity-50"
          >
            {loading && <Loader2 size={18} className="animate-spin" />}
            <span>Register</span>
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-neutral-500">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-orange-600 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}