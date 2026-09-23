import React, { useState, useEffect, useRef, useCallback } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import api from '../../utils/api';

const STORAGE_KEY = 'admin_last_seen_order_id';
const POLL_INTERVAL_MS = 5000; // كل كام ثانية نتشيك على أوردرات جديدة

interface NewOrderNotification {
  id: number;
  customerName: string;
  totalAmount: number;
  status: string;
  createdAt: string;
}

let audioCtx: AudioContext | null = null;
function beep() {
  audioCtx = audioCtx || new (window.AudioContext || (window as any).webkitAudioContext)();
  let t = audioCtx.currentTime;
  ([[523, 0.1, 0.02], [659, 0.1, 0.02], [784, 0.15, 0]] as [number, number, number][]).forEach(
    ([freq, dur, gap]) => {
      const o = audioCtx!.createOscillator();
      const g = audioCtx!.createGain();
      o.type = 'sine';
      o.frequency.value = freq;
      o.connect(g);
      g.connect(audioCtx!.destination);
      g.gain.setValueAtTime(0.001, t);
      g.gain.exponentialRampToValueAtTime(0.3, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.001, t + dur);
      o.start(t);
      o.stop(t + dur + 0.02);
      t += dur + gap;
    }
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ===== Order notification state =====
  const [queue, setQueue] = useState<NewOrderNotification[]>([]);
  const lastSeenIdRef = useRef<number>(Number(localStorage.getItem(STORAGE_KEY)) || 0);
  const initializedRef = useRef(false);
  const ringIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const poll = useCallback(async () => {
    try {
      if (!initializedRef.current) {
        initializedRef.current = true;

        // لو مفيش قيمة متخزنة قبل كده، ده معناه أول مرة فعلاً بيتشغل فيها النظام
        // في الحالة دي بس نعمل "تصفير" ونجيب آخر Id موجود عشان منبعتش إشعارات
        // لكل الأوردرات القديمة اللي كانت موجودة قبل كده
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) {
          const res = await api.get<{ latestId: number }>('/Orders/latest-id');
          lastSeenIdRef.current = res.data.latestId;
          localStorage.setItem(STORAGE_KEY, String(res.data.latestId));
          return;
        }
        // لو فيه قيمة متخزنة بالفعل (يعني الكومبوننت بيتعمل له remount بس مش أول مرة)
        // منعملش reset، ونكمل نتشيك عادي على أي حاجة جت بعد آخر Id محفوظ
      }

      const res = await api.get<NewOrderNotification[]>(`/Orders/new?afterId=${lastSeenIdRef.current}`);
      if (res.data.length > 0) {
        setQueue((prev) => [...prev, ...res.data]);
        const maxId = Math.max(...res.data.map((o) => o.id));
        lastSeenIdRef.current = maxId;
        localStorage.setItem(STORAGE_KEY, String(maxId));
      }
    } catch (err) {
      console.error('Order polling error:', err);
    }
  }, []);

  useEffect(() => {
    poll();
    const interval = setInterval(poll, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [poll]);

  const currentOrder = queue[0] ?? null;

  useEffect(() => {
    if (!currentOrder) {
      if (ringIntervalRef.current) clearInterval(ringIntervalRef.current);
      return;
    }
    beep();
    ringIntervalRef.current = setInterval(beep, 2200);
    return () => {
      if (ringIntervalRef.current) clearInterval(ringIntervalRef.current);
    };
  }, [currentOrder]);

  const dismissCurrent = () => setQueue((prev) => prev.slice(1));

  return (
    <div className="min-h-screen flex bg-neutral-950 text-white">
      <style>{`
        @keyframes order-ring-pulse {
          0%, 100% { box-shadow: 0 12px 30px rgba(0,0,0,.5), 0 0 0 4px rgba(34,224,122,.25); }
          50% { box-shadow: 0 12px 30px rgba(0,0,0,.5), 0 0 0 9px rgba(34,224,122,.4); }
        }
      `}</style>

      {currentOrder && (
        <div
          dir="rtl"
          className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] w-[280px] rounded-2xl border border-white/10 bg-neutral-900 p-4"
          style={{ animation: 'order-ring-pulse 1s infinite' }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="rounded-full bg-orange-500 px-2.5 py-0.5 text-[11px] font-bold text-black">
              NEW ORDER
            </span>
            <span className="text-xs text-neutral-400">#{currentOrder.id}</span>
          </div>
          <p className="text-2xl font-extrabold text-emerald-400">
            {Number(currentOrder.totalAmount).toFixed(2)} EGP
          </p>
          <p className="mt-1 text-xs text-neutral-400">{currentOrder.customerName}</p>
          <button
            onClick={dismissCurrent}
            className="mt-3 w-full rounded-xl bg-emerald-500 py-2 text-sm font-bold text-black transition-transform active:scale-95"
          >
            ✅ استلمت الطلب{queue.length > 1 ? ` (متبقي ${queue.length - 1})` : ''}
          </button>
        </div>
      )}

      {/* Sidebar with mobile state */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={() => {
          // Add your logout logic here
          console.log('Logging out...');
        }}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="p-4 sm:p-6 lg:p-8 flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}