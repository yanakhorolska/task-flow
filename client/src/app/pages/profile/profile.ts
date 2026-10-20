import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({ selector: 'app-my-profile', imports: [ReactiveFormsModule, RouterLink], templateUrl: './profile.html', styleUrl: './profile.scss' })
export class MyProfile implements OnInit {
  private auth = inject(AuthService);
  private fb = inject(FormBuilder);
  profile = this.auth.currentUser;
  loading = signal(true);
  saving = signal(false);
  editing = signal(false);
  error = signal('');
  success = signal('');
  age = computed(() => {
    const birthDate = this.profile()?.birthDate;
    if (!birthDate) return null;
    const [year, month, day] = birthDate.split('-').map(Number);
    const now = new Date();
    return now.getFullYear() - year - (now.getMonth() + 1 < month || (now.getMonth() + 1 === month && now.getDate() < day) ? 1 : 0);
  });
  form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    bio: ['', Validators.maxLength(500)],
    avatarUrl: ['', Validators.pattern(/^$|^https?:\/\/\S+$/i)],
    birthDate: [''],
  });
  ngOnInit() { this.refresh(); }
  refresh() {
    this.loading.set(true);
    this.auth.loadProfile().subscribe({
      next: p => { this.loading.set(false); this.form.patchValue({ name: p.name, bio: p.bio ?? '', avatarUrl: p.avatarUrl ?? '', birthDate: p.birthDate ?? '' }); },
      error: () => { this.loading.set(false); this.error.set('Could not load your profile.'); },
    });
  }
  save() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const values = this.form.getRawValue();
    this.saving.set(true); this.error.set(''); this.success.set('');
    this.auth.updateProfile({
      name: values.name,
      bio: values.bio.trim() || null,
      avatarUrl: values.avatarUrl.trim() || null,
      birthDate: values.birthDate || null,
    }).subscribe({
      next: () => { this.saving.set(false); this.editing.set(false); this.success.set('Profile updated.'); },
      error: () => { this.saving.set(false); this.error.set('Could not save changes. Check your photo URL and birth date.'); },
    });
  }
}
