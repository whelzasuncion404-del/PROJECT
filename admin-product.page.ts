import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular';
import { RouterLink } from '@angular/router';
import { AdminProduct, readAdminStorage, writeAdminStorage } from '../admin/admin-data';

@Component({
  selector: 'app-admin-product',
  templateUrl: 'admin-product.page.html',
  styleUrls: ['admin-product.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonContent, RouterLink],
})
export class AdminProductPage {
  readonly sizes = ['Free Size', 'XS', 'S', 'M', 'L', 'XL', '2XL'];
  selectedSizes: Record<string, number> = { 'Free Size': 10 };
  product: AdminProduct = this.emptyProduct();

  toggleSize(size: string): void {
    if (this.selectedSizes[size] === undefined) {
      this.selectedSizes[size] = 10;
    } else {
      delete this.selectedSizes[size];
    }
  }

  saveProduct(): void {
    if (!this.product.title.trim() || !this.product.price.trim() || Object.keys(this.selectedSizes).length === 0) {
      return;
    }

    const products = readAdminStorage<AdminProduct[]>('agilaProducts', []);
    products.push({ ...this.product, title: this.product.title.trim(), sizes: { ...this.selectedSizes }, type: 'standard' });
    writeAdminStorage('agilaProducts', products);
    this.product = this.emptyProduct();
    this.selectedSizes = { 'Free Size': 10 };
  }

  private emptyProduct(): AdminProduct {
    return { title: '', college: 'General', price: '', image: '', colors: '', type: 'standard' };
  }
}
