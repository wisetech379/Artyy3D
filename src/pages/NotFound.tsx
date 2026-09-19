import { Link } from 'react-router-dom';
import { useSEO } from '@/hooks/useSEO';

export default function NotFound() {
  useSEO({ title: '3Print | Page Not Found' });
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center">
      <p className="text-6xl font-bold text-ember">404</p>
      <h1 className="text-2xl font-bold text-white">Page not found</h1>
      <p className="text-white/50">The page you are looking for does not exist or has moved.</p>
      <Link to="/" className="rounded-full bg-ember px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-orange-500">
        Back to Home
      </Link>
    </div>
  );
}
