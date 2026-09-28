import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { RouterLink } from '@angular/router';
import { AdminProduct, productStock, readAdminStorage } from '../admin/admin-data';

@Component({
  selector: 'app-admin-available',
  templateUrl: 'admin-available.page.html',
  styleUrls: ['admin-available.page.scss'],
  standalone: true,
  imports: [CommonModule, IonContent, RouterLink],
})
export class AdminAvailablePage implements OnInit {
  products: AdminProduct[] = [];
  stock = productStock;

  ngOnInit(): void {
    this.products = readAdminStorage<AdminProduct[]>('agilaProducts', []);
  }
}
