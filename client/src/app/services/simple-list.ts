import { environment } from '../../environments/environment';
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
export interface SimpleListItem {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}
export type SimpleListKind = 'goals' | 'wishlist';
@Injectable({ providedIn: 'root' })
export class SimpleListService {
  private http = inject(HttpClient);
  private url(kind: SimpleListKind) { return `${environment.apiUrl}/${kind}`; }
  getAll(kind: SimpleListKind) { return this.http.get<SimpleListItem[]>(this.url(kind)); }
  add(kind: SimpleListKind, title: string) { return this.http.post<SimpleListItem>(this.url(kind), { title }); }
  setCompleted(kind: SimpleListKind, id: string, completed: boolean) { return this.http.patch<SimpleListItem>(`${this.url(kind)}/${id}`, { completed }); }
  remove(kind: SimpleListKind, id: string) { return this.http.delete<void>(`${this.url(kind)}/${id}`); }
}
