import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonContent, IonModal, IonButton } from '@ionic/angular'; // Added IonModal and IonButton
import { RouterLink } from '@angular/router';

interface Product {
  title: string;
  college: string;
  price: string;
  image: string;
  sizes?: Record<string, number>;
  stock?: number;
  type?: string;
}

interface Notice {
  title: string;
  linkText: string;
  linkUrl: string;
}

interface ProfileSettings {
  profilePicture: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: 'dashboard.page.html',
  styleUrls: ['dashboard.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonContent, IonModal, IonButton, RouterLink], // Added imports here
})
export class DashboardPage implements OnInit {
  searchQuery = '';
  searchOpen = false;
  currentSlide = 0;
  profilePicture = '';
  currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  // Modal / Selected Product state
  selectedProduct: Product | null = null;
  isModalOpen = false;

  readonly slides = [
    {
      label: 'Student Services',
      title: 'Everything Carigans need in one place',
      text: 'Find campus essentials, office notices, and verified records.',
      accent: 'Browse the latest updates',
    },
    {
      label: 'Campus Essentials',
      title: 'Uniforms, supplies, and daily needs',
      text: 'Check available items before visiting the Business Office.',
      accent: 'Inventory updated regularly',
    },
  ];

  products: Product[] = [];
  notices: Notice[] = [];

  private readonly defaultProducts: Product[] = [
    {
      title: 'Official Agila Hoodie',
      college: 'General',
      price: 'PHP 650.00',
      image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600',
      sizes: { M: 10, L: 15 },
      type: 'standard',
    },
    {
      title: 'CSU Campus Shirt',
      college: 'General',
      price: 'PHP 350.00',
      image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600',
      sizes: { S: 10, M: 20 },
      type: 'standard',
    },
    {
      title: 'CSU ID Lanyard',
      college: 'General',
      price: 'PHP 120.00',
      image: '',
      sizes: { 'Free Size': 50 },
      type: 'standard',
    },
    {
      title: 'Academic Notebook and Pen Set',
      college: 'General',
      price: 'PHP 150.00',
      image: '',
      sizes: { 'Free Size': 15 },
      type: 'standard',
    },
  ];

  private readonly defaultNotices: Notice[] = [
    {
      title: 'Academic Calendar',
      linkText: 'View CSU academic calendar 2026-2027',
      linkUrl: 'https://www.csu.edu.ph',
    },
    {
      title: 'Office Circular',
      linkText: 'Check the latest Business Office updates',
      linkUrl: '#',
    },
  ];

  ngOnInit(): void {
    this.loadStorageData();
  }

  ionViewWillEnter(): void {
    this.loadStorageData();
  }

  private loadStorageData(): void {
    this.products = this.readStorage<Product[]>('agilaProducts', this.defaultProducts);
    this.notices = this.readStorage<Notice[]>('agilaNotices', this.defaultNotices);
    this.profilePicture = this.readStorage<ProfileSettings>('agilaProfile', { profilePicture: '' }).profilePicture;
  }

  // Open product info modal
  openProductDetails(product: Product): void {
    this.selectedProduct = product;
    this.isModalOpen = true;
  }

  // Close product info modal
  closeProductDetails(): void {
    this.isModalOpen = false;
    this.selectedProduct = null;
  }

  get filteredProducts(): Product[] {
    const query = this.searchQuery ? this.searchQuery.trim().toLowerCase() : '';

    if (!query) {
      return this.products;
    }

    return this.products.filter((product) => {
      const baseFields = `${product.title || ''} ${product.college || ''} ${product.price || ''} ${product.type || ''}`.toLowerCase();
      
      let sizeFields = '';
      if (product.sizes) {
        sizeFields = Object.entries(product.sizes)
          .map(([size, qty]) => `${size} ${qty}`)
          .join(' ')
          .toLowerCase();
      }

      const stockField = product.stock !== undefined ? String(product.stock) : '';

      const combinedData = `${baseFields} ${sizeFields} ${stockField}`;
      return combinedData.includes(query);
    });
  }

  get currentSlideData() {
    return this.slides[this.currentSlide];
  }

  showSlide(index: number): void {
    this.currentSlide = (index + this.slides.length) % this.slides.length;
  }

  toggleSearch(): void {
    this.searchOpen = !this.searchOpen;
  }

  totalStock(product: Product): number {
    if (product.sizes) {
      return Object.values(product.sizes).reduce((total, quantity) => total + Number(quantity), 0);
    }

    return Number(product.stock || 0);
  }

  openSettings(): void {
    window.location.href = '/setting';
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