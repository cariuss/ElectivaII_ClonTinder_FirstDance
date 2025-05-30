import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LoginRequest } from '../../../shared/models/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.errorMessage = null;
      const loginData: LoginRequest = this.loginForm.value;
      this.authService.login(loginData).subscribe({
        next: (response) => {
          this.authService.setToken(response.data!.token);
          console.log('Inicio de sesión exitoso. Token:', response.data!.token);
          this.router.navigate(['/main/discover']);
        },
        error: (err) => {
          console.error('Error en el inicio de sesión:', err);
          this.errorMessage = err.error?.message || 'Credenciales inválidas. Inténtalo de nuevo.';
        }
      });
    } else {
      this.errorMessage = 'Por favor, introduce tu email y contraseña.';
    }
  }
}
