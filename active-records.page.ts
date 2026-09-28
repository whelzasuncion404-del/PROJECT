import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular';
import { RouterLink } from '@angular/router';

interface Product {
  title: string;
  college?: string;
  price: string;
  image?: string;
  stock?: number;
  sizes?: Record<string, number>;
  type?: string;
}

@Component({
  selector: 'app-active-records',
  templateUrl: 'active-records.page.html',
  styleUrls: ['active-records.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonContent, RouterLink],
})
export class ActiveRecordsPage implements OnInit {
  searchQuery = '';
  products: Product[] = [];
  selectedProduct: Product | null = null;

  private readonly defaultProducts: Product[] = [
    {
      title: 'CSU ID Lanyard',
      college: 'General',
      price: 'PHP 150.00',
      image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=600',
      stock: 100,
      type: 'standard',
    },
    {
      title: 'Official CSU Hoodie',
      college: 'General',
      price: 'PHP 500.00',
      image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600',
      stock: 100,
      type: 'standard',
    },
    {
      title: 'CVM Jacket',
      college: 'CVM',
      price: 'PHP 500.00',
      image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600',
      stock: 100,
      type: 'standard',
    },
  ];

  ngOnInit(): void {
    this.products = this.readStorage<Product[]>('agilaProducts', this.defaultProducts);
  }

  get filteredProducts(): Product[] {
    const query = this.searchQuery.trim().toLowerCase();

    if (!query) {
      return this.products;
    }

    return this.products.filter((product) =>
      `${product.title} ${product.college || 'General'} ${product.type || ''}`
        .toLowerCase()
        .includes(query)
    );
  }

  totalStock(product: Product): number {
    if (product.sizes) {
      return Object.values(product.sizes).reduce((total, quantity) => total + Number(quantity), 0);
    }

    return Number(product.stock || 0);
  }

  openProductModal(product: Product): void {
    this.selectedProduct = product;
  }

  closeProductModal(): void {
    this.selectedProduct = null;
  }

  isNecessity(product: Product): boolean {
    return product.type?.toLowerCase() === 'necessities';
  }

  getProductSizes(product: Product): string[] {
    return Object.entries(product.sizes || {}).map(([size, quantity]) => `${size}: ${quantity} units`);
  }

  logout(): void {
    window.location.href = '/home';
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
