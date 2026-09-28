import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, 
  IonButtons, IonBackButton, IonSearchbar, 
  IonList, IonItem, IonLabel, IonNote 
} from '@ionic/angular';

@Component({
  selector: 'app-pricelist',
  templateUrl: './pricelist.page.html',
  styleUrls: ['./pricelist.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonContent, 
    IonButtons, 
    IonBackButton, 
    IonSearchbar, 
    IonList, 
    IonItem, 
    IonLabel, 
    IonNote
  ]
})
export class PricelistPage implements OnInit {
  allItems: any[] = [
    { id: 1, name: 'Bond Paper (A4)', category: 'Supplies', price: 250.00 },
    { id: 2, name: 'Ballpen (Black)', category: 'Office Supplies', price: 15.00 },
    { id: 3, name: 'Folder (Long)', category: 'Supplies', price: 5.00 }
  ];

  filteredItems: any[] = [];
  searchTerm: string = '';

  ngOnInit() {
    this.filteredItems = [...this.allItems];
  }

  filterItems() {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.filteredItems = [...this.allItems];
      return;
    }

    this.filteredItems = this.allItems.filter(item => 
      item.name.toLowerCase().includes(term) || 
      item.category.toLowerCase().includes(term) ||
      item.price.toString().includes(term)
    );
  }
}