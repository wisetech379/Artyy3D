import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Products = lazy(() => import('./pages/Products'));
const Orders = lazy(() => import('./pages/Orders'));
const Customers = lazy(() => import('./pages/Customers'));
const CustomOrdersPage = lazy(() => import('./pages/CustomOrdersPage'));

function Loader() {
  return <div className="p-6">Loading admin...</div>;
}

export default function AdminApp() {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/products" element={<Products />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/custom-orders" element={<CustomOrdersPage />} />
        <Route path="/customers" element={<Customers />} />
      </Routes>
    </Suspense>
  );
}