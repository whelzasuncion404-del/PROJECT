import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { RouterLink } from '@angular/router';
import { AdminProduct, productStock, readAdminStorage, writeAdminStorage } from '../admin/admin-data';

@Component({
  selector: 'app-admin-inventory',
  templateUrl: 'admin-inventory.page.html',
  styleUrls: ['admin-inventory.page.scss'],
  standalone: true,
  imports: [CommonModule, IonContent, RouterLink],
})
export class AdminInventoryPage implements OnInit {
  activeTab = 'csuwide';
  products: AdminProduct[] = [];
  stock = productStock;

  ngOnInit(): void {
    this.products = readAdminStorage<AdminProduct[]>('agilaProducts', []);
  }

  get filteredProducts(): AdminProduct[] {
    if (this.activeTab === 'necessities') return this.products.filter((product) => product.type === 'necessities');
    if (this.activeTab === 'college') return this.products.filter((product) => product.type !== 'necessities' && product.college !== 'General');
    return this.products.filter((product) => product.type !== 'necessities' && product.college === 'General');
  }

  setTab(tab: string): void { this.activeTab = tab; }

  deleteProduct(product: AdminProduct): void {
    this.products = this.products.filter((item) => item !== product);
    writeAdminStorage('agilaProducts', this.products);
  }
}
