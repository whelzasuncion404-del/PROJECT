import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'chk',
    loadComponent: () => import('./chk/chk.page').then((m) => m.ChkPage),
  },
  {
    path: 'cvm',
    loadComponent: () => import('./cvm/cvm.page').then((m) => m.CvmPage),
  },
  {
    path: 'cpad',
    loadComponent: () => import('./cpad/cpad.page').then((m) => m.CpadPage),
  },
  {
    path: 'com',
    loadComponent: () => import('./com/com.page').then((m) => m.ComPage),
  },
  {
    path: 'col',
    loadComponent: () => import('./col/col.page').then((m) => m.ColPage),
  },
  {
    path: 'coea',
    loadComponent: () => import('./coea/coea.page').then((m) => m.CoeaPage),
  },
  {
    path: 'cnsm',
    loadComponent: () => import('./cnsm/cnsm.page').then((m) => m.CnsmPage),
  },
  {
  path: 'cit',
  loadComponent: () => import('./cit/cit.page').then(m => m.CitPage)
  },
  {
    path: 'about',
    loadComponent: () => import('./about/about.page').then((m) => m.AboutPage),
  },
  {
    path: 'department',
    loadComponent: () => import('./department/department.page').then((m) => m.DepartmentPage),
  },
  {
    path: 'active-records',
    loadComponent: () => import('./active-records/active-records.page').then((m) => m.ActiveRecordsPage),
  },
  {
    path: 'setting',
    loadComponent: () => import('./setting/setting.page').then((m) => m.SettingPage),
  },
  {
    path: 'pricelist',
    loadComponent: () => import('./pricelist/pricelist.page').then(m => m.PricelistPage)
  },
  {
    path: 'admin',
    redirectTo: 'admin/dashboard',
    pathMatch: 'full',
  },
  {
    path: 'admin/dashboard',
    loadComponent: () => import('./admin-dashboard/admin-dashboard.page').then((m) => m.AdminDashboardPage),
  },
  {
    path: 'admin/product',
    loadComponent: () => import('./admin-product/admin-product.page').then((m) => m.AdminProductPage),
  },
  {
    path: 'admin/necessities',
    loadComponent: () => import('./admin-necessities/admin-necessities.page').then((m) => m.AdminNecessitiesPage),
  },
  {
    path: 'admin/available',
    loadComponent: () => import('./admin-available/admin-available.page').then((m) => m.AdminAvailablePage),
  },
  {
    path: 'admin/inventory',
    loadComponent: () => import('./admin-inventory/admin-inventory.page').then((m) => m.AdminInventoryPage),
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.page').then((m) => m.DashboardPage),
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];
