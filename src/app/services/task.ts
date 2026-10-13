import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private http = inject(HttpClient);
  private readonly tasksState = signal<Task[]>([]);
  readonly tasks = this.tasksState.asReadonly();

  constructor() {
    this.loadTasks();
  }

  getTaskById(id: number): Task | undefined {
    return this.tasks().find((task) => task.id === id);
  }

  loadTasks(): void {
    this.http.get<Task[]>('/tasks.json').subscribe((tasks) => {
      this.tasksState.set(tasks);
    });
  }

  addTask(newTask: Task): void {
    this.tasksState.update((tasks) => [...tasks, newTask]);
  }

  deleteTask(id: number): void {
    this.tasksState.update((tasks) => tasks.filter((task) => task.id !== id));
  }

  updateTask(id: number, updatedTask: Task): void {
    this.tasksState.update((tasks) =>
      tasks.map((task) => (task.id === id ? { ...task, ...updatedTask } : task)),
    );
  }
}
