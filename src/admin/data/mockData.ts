export const categories = ['Electronics', 'Clothing', 'Home', 'Books'];

export const products = [
  {
    id: 'p1',
    name: 'Wireless Headphones',
    category: 'Electronics',
    price: 99.99,
    stock: 120,
    status: 'active',
    image: 'https://via.placeholder.com/64',
  },
  {
    id: 'p2',
    name: 'Cotton T-Shirt',
    category: 'Clothing',
    price: 19.99,
    stock: 50,
    status: 'active',
    image: 'https://via.placeholder.com/64',
  },
  {
    id: 'p3',
    name: 'Espresso Maker',
    category: 'Home',
    price: 249.0,
    stock: 8,
    status: 'low-stock',
    image: 'https://via.placeholder.com/64',
  },
];

export const customers = [
  { id: 'c1', name: 'Alice Johnson', email: 'alice@example.com', orders: 4, spent: 420.5, status: 'active' },
  { id: 'c2', name: 'Bob Smith', email: 'bob@example.com', orders: 1, spent: 19.99, status: 'inactive' },
];

export const orders = [
  { id: 'o1001', customer: 'Alice Johnson', date: '2026-08-28', total: 199.99, payment: 'Paid', status: 'Pending' },
  { id: 'o1002', customer: 'Bob Smith', date: '2026-08-27', total: 19.99, payment: 'Paid', status: 'Shipped' },
];

export const sales = [120, 90, 140, 160, 200, 180, 220];
