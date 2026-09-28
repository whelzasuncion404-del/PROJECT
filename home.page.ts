import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type AuthStep = 'choice' | 'google' | 'register' | 'otp' | 'login';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonContent],
})
export class HomePage {
  private readonly adminUsername = 'csucarig';
  private readonly adminPassword = 'Carig@2026';

  @ViewChild('usernameInput') usernameInput?: ElementRef<HTMLInputElement>;

  showSplash = true;
  showLogin = false;
  authStep: AuthStep = 'choice';
  hasError = false;
  errorMessage = 'Invalid Username or Password';
  username = '';
  password = '';
  confirmPassword = '';
  googleEmail = '';
  generatedOtp = '';
  otpInput = '';

  openLogin(): void {
    this.showSplash = false;
    this.showLogin = true;
    this.authStep = 'choice';
    this.hasError = false;
    this.errorMessage = 'Invalid Username or Password';

    setTimeout(() => {
      const loginButton = document.getElementById('loginChoiceBtn');
      loginButton?.focus();
    }, 300);
  }

  chooseLogin(): void {
    this.hasError = false;
    this.authStep = 'login';
    this.username = '';
    this.password = '';

    setTimeout(() => {
      const loginUsernameInput = document.getElementById('username');
      loginUsernameInput?.focus();
    }, 200);
  }

  chooseSignIn(): void {
    this.hasError = false;
    this.authStep = 'google';

    setTimeout(() => {
      const googleButton = document.getElementById('googleSignInBtn');
      googleButton?.focus();
    }, 200);
  }

  continueWithGoogle(): void {
    const email = this.googleEmail.trim();

    if (!email) {
      this.hasError = true;
      this.errorMessage = 'Please enter your Google account email.';
      return;
    }

    if (!/^[^\s@]+@gmail\.com$/i.test(email)) {
      this.hasError = true;
      this.errorMessage = 'Please register with a valid Gmail address.';
      return;
    }

    const existingUsers = this.getStoredUsers();
    const matchedUser = existingUsers.find(
      (savedUser) => savedUser.googleEmail.toLowerCase() === email.toLowerCase()
    );

    if (matchedUser) {
      this.username = matchedUser.username;
      this.password = '';
      this.confirmPassword = '';
      this.hasError = false;
      this.authStep = 'login';

      setTimeout(() => {
        const loginUsernameInput = document.getElementById('username');
        loginUsernameInput?.focus();
      }, 200);

      return;
    }

    this.hasError = false;
    this.authStep = 'register';

    setTimeout(() => {
      const registerUsernameInput = document.getElementById('registerUsername');
      registerUsernameInput?.focus();
    }, 200);
  }

  formatUsername(value: string): string {
    const digits = value.replace(/\D/g, '').slice(0, 7);

    if (digits.length <= 2) {
      return digits;
    }

    return `${digits.slice(0, 2)}-${digits.slice(2, 7)}`;
  }

  register(event: Event): void {
    event.preventDefault();

    const user = this.username.trim();
    const pass = this.password.trim();
    const confirmPass = this.confirmPassword.trim();

    const usernamePattern = /^\d{2}-\d{5}$/;
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z0-9@._-]{6,}$/;

    if (user === this.adminUsername && pass !== this.adminPassword) {
      this.hasError = true;
      this.errorMessage = 'The admin account must use its assigned password.';
      return;
    }

    if (!usernamePattern.test(user) && user !== this.adminUsername) {
      this.hasError = true;
      this.errorMessage = 'Username must be in the format 00-00000.';
      return;
    }

    if (!passwordPattern.test(pass)) {
      this.hasError = true;
      this.errorMessage = 'Password must be at least 6 characters long and include letters and numbers.';
      return;
    }

    if (pass !== confirmPass) {
      this.hasError = true;
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    const existingUsers = this.getStoredUsers();
    const alreadyExists = existingUsers.some((savedUser) => savedUser.username === user);

    if (alreadyExists) {
      this.hasError = true;
      this.errorMessage = 'This username is already taken.';
      return;
    }

    this.generatedOtp = this.createOtp();
    this.simulateGoogleOtpDelivery();
    this.hasError = false;
    this.authStep = 'otp';
    this.otpInput = '';
  }

  verifyOtp(event: Event): void {
    event.preventDefault();

    const enteredOtp = this.otpInput.trim();

    if (enteredOtp !== this.generatedOtp) {
      this.hasError = true;
      this.errorMessage = 'Invalid one-time PIN. Please try again.';
      return;
    }

    const newUser = {
      username: this.username.trim(),
      password: this.password.trim(),
      googleEmail: this.googleEmail.trim(),
      createdAt: new Date().toISOString(),
    };

    const users = this.getStoredUsers();
    users.push(newUser);
    localStorage.setItem('agilaUsers', JSON.stringify(users));

    this.hasError = false;
    this.authStep = 'login';
    this.username = newUser.username;
    this.password = '';
    this.confirmPassword = '';
    this.otpInput = '';
  }

  goBack(event?: Event): void {
    if (event) {
      event.preventDefault();
    }

    this.showLogin = false;
    this.showSplash = true;
    this.hasError = false;
    this.errorMessage = 'Invalid Username or Password';
    this.username = '';
    this.password = '';
    this.confirmPassword = '';
    this.googleEmail = '';
    this.generatedOtp = '';
    this.otpInput = '';
  }

  login(event: Event): void {
    event.preventDefault();

    const user = this.username.trim();
    const pass = this.password.trim();
    const users = this.getStoredUsers();
    const isAdmin = user === this.adminUsername && pass === this.adminPassword;

    const matchedUser = isAdmin || users.some(
      (savedUser) => savedUser.username === user && savedUser.password === pass
    );

    if (!matchedUser) {
      this.hasError = true;
      this.errorMessage = 'Invalid Username or Password';
      return;
    }

    try {
      const storedLogs = JSON.parse(localStorage.getItem('agilaLoginLogs') || '[]');
      const newLog = {
        user,
        type: 'Student / Regular User',
        time: new Date().toLocaleString(),
      };

      storedLogs.unshift(newLog);
      localStorage.setItem('agilaLoginLogs', JSON.stringify(storedLogs));
    } catch (error) {
      console.error('Storage error:', error);
    }

    window.location.href = isAdmin ? '/admin' : '/dashboard';
  }

  private getStoredUsers(): Array<{ username: string; password: string; googleEmail: string; createdAt: string }> {
    try {
      return JSON.parse(localStorage.getItem('agilaUsers') || '[]');
    } catch {
      return [];
    }
  }

  private createOtp(): string {
    const randomValues = new Uint32Array(1);
    crypto.getRandomValues(randomValues);
    return String(100000 + (randomValues[0] % 900000));
  }

  private simulateGoogleOtpDelivery(): void {
    const email = this.googleEmail.trim();
    console.log(`OTP sent to Google account: ${email}`);
    console.log(`Security code: ${this.generatedOtp}`);
  }
}
