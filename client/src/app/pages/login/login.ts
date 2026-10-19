import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth';

@Component({ selector: 'app-login', imports: [RouterLink, ReactiveFormsModule], templateUrl: './login.html', styleUrl: './login.scss' })
export class Login {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  loading = signal(false);
  error = signal('');
  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });
  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading.set(true); this.error.set('');
    this.auth.login(this.form.getRawValue()).subscribe({
      next: () => { this.loading.set(false); this.router.navigate(['/profile']); },
      error: () => { this.loading.set(false); this.error.set('Invalid email or password.'); },
    });
  }
}
