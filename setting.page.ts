import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular';
import { RouterLink } from '@angular/router';

interface StoredUser {
  username: string;
  googleEmail: string;
}

interface ProfileSettings {
  displayName: string;
  profilePicture: string;
}

@Component({
  selector: 'app-setting',
  templateUrl: 'setting.page.html',
  styleUrls: ['setting.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonContent, RouterLink],
})
export class SettingPage implements OnInit {
  profileUsername = 'Student account';
  profileEmail = 'Not provided';
  displayName = '';
  profilePicture = '';
  showNotifications = true;

  ngOnInit(): void {
    const users = this.readStorage<StoredUser[]>('agilaUsers', []);
    const currentUser = users[users.length - 1];
    this.profileUsername = currentUser?.username || 'Student account';
    this.profileEmail = currentUser?.googleEmail || 'Not provided';

    const profile = this.readStorage<ProfileSettings>('agilaProfile', {
      displayName: '',
      profilePicture: '',
    });
    this.displayName = profile.displayName || this.profileUsername;
    this.profilePicture = profile.profilePicture;
  }

  goToDashboard(): void {
    window.location.href = '/dashboard';
  }

  logout(): void {
    window.location.href = '/home';
  }

  onProfilePictureSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file || !file.type.startsWith('image/')) {
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      input.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.profilePicture = String(reader.result);
    };
    reader.readAsDataURL(file);
  }

  saveProfile(): void {
    const profile: ProfileSettings = {
      displayName: this.displayName.trim() || this.profileUsername,
      profilePicture: this.profilePicture,
    };

    this.displayName = profile.displayName;
    localStorage.setItem('agilaProfile', JSON.stringify(profile));
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
