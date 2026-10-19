import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { Task, TaskUpdate } from '../models/task.model';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/tasks';
  private readonly tasksState = signal<Task[]>([]);
  readonly tasks = this.tasksState.asReadonly();

  loadTasks() {
    return this.http.get<Task[]>(this.apiUrl).pipe(tap(tasks => this.tasksState.set(tasks)));
  }
  getTaskById(id: string) {
    return this.http.get<Task>(`${this.apiUrl}/${id}`);
  }
  addTask(data: TaskUpdate) {
    return this.http.post<Task>(this.apiUrl, data).pipe(
      tap(task => this.tasksState.update(tasks => [...tasks, task])),
    );
  }
  updateTask(id: string, data: Partial<TaskUpdate>) {
    return this.http.patch<Task>(`${this.apiUrl}/${id}`, data).pipe(
      tap(task => this.tasksState.update(tasks => tasks.map(t => t.id === id ? task : t))),
    );
  }
  deleteTask(id: string) {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.tasksState.update(tasks => tasks.filter(t => t.id !== id))),
    );
  }
  clear() { this.tasksState.set([]); }
}
