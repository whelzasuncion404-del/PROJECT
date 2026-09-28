export interface AdminProduct {
  title: string;
  college: string;
  price: string;
  image: string;
  sizes?: Record<string, number>;
  colors?: string;
  stock?: number;
  type?: 'standard' | 'necessities';
}

export interface AdminNotice {
  title: string;
  linkText: string;
  linkUrl: string;
}

export interface AdminLoginLog {
  user: string;
  type?: string;
  time: string;
}

export interface AdminUser {
  username: string;
  googleEmail: string;
  createdAt: string;
}

export function readAdminStorage<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeAdminStorage<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export function productStock(product: AdminProduct): number {
  return product.sizes
    ? Object.values(product.sizes).reduce((total, quantity) => total + Number(quantity), 0)
    : Number(product.stock || 0);
}
