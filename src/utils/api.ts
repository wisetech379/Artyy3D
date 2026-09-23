import axios from 'axios';

const API_BASE = 'https://grateful-elegance-production-8692.up.railway.app/api';

export const api = axios.create({
  baseURL: API_BASE,
});

// إضافة Interceptor لإرفاق التوكن أوتوماتيك مع كل طلب
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// إضافة Interceptor للتعامل مع الأخطاء
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const hadToken = !!localStorage.getItem('token');

    // منعمل redirect للـ login غير لو اليوزر كان أصلاً عنده توكن (يعني جلسته انتهت)
    // لو الطلب اتبعت من غير توكن من الأساس (زيار/guest) مبنعملش تحويل،
    // وبنسيب الصفحة اللي بعتت الطلب هي اللي تتعامل مع الخطأ (زي رسالة toast)
    if (error.response && error.response.status === 401 && hadToken) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default api;