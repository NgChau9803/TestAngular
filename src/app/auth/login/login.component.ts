// src/app/auth/login/login.component.ts
import { Component } from '@angular/core';
import { 
  FormBuilder, 
  FormGroup, 
  Validators, 
  ReactiveFormsModule 
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  template: `
    <div class="login-container">
      <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
        <h2>Login</h2>
        <div class="form-group">
          <label for="username">Username</label>
          <input 
            type="text" 
            formControlName="username" 
            id="username"
            [class.is-invalid]="submitted && f['username'].errors"
          >
          <div *ngIf="submitted && f['username'].errors" class="invalid-feedback">
            Username is required
          </div>
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input 
            type="password" 
            formControlName="password" 
            id="password"
            [class.is-invalid]="submitted && f['password'].errors"
          >
          <div *ngIf="submitted && f['password'].errors" class="invalid-feedback">
            Password is required
          </div>
        </div>
        <button type="submit">Login</button>
        <p *ngIf="loginError" class="error-message">
          Invalid username or password
        </p>
      </form>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
    }
    form {
      width: 300px;
      padding: 20px;
      border: 1px solid #ccc;
      border-radius: 5px;
    }
    .form-group {
      margin-bottom: 15px;
    }
    input {
      width: 100%;
      padding: 8px;
      margin-top: 5px;
    }
    .is-invalid {
      border: 1px solid red;
    }
    .invalid-feedback {
      color: red;
      font-size: 0.8em;
    }
    .error-message {
      color: red;
      text-align: center;
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  submitted = false;
  loginError = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    const { username, password } = this.loginForm.value;
    this.authService.login(username, password)
      .subscribe(user => {
        if (user) {
          this.router.navigate(['/dashboard']);
        } else {
          this.loginError = true;
        }
      });
  }
}