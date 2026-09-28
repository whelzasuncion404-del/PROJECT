import { Component } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about',
  templateUrl: 'about.page.html',
  styleUrls: ['about.page.scss'],
  standalone: true,
  imports: [IonContent, RouterLink],
})
export class AboutPage {}
