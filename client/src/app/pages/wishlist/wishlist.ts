import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SimpleListService, type SimpleListItem } from '../../services/simple-list';

@Component({
  selector: 'app-wishlist-page',
  imports: [FormsModule],
  templateUrl: './wishlist.html',
  styleUrl: './wishlist.scss',
})
export class WishlistPage implements OnInit {
  private service = inject(SimpleListService);
  readonly kind = 'wishlist' as const;
  items = signal<SimpleListItem[]>([]);
  newTitle = '';
  loading = signal(true);
  saving = signal(false);
  error = signal('');
  ngOnInit() { this.refresh(); }
  refresh() {
    this.loading.set(true); this.error.set('');
    this.service.getAll(this.kind).subscribe({
      next: items => { this.items.set(items); this.loading.set(false); },
      error: () => { this.loading.set(false); this.error.set('Could not load items.'); },
    });
  }
  add() {
    const title = this.newTitle.trim();
    if (!title || this.saving()) return;
    this.saving.set(true); this.error.set('');
    this.service.add(this.kind, title).subscribe({
      next: item => { this.items.update(items => [item, ...items]); this.newTitle = ''; this.saving.set(false); },
      error: () => { this.saving.set(false); this.error.set('Could not add item.'); },
    });
  }
  toggle(item: SimpleListItem) {
    this.error.set('');
    this.service.setCompleted(this.kind, item.id, !item.completed).subscribe({
      next: changed => this.items.update(items => items.map(i => i.id === changed.id ? changed : i)),
      error: () => this.error.set('Could not update item.'),
    });
  }
  remove(item: SimpleListItem) {
    this.error.set('');
    this.service.remove(this.kind, item.id).subscribe({
      next: () => this.items.update(items => items.filter(i => i.id !== item.id)),
      error: () => this.error.set('Could not delete item.'),
    });
  }
}
