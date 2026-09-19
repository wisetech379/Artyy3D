import React from 'react';
import AdminLayout from '../layouts/AdminLayout';
import { Users, Lock } from 'lucide-react';

export default function CustomersPage() {
  return (
    <AdminLayout>
      <div className="space-y-6" dir="auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-orange-500 flex items-center gap-2">
              <Users className="text-orange-500 shrink-0" size={24} /> Customers Directory
            </h2>
            <p className="text-sm text-neutral-400 mt-1">
              Registered user accounts and their purchasing history.
            </p>
          </div>
        </div>

        {/* رسالة التواصل مع المبرمج في منتصف الصفحة */}
        <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-neutral-900/70 p-8 sm:p-12 text-center shadow-2xl backdrop-blur-sm min-h-[400px]">
          <div className="rounded-full bg-orange-500/10 p-4 border border-orange-500/20 mb-4 text-orange-400">
            <Lock size={32} />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white mb-2">تواصل مع مبرمج هذا السايت لكي يسمح لك برؤية البيانات</h3>
          <p className="text-sm text-neutral-400 max-w-md leading-relaxed">
            هذه الصفحة تتطلب صلاحيات خاصة أو تفعيل الـ API الخاص بالعملاء من قِبل المطور المسؤول عن المشروع.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}

/* ==========================================================================
   OLD CODE (COMMENTED OUT)
   ==========================================================================
// import React, { useState, useEffect } from 'react';
// import AdminLayout from '../layouts/AdminLayout';
// import { toast } from 'sonner';
// import { Search, Users, Mail, ShoppingBag } from 'lucide-react';

// interface Customer {
//   id: number;
//   fullName: string;
//   email: string;
//   role: string;
//   ordersCount: number;
//   totalSpent: number;
//   status: string;
// }

// export default function CustomersPage() {
//   const [customers, setCustomers] = useState<Customer[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [q, setQ] = useState('');

//   const fetchCustomers = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem('token');
//       const headers: Record<string, string> = {};
//       if (token) headers['Authorization'] = `Bearer ${token}`;

//       const res = await fetch('https://localhost:7254/api/Auth/customers', { headers });
//       if (!res.ok) throw new Error('Failed to load customers');

//       const data = await res.json();
//       setCustomers(data);
//     } catch (error) {
//       console.error(error);
//       toast.error('Failed to load customers from server');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCustomers();
//   }, []);

//   const filtered = customers.filter((c) => {
//     const nameMatch = c.fullName?.toLowerCase().includes(q.toLowerCase()) ?? false;
//     const emailMatch = c.email?.toLowerCase().includes(q.toLowerCase()) ?? false;
//     return nameMatch || emailMatch;
//   });

//   return (
//     <AdminLayout>
//       <div className="space-y-6">
//         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//           <div>
//             <h2 className="text-2xl font-bold tracking-tight text-orange-500 flex items-center gap-2">
//               <Users className="text-orange-500" size={24} /> Customers Directory
//             </h2>
//             <p className="text-sm text-neutral-400 mt-1">
//               Registered user accounts and their purchasing history.
//             </p>
//           </div>

//           <div className="relative w-full sm:w-72">
//             <Search className="absolute left-3 top-2.5 text-neutral-500" size={16} />
//             <input
//               placeholder="Search by name or email..."
//               value={q}
//               onChange={(e) => setQ(e.target.value)}
//               className="w-full rounded-xl border border-white/10 bg-neutral-900/90 py-2 pl-9 pr-4 text-sm text-white placeholder:text-neutral-500 outline-none transition-colors focus:border-orange-500"
//             />
//           </div>
//         </div>

//         <div className="overflow-hidden rounded-2xl border border-white/10 bg-neutral-900/70 shadow-2xl backdrop-blur-sm">
//           <div className="overflow-x-auto">
//             <table className="w-full text-left text-sm text-neutral-300">
//               <thead className="border-b border-white/10 bg-black/40 text-xs font-semibold uppercase tracking-wider text-neutral-400">
//                 <tr>
//                   <th className="px-6 py-4">Customer</th>
//                   <th className="px-6 py-4">Role</th>
//                   <th className="px-6 py-4">Orders Placed</th>
//                   <th className="px-6 py-4">Total Spent</th>
//                   <th className="px-6 py-4">Status</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-white/5">
//                 {loading ? (
//                   <tr>
//                     <td colSpan={5} className="px-6 py-12 text-center text-neutral-500">
//                       Loading registered customers...
//                     </td>
//                   </tr>
//                 ) : filtered.length === 0 ? (
//                   <tr>
//                     <td colSpan={5} className="px-6 py-12 text-center text-neutral-500">
//                       No customers found.
//                     </td>
//                   </tr>
//                 ) : (
//                   filtered.map((c) => (
//                     <tr key={c.id} className="transition-colors hover:bg-white/[0.02]">
//                       <td className="px-6 py-4">
//                         <p className="font-semibold text-white">{c.fullName}</p>
//                         <p className="text-xs text-neutral-400 flex items-center gap-1.5 mt-0.5">
//                           <Mail size={12} /> {c.email}
//                         </p>
//                       </td>
//                       <td className="px-6 py-4">
//                         <span className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs font-medium text-neutral-300">
//                           {c.role}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4">
//                         <span className="inline-flex items-center gap-1.5 rounded-md border border-white/5 bg-white/5 px-2.5 py-1 text-xs text-neutral-300">
//                           <ShoppingBag size={12} className="text-orange-400" />
//                           {c.ordersCount} orders
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 font-semibold text-orange-400">
//                         {Number(c.totalSpent).toFixed(2)} EGP
//                       </td>
//                       <td className="px-6 py-4">
//                         <span className="inline-flex items-center rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
//                           {c.status}
//                         </span>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </AdminLayout>
//   );
// }
========================================================================== */