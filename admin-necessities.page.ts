import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular';
import { RouterLink } from '@angular/router';
import { AdminProduct, readAdminStorage, writeAdminStorage } from '../admin/admin-data';

@Component({
  selector: 'app-admin-necessities',
  templateUrl: 'admin-necessities.page.html',
  styleUrls: ['admin-necessities.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonContent, RouterLink],
})
export class AdminNecessitiesPage {
  readonly sizes = ['Small', 'Medium', 'Large', 'Standard / Free Size'];
  selectedSizes: Record<string, number> = { 'Standard / Free Size': 50 };
  item: AdminProduct = this.emptyItem();

  toggleSize(size: string): void {
    if (this.selectedSizes[size] === undefined) this.selectedSizes[size] = 20;
    else delete this.selectedSizes[size];
  }

  saveItem(): void {
    if (!this.item.title.trim() || !this.item.price.trim() || Object.keys(this.selectedSizes).length === 0) return;
    const products = readAdminStorage<AdminProduct[]>('agilaProducts', []);
    products.push({ ...this.item, title: this.item.title.trim(), sizes: { ...this.selectedSizes }, type: 'necessities' });
    writeAdminStorage('agilaProducts', products);
    this.item = this.emptyItem();
    this.selectedSizes = { 'Standard / Free Size': 50 };
  }

  private emptyItem(): AdminProduct {
    return { title: '', college: 'Food', price: '', image: '', colors: '', type: 'necessities' };
  }
}
