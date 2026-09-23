import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Analytics } from '@vercel/analytics/react';

import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { ToastProvider } from '@/context/ToastContext';
import { Layout } from '@/components/Layout';
import { ProtectedRoute } from '@/components/ProtectedRoute';

const Home = lazy(() => import('@/pages/Home'));
const About = lazy(() => import('@/pages/About'));
const Services = lazy(() => import('@/pages/Services'));
const Products = lazy(() => import('@/pages/Products'));
const ProductDetails = lazy(() => import('@/pages/ProductDetails'));
const Login = lazy(() => import('@/pages/Login'));
const Register = lazy(() => import('@/pages/Register'));
const ForgotPassword = lazy(() => import('@/pages/ForgotPassword'));
const Checkout = lazy(() => import('@/pages/Checkout'));
const OrderSuccess = lazy(() => import('@/pages/OrderSuccess'));
const MyOrders = lazy(() => import('@/pages/MyOrders'));
const NotFound = lazy(() => import('@/pages/NotFound'));
const AdminApp = lazy(() => import('@/admin/App'));
const Maintenance = lazy(() => import('@/pages/Maintenance'));

// شغّل/أوقف وضع الصيانة من هنا فقط: غيّر VITE_MAINTENANCE_MODE في Vercel Environment Variables لـ "true" أو "false"
const isMaintenanceMode = import.meta.env.VITE_MAINTENANCE_MODE === 'true';
console.log('Maintenance Mode:', import.meta.env.VITE_MAINTENANCE_MODE);

function PageLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-ember" />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      {/* Vercel Analytics Integration */}
      <Analytics />

      {/* Toast Notifications Container */}
      <Toaster
        position="top-right"
        richColors
        theme="light"
        toastOptions={{
          style: {
            background: '#ffffff',
            border: '1px solid rgba(17, 17, 17, 0.12)',
            color: '#111111',
          },
        }}
      />
      <AuthProvider>
        <ToastProvider>
          <CartProvider>
            {isMaintenanceMode ? (
              // وضع الصيانة شغال: كل حاجة تتحول لصفحة الصيانة إلا لوحة الأدمن (/admin) عشان تقدر تدير الموقع عادي
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route element={<ProtectedRoute requiredRole="Admin" />}>
                    <Route path="/admin/*" element={<AdminApp />} />
                  </Route>
                  <Route path="/login" element={<Login />} />
                  <Route path="*" element={<Maintenance />} />
                </Routes>
              </Suspense>
            ) : (
              <Layout>
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/products/:id" element={<ProductDetails />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/order-success" element={<OrderSuccess />} />

                    {/* Protected User Routes */}
                    <Route element={<ProtectedRoute />}>
                      <Route path="/my-orders" element={<MyOrders />} />
                    </Route>

                    {/* Protected Admin Routes */}
                    <Route element={<ProtectedRoute requiredRole="Admin" />}>
                      <Route path="/admin/*" element={<AdminApp />} />
                    </Route>

                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </Layout>
            )}
          </CartProvider>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}