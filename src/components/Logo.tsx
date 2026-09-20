import { Link } from 'react-router-dom';
import logo from "../assets/artyy3d_logo_transparent.png";
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
    src={logo}
        alt="Artyy 3D" 
        className="h-14 w-auto object-contain" 
      />
    </Link>
  );
}