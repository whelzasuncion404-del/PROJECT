import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular';
import { RouterLink } from '@angular/router';

interface StoredUser {
  username: string;
  googleEmail: string;
  createdAt: string;
}

interface Product {
  title: string;
  college: string;
  price: string;
  image: string;
  sizes?: Record<string, number>;
  colors?: string;
  stock?: number;
  type?: 'standard' | 'necessities';
}

interface Notice {
  title: string;
  linkText: string;
  linkUrl: string;
}

interface LoginLog {
  user: string;
  time: string;
}

@Component({
  selector: 'app-admin',
  templateUrl: 'admin.page.html',
  styleUrls: ['admin.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonContent, RouterLink],
})
export class AdminPage implements OnInit {
  activeView = 'dashboard';
  activeInventoryTab = 'csuwide';
  users: StoredUser[] = [];
  products: Product[] = [];
  notices: Notice[] = [];
  loginLogs: LoginLog[] = [];

  productForm: Product = this.emptyProduct('standard');
  noticeForm: Notice = this.emptyNotice();
  productSizes = ['Free Size', 'XS', 'S', 'M', 'L', 'XL', '2XL'];
  necessitySizes = ['Small', 'Medium', 'Large', 'Standard / Free Size'];
  selectedSizes: Record<string, number> = { 'Free Size': 10 };
  editingNoticeIndex: number | null = null;

  ngOnInit(): void {
    this.users = this.readStorage<StoredUser[]>('agilaUsers', []);
    this.products = this.readStorage<Product[]>('agilaProducts', []);
    this.notices = this.readStorage<Notice[]>('agilaNotices', []).map((notice) => ({
      title: notice.title,
      linkText: notice.linkText || '',
      linkUrl: notice.linkUrl || '#',
    }));
    this.loginLogs = this.readStorage<LoginLog[]>('agilaLoginLogs', []);
  }

  get productCount(): number { return this.products.length; }
  get noticeCount(): number { return this.notices.length; }
  get filteredProducts(): Product[] {
    if (this.activeInventoryTab === 'csuwide') {
      return this.products.filter((product) => product.type !== 'necessities' && product.college === 'General');
    }
    if (this.activeInventoryTab === 'necessities') {
      return this.products.filter((product) => product.type === 'necessities');
    }
    return this.products.filter((product) => product.type !== 'necessities' && product.college !== 'General');
  }

  switchView(view: string): void { this.activeView = view; }

  switchInventoryTab(tab: string): void {
    this.activeInventoryTab = tab;
  }

  toggleSize(size: string): void {
    if (this.selectedSizes[size] === undefined) {
      this.selectedSizes[size] = 10;
    } else {
      delete this.selectedSizes[size];
    }
  }

  saveProduct(): void {
    if (!this.productForm.title.trim() || !this.productForm.price.trim() || Object.keys(this.selectedSizes).length === 0) {
      return;
    }

    this.products = [...this.products, {
      ...this.productForm,
      title: this.productForm.title.trim(),
      sizes: { ...this.selectedSizes },
      image: this.productForm.image.trim(),
      type: this.productForm.type || 'standard',
    }];
    this.persist('agilaProducts', this.products);
    this.productForm = this.emptyProduct(this.activeView === 'necessities' ? 'necessities' : 'standard');
    this.selectedSizes = this.activeView === 'necessities' ? { 'Standard / Free Size': 50 } : { 'Free Size': 10 };
    this.activeView = 'inventory';
  }

  deleteProduct(product: Product): void {
    this.products = this.products.filter((item) => item !== product);
    this.persist('agilaProducts', this.products);
  }

  saveNotice(): void {
    if (!this.noticeForm.title.trim() || !this.noticeForm.linkText.trim()) {
      return;
    }

    const notice = { ...this.noticeForm, title: this.noticeForm.title.trim(), linkText: this.noticeForm.linkText.trim(), linkUrl: this.noticeForm.linkUrl.trim() || '#' };
    if (this.editingNoticeIndex === null) {
      this.notices = [...this.notices, notice];
    } else {
      this.notices = this.notices.map((item, index) => index === this.editingNoticeIndex ? notice : item);
    }
    this.persist('agilaNotices', this.notices);
    this.noticeForm = this.emptyNotice();
    this.editingNoticeIndex = null;
  }

  editNotice(index: number): void {
    this.noticeForm = { ...this.notices[index] };
    this.editingNoticeIndex = index;
  }

  deleteNotice(index: number): void {
    this.notices = this.notices.filter((_notice, noticeIndex) => noticeIndex !== index);
    this.persist('agilaNotices', this.notices);
  }

  clearLogs(): void {
    this.loginLogs = [];
    localStorage.removeItem('agilaLoginLogs');
  }

  downloadLogs(): void {
    const blob = new Blob([JSON.stringify(this.loginLogs, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'login_logs.json';
    link.click();
    URL.revokeObjectURL(link.href);
  }

  logout(): void {
    window.location.href = '/home';
  }

  totalStock(product: Product): number {
    return product.sizes
      ? Object.values(product.sizes).reduce((total, quantity) => total + Number(quantity), 0)
      : Number(product.stock || 0);
  }

  private emptyProduct(type: 'standard' | 'necessities'): Product {
    return { title: '', college: type === 'necessities' ? 'Food' : 'General', price: '', image: '', colors: '', type };
  }

  private emptyNotice(): Notice { return { title: '', linkText: '', linkUrl: '' }; }

  private persist<T>(key: string, value: T): void { localStorage.setItem(key, JSON.stringify(value)); }

  private readStorage<T>(key: string, fallback: T): T {
    try {
      const stored = localStorage.getItem(key);
      return stored ? (JSON.parse(stored) as T) : fallback;
    } catch {
      return fallback;
    }
  }
}
