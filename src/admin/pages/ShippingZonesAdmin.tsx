// import { useState, useEffect } from 'react';
// import { Plus, Trash2, Edit2, Save, X, Loader2, MapPin } from 'lucide-react';
// import { toast } from 'sonner';
// import axios from 'axios';
// import { useSEO } from '@/hooks/useSEO';
// import { formatPrice } from '@/utils/format';

// interface ShippingZone {
//   id: number;
//   areaName: string;
//   price: number;
// }

// export default function ShippingZonesAdmin() {
//   useSEO({ title: 'Admin | Shipping Zones Management' });
//   const [zones, setZones] = useState<ShippingZone[]>([]);
//   const [loading, setLoading] = useState(true);
  
//   // States للإضافة والتعديل
//   const [newAreaName, setNewAreaName] = useState('');
//   const [newPrice, setNewPrice] = useState('');
//   const [editingId, setEditingId] = useState<number | null>(null);
//   const [editAreaName, setEditAreaName] = useState('');
//   const [editPrice, setEditPrice] = useState('');

//   const fetchZones = async () => {
//     try {
//       const res = await axios.get('https://localhost:7254/api/ShippingZones');
//       setZones(res.data);
//     } catch {
//       toast.error('Failed to load shipping zones');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchZones();
//   }, []);

//   // إضافة منطقة جديدة
//   const handleAddZone = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!newAreaName || !newPrice) return toast.error('Please fill all fields');

//     try {
//       await axios.post('https://localhost:7001/api/ShippingZones', {
//         areaName: newAreaName,
//         price: parseFloat(newPrice),
//       });
//       toast.success('Zone added successfully');
//       setNewAreaName('');
//       setNewPrice('');
//       fetchZones();
//     } catch {
//       toast.error('Failed to add zone');
//     }
//   };

//   // حذف منطقة
//   const handleDelete = async (id: number) => {
//     if (!confirm('Are you sure you want to delete this zone?')) return;
//     try {
//       await axios.delete(`https://localhost:7001/api/ShippingZones/${id}`);
//       toast.success('Zone deleted');
//       setZones(zones.filter(z => z.id !== id));
//     } catch {
//       toast.error('Failed to delete zone');
//     }
//   };

//   // بدء التعديل
//   const startEdit = (zone: ShippingZone) => {
//     setEditingId(zone.id);
//     setEditAreaName(zone.areaName);
//     setEditPrice(zone.price.toString());
//   };

//   // حفظ التعديل
//   const handleUpdate = async (id: number) => {
//     try {
//       await axios.put(`https://localhost:7001/api/ShippingZones/${id}`, {
//         id,
//         areaName: editAreaName,
//         price: parseFloat(editPrice),
//       });
//       toast.success('Zone updated successfully');
//       setEditingId(null);
//       fetchZones();
//     } catch {
//       toast.error('Failed to update zone');
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex h-[50vh] items-center justify-center">
//         <Loader2 className="animate-spin text-ember" size={32} />
//       </div>
//     );
//   }

//   return (
//     <div className="mx-auto max-w-5xl px-4 py-10 text-white">
//       <div className="flex items-center justify-between mb-8">
//         <div>
//           <h1 className="text-2xl font-bold flex items-center gap-2">
//             <MapPin className="text-ember" /> Shipping Zones Management
//           </h1>
//           <p className="text-xs text-gray-400 mt-1">Manage delivery areas and prices in Tanta dynamically.</p>
//         </div>
//       </div>

//       {/* نموذج إضافة منطقة جديدة */}
//       <form onSubmit={handleAddZone} className="mb-8 flex flex-col sm:flex-row gap-3 rounded-2xl border border-white/10 bg-neutral-900/60 p-4 backdrop-blur-xl shadow-xl">
//         <input
//           type="text"
//           placeholder="Area Name (e.g. ش سعيد)"
//           value={newAreaName}
//           onChange={(e) => setNewAreaName(e.target.value)}
//           className="flex-1 rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-ember focus:outline-none"
//         />
//         <input
//           type="number"
//           placeholder="Price (EGP)"
//           value={newPrice}
//           onChange={(e) => setNewPrice(e.target.value)}
//           className="w-full sm:w-40 rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-ember focus:outline-none"
//         />
//         <button type="submit" className="flex items-center justify-center gap-2 rounded-xl bg-ember px-6 py-3 text-sm font-bold text-white hover:bg-orange-500 transition-all shadow-lg shadow-orange-500/20">
//           <Plus size={18} /> Add Zone
//         </button>
//       </form>

//       {/* جدول عرض المناطق */}
//       <div className="overflow-x-auto rounded-2xl border border-white/10 bg-neutral-900/60 backdrop-blur-xl shadow-xl">
//         <table className="w-full text-left text-sm text-gray-300">
//           <thead className="border-b border-white/10 bg-black/40 text-xs uppercase text-gray-400">
//             <tr>
//               <th className="px-6 py-4">ID</th>
//               <th className="px-6 py-4">Area Name</th>
//               <th className="px-6 py-4">Shipping Price</th>
//               <th className="px-6 py-4 text-right">Actions</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-white/5">
//             {zones.map((zone) => (
//               <tr key={zone.id} className="hover:bg-white/[0.02] transition-colors">
//                 <td className="px-6 py-4 font-mono text-gray-500">{zone.id}</td>
//                 <td className="px-6 py-4 font-medium text-white">
//                   {editingId === zone.id ? (
//                     <input
//                       type="text"
//                       value={editAreaName}
//                       onChange={(e) => setEditAreaName(e.target.value)}
//                       className="rounded-lg border border-ember bg-black px-3 py-1.5 text-sm text-white focus:outline-none"
//                     />
//                   ) : (
//                     zone.areaName
//                   )}
//                 </td>
//                 <td className="px-6 py-4">
//                   {editingId === zone.id ? (
//                     <input
//                       type="number"
//                       value={editPrice}
//                       onChange={(e) => setEditPrice(e.target.value)}
//                       className="w-28 rounded-lg border border-ember bg-black px-3 py-1.5 text-sm text-white focus:outline-none"
//                     />
//                   ) : (
//                     formatPrice(zone.price)
//                   )}
//                 </td>
//                 <td className="px-6 py-4 text-right space-x-2">
//                   {editingId === zone.id ? (
//                     <>
//                       <button onClick={() => handleUpdate(zone.id)} className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-all">
//                         <Save size={16} />
//                       </button>
//                       <button onClick={() => setEditingId(null)} className="p-2 rounded-lg bg-gray-700/50 text-gray-400 hover:bg-gray-700 transition-all">
//                         <X size={16} />
//                       </button>
//                     </>
//                   ) : (
//                     <>
//                       <button onClick={() => startEdit(zone)} className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-all">
//                         <Edit2 size={16} />
//                       </button>
//                       <button onClick={() => handleDelete(zone.id)} className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all">
//                         <Trash2 size={16} />
//                       </button>
//                     </>
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }