import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export function Logo({ className = '' }: LogoProps) {
  return (
    <Link
      to="/"
      className={`group flex items-center transition-transform hover:scale-105 ${className}`}
    >
      <img 
        src="/src/assets/artyy3d_logo_transparent.png" 
        // alt="Artyy 3D" 
        className="h-14 w-auto object-contain" 
      />
    </Link>
  );
}