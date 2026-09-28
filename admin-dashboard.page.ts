import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { RouterLink } from '@angular/router';
import { AdminLoginLog, AdminNotice, AdminProduct, AdminUser, readAdminStorage, writeAdminStorage } from '../admin/admin-data';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: 'admin-dashboard.page.html',
  styleUrls: ['admin-dashboard.page.scss'],
  standalone: true,
  imports: [CommonModule, IonContent, RouterLink],
})
export class AdminDashboardPage implements OnInit {
  users: AdminUser[] = [];
  products: AdminProduct[] = [];
  notices: AdminNotice[] = [];
  logs: AdminLoginLog[] = [];

  ngOnInit(): void {
    this.users = readAdminStorage<AdminUser[]>('agilaUsers', []);
    this.products = readAdminStorage<AdminProduct[]>('agilaProducts', []);
    this.notices = readAdminStorage<AdminNotice[]>('agilaNotices', []);
    this.logs = readAdminStorage<AdminLoginLog[]>('agilaLoginLogs', []);
  }

  clearLogs(): void {
    this.logs = [];
    localStorage.removeItem('agilaLoginLogs');
  }

  downloadLogs(): void {
    const blob = new Blob([JSON.stringify(this.logs, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'login_logs.json';
    link.click();
    URL.revokeObjectURL(link.href);
  }

  deleteNotice(index: number): void {
    this.notices = this.notices.filter((_notice, noticeIndex) => noticeIndex !== index);
    writeAdminStorage('agilaNotices', this.notices);
  }

  logout(): void {
    window.location.href = '/home';
  }
}
