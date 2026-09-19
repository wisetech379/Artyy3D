import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '@/services/auth';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { Loader2 } from 'lucide-react';


function getRoleFromToken(token: string): string {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const parsed = JSON.parse(jsonPayload);
    return (
      parsed.role ||
      parsed['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
      'User'
    );
  } catch {
    return 'User';
  }
}

export default function Login() {
  const navigate = useNavigate();
  const { notify } = useToast();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', passwordHash: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authService.login(formData);

      if (response && response.token) {
        // تحديد الـ Role إما من الـ Response المباشر أو بفكه من الـ JWT Token
        const userRole = response.role || getRoleFromToken(response.token);

        login(response.token, {
          id: response.userId || response.id || '',
          email: formData.email,
          name: response.name || response.username || '',
          role: userRole,
        });

        notify('Logged in successfully!');

        // توجيه الأدمن إلى لوحة التحكم والمستخدم العادي للصفحة الرئيسية
        if (userRole === 'Admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      }
    } catch (error: unknown) {
      notify((error as Error).message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-12">
      <div className="rounded-2xl border border-white/5 bg-surface p-8 shadow-xl">
        <h1 className="mb-6 text-2xl font-bold text-white">Welcome Back</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
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
            Sign In
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-white/50">
          Don't have an account?{' '}
          <Link to="/register" className="text-ember hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}