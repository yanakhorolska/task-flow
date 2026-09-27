import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, tap } from 'rxjs';

import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private http = inject(HttpClient);

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>('/tasks.json').pipe(
      tap((tasks) => console.log('Loaded tasks:', tasks)),

      map((tasks) => [...tasks].sort((a, b) => a.title.localeCompare(b.title))),

      catchError((error) => {
        console.error('Failed to load tasks:', error);

        return of([]);
      }),
    );
  }
  getTask(id: number): Observable<Task | undefined> {
    return this.getTasks().pipe(map((tasks) => tasks.find((task) => task.id === id)));
  }
}
