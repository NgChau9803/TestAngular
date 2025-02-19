// src/app/auth/register/register.component.ts
import { Component } from '@angular/core';
import { 
  FormBuilder, 
  FormGroup, 
  Validators, 
  ReactiveFormsModule 
} from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PasswordStrengthDirective } from '../../shared/directives/password-strength.directive';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule, 
    CommonModule,
    PasswordStrengthDirective
  ],
  template: `
    <div class="register-container">
      <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
        <h2>Register</h2>
        
        <div class="form-group">
          <label for="username">Username</label>
          <input 
            type="text" 
            formControlName="username" 
            [class.is-invalid]="submitted && f['username'].errors"
          >
          <div *ngIf="submitted && f['username'].errors" class="error-message">
            <small *ngIf="f['username'].errors['required']">Username is required</small>
            <small *ngIf="f['username'].errors['minlength']">Username must be at least 4 characters</small>
          </div>
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input 
            type="email" 
            formControlName="email" 
            [class.is-invalid]="submitted && f['email'].errors"
          >
          <div *ngIf="submitted && f['email'].errors" class="error-message">
            <small *ngIf="f['email'].errors['required']">Email is required</small>
            <small *ngIf="f['email'].errors['email']">Invalid email format</small>
          </div>
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input 
            type="password" 
            formControlName="password" 
            passwordStrength
            [class.is-invalid]="submitted && f['password'].errors"
          >
          <div *ngIf="submitted && f['password'].errors" class="error-message">
            <small *ngIf="f['password'].errors['required']">Password is required</small>
            <small *ngIf="f['password'].errors['passwordStrength']">
              Password must include uppercase, lowercase, number, and special character
            </small>
          </div>
        </div>

        <button type="submit" [disabled]="loading">
          {{ loading ? 'Registering...' : 'Register' }}
        </button>
      </form>
    </div>
  `,
  styles: [`
    .register-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
    }
    .form-group {
      margin-bottom: 15px;
    }
    .error-message {
      color: red;
      font-size: 0.8em;
    }
    .is-invalid {
      border: 1px solid red;
    }
  `]
})
export class RegisterComponent {
  registerForm: FormGroup;
  submitted = false;
  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.registerForm = this.formBuilder.group({
      username: ['', [
        Validators.required, 
        Validators.minLength(4)
      ]],
      email: ['', [
        Validators.required, 
        Validators.email
      ]],
      password: ['', [
        Validators.required,
        this.passwordStrengthValidator
      ]]
    });
  }

  get f() { return this.registerForm.controls; }

  passwordStrengthValidator(control: AbstractControl) {
    const value = control.value;
    
    if (!value) {
      return null;
    }

    const hasNumber = /\d/.test(value);
    const hasUpper = /[A-Z]/.test(value);
    const hasLower = /[a-z]/.test(value);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(value);
    
    const passwordValid = hasNumber && hasUpper && hasLower && hasSpecial && value.length >= 8;
    
    return passwordValid ? null : { 
      passwordStrength: true
    };
  }

  onSubmit() {
    this.submitted = true;

    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
    // Simulate registration process
    setTimeout(() => {
      this.loading = false;
      this.router.navigate(['/login']);
    }, 2000);
  }
}