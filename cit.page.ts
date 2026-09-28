import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { RouterLink } from '@angular/router';

interface Product {
  title: string;
  college?: string;
  price: string;
  image?: string;
  stock?: number;
  sizes?: Record<string, number>;
}

@Component({
  selector: 'app-cit',
  templateUrl: 'cit.page.html',
  styleUrls: ['cit.page.scss'],
  standalone: true,
  imports: [CommonModule, IonContent, RouterLink],
})
export class CitPage implements OnInit {
  products: Product[] = [];
  currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  ngOnInit(): void {
    this.loadProducts();
  }

  @HostListener('window:storage', ['$event'])
  onStorageChange(event: StorageEvent): void {
    if (event.key === 'agilaProducts') {
      this.loadProducts();
    }
  }

  totalStock(product: Product): number {
    if (product.sizes) {
      return Object.values(product.sizes).reduce((total, quantity) => total + Number(quantity), 0);
    }

    return Number(product.stock || 0);
  }

  private loadProducts(): void {
    const products = this.readStorage<Product[]>('agilaProducts', []);
    this.products = products.filter((product) => {
      const college = product.college?.toLowerCase();
      return college === 'cit' || college === 'college of industrial technology';
    });
  }

  private readStorage<T>(key: string, fallback: T): T {
    try {
      const stored = localStorage.getItem(key);
      return stored ? (JSON.parse(stored) as T) : fallback;
    } catch {
      return fallback;
    }
  }
}