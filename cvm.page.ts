import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { IonContent, IonModal, IonButton } from '@ionic/angular';
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
  selector: 'app-cvm',
  templateUrl: 'cvm.page.html',
  styleUrls: ['cvm.page.scss'],
  standalone: true,
  imports: [CommonModule, IonContent, IonModal, IonButton, RouterLink],
})
export class CvmPage implements OnInit {
  cvmProducts: Product[] = [];
  selectedProduct: Product | null = null;
  isModalOpen: boolean = false;
  
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
    if (product.sizes && typeof product.sizes === 'object') {
      return Object.values(product.sizes).reduce(
        (total: number, quantity: any) => total + Number(quantity || 0),
        0
      );
    }

    return Number(product.stock || 0);
  }

  openProductDetails(product: Product): void {
    this.selectedProduct = product;
    this.isModalOpen = true;
  }

  closeProductDetails(): void {
    this.isModalOpen = false;
    this.selectedProduct = null;
  }

  private loadProducts(): void {
    const products = this.readStorage<Product[]>('agilaProducts', []);
    this.cvmProducts = products.filter((product) => {
      const college = product.college?.toLowerCase();
      return college === 'cvm' || college === 'college of veterinary medicine';
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