const API_BASE = 'https://localhost:7254/api';

export interface RegisterDto {
  fullName: string;
  email: string;
  passwordHash: string;
}

export interface LoginDto {
  email: string;
  passwordHash: string;
}

export const authService = {

  register: async (data: RegisterDto) => {
    const res = await fetch(`${API_BASE}/Auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },


  login: async (data: LoginDto) => {
    const res = await fetch(`${API_BASE}/Auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(await res.text());
    const result = await res.json();
    
   
    if (result.token) {
      localStorage.setItem('token', result.token);
    }
    return result;
  },

 
  logout: () => {
    localStorage.removeItem('token');
  },

  
  getToken: () => localStorage.getItem('token'),
};
export const authFetch = async (url: string, options: RequestInit = {}) => {
  const token = authService.getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  return fetch(url, { ...options, headers });
};