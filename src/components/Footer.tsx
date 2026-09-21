import { Link } from 'react-router-dom';
import { Logo } from './Logo';
import { Linkedin, Phone, Store, MessageCircle } from 'lucide-react';

const footerLinks = {
  Company: [
    { to: '/about', label: 'About' },
    { to: '/services', label: 'Services' },
  ],
  Shop: [
    { to: '/products', label: 'All Products' },
    { to: '/products?category=Home', label: '3D Printed' },
    { to: '/products?category=Graduation Projects', label: 'Graduation Projects' },
  ],
  Account: [
    { to: '/login', label: 'Login' },
    { to: '/register', label: 'Register' },
    { to: '/checkout', label: 'Checkout' },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-white">
      <div className="mx-auto max-w-8xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Logo />
            <p className="mt-4 max-w-xs text-sm text-neutral-500">
              A modern printing studio for custom printing, 3D-printed products, and everything in between.
            </p>

            <div className="mt-6 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-neutral-800">
                <Store size={14} className="text-orange-600" />
                <span>Brand Owner: <span className="text-neutral-600 font-normal">fares youssef</span></span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-neutral-800">
                <Phone size={14} className="text-orange-600" />
                <span>Phone: <span className="text-neutral-600 font-normal" dir="ltr">01025334335</span></span>
              </div>
            </div>
          </div>

          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="text-sm font-semibold text-neutral-900">{heading}</h4>
              <ul className="mt-4 space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-neutral-500 transition-colors hover:text-orange-600"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>{'\u00A9'} {new Date().getFullYear()} Artyy 3D. All rights reserved.</p>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span>Designed and Developed by</span>
              
              <a
                href="https://www.linkedin.com/in/wise-tech-892715438"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-neutral-900 hover:text-orange-600 transition-colors flex items-center gap-1 underline underline-offset-2"
              >
                <Linkedin size={13} className="text-orange-600" />
                <span>Wise Tech</span>
              </a>
            </div>

            <a
              href="https://wa.me/201207432930"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat on WhatsApp"
              className="flex items-center justify-center rounded-full p-1.5 text-green-600 transition-colors hover:bg-green-50 hover:text-green-700"
            >
              <MessageCircle size={16} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}