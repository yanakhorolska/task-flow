import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth';

@Component({ selector: 'app-register', imports: [RouterLink, ReactiveFormsModule], templateUrl: './register.html', styleUrl: './register.scss' })
export class Register {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  loading = signal(false);
  error = signal('');
  form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/)]],
  });
  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const data = this.form.getRawValue();
    this.loading.set(true); this.error.set('');
    this.auth.register(data).subscribe({
      next: () => this.auth.login({ email: data.email, password: data.password }).subscribe({
        next: () => { this.loading.set(false); this.router.navigate(['/profile']); },
        error: () => { this.loading.set(false); this.router.navigate(['/login']); },
      }),
      error: (err: { status?: number }) => {
        this.loading.set(false);
        this.error.set(err.status === 409 ? 'This email is already registered.' : 'Registration failed. Check your details.');
      },
    });
  }
}
