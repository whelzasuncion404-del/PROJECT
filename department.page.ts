import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular';
import { RouterLink } from '@angular/router';

interface Department {
  code: string;
  name: string;
}

interface Product {
  title: string;
  college?: string;
  type?: string;
}

@Component({
  selector: 'app-department',
  templateUrl: 'department.page.html',
  styleUrls: ['department.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonContent, RouterLink],
})
export class DepartmentPage implements OnInit {
  searchQuery = '';
  totalProducts = 0;

  readonly departments: Department[] = [
    { code: 'cvm', name: 'College of Veterinary Medicine' },
    { code: 'coea', name: 'College of Engineering and Architecture' },
    { code: 'cpad', name: 'College of Public Administration' },
    { code: 'cnsm', name: 'College of Natural Sciences and Mathematics' },
    { code: 'cics', name: 'College of Information and Computing Sciences' },
    { code: 'cit', name: 'College of Industrial Technology' },
    { code: 'chss', name: 'College of Humanities and Social Sciences' },
    { code: 'com', name: 'College of Medicine' },
    { code: 'col', name: 'College of Law' },
    { code: 'chk', name: 'College of Human Kinetics' },
  ];

  ngOnInit(): void {
    this.totalProducts = this.readStorage<Product[]>('agilaProducts', []).length;
  }

  get filteredDepartments(): Department[] {
    const query = this.searchQuery.trim().toLowerCase();

    if (!query) {
      return this.departments;
    }

    return this.departments.filter((department) =>
      `${department.code} ${department.name}`.toLowerCase().includes(query)
    );
  }

  trackDepartment(_index: number, department: Department): string {
    return department.code;
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