export type Category = 'Home' | 'Makeup' | 'Doctors' | 'Cars' | 'Graduation Projects';

export interface Product {
  id: string;
  name: string;
  title?: string;
  description: string;
  category: Category;
  price: number;
  image?: string;
  imageUrl?: string;
  images: string[];
  rating: number;
  reviews: number;
  dimensions: string;
  colors: string[];
  sizes: string[];
  stock: number;
  inStock?: boolean;
  featured?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface Service {
  title: string;
  description: string;
  icon: string;
  features: string[];
}

export interface Testimonial {
  name: string;
  role: string;
  review: string;
  product: string;
  avatar: string;
  rating: number;
}

export interface FAQ {
  question: string;
  answer: string;
}