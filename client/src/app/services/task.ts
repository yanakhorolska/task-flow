import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Task, TaskUpdate } from '../models/task.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private http = inject(HttpClient);
  private readonly tasksState = signal<Task[]>([]);
  readonly tasks = this.tasksState.asReadonly();
  // private readonly storageKey = 'taskflow-tasks';
  // private saveTasks(): void {
  //   const tasks = this.tasksState();
  //   localStorage.setItem(this.storageKey, JSON.stringify(tasks));
  // }

  // private loadSavedTasks(): string | null {
  //   return localStorage.getItem(this.storageKey);
  // }
  // private parseSavedTasks(saved: string): unknown {
  //   try {
  //     return JSON.parse(saved);
  //   } catch (error) {
  //     console.error('Failed to parse saved tasks', error);
  //     return null;
  //   }
  // }

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

  updateTask(id: number, updatedTask: TaskUpdate): void {
    this.tasksState.update((tasks) =>
      tasks.map((task) =>
        task.id === id
          ? {
              ...task,
              title: updatedTask.title,
              description: updatedTask.description,
              status: updatedTask.status,
              priority: updatedTask.priority,
              dueDate: updatedTask.dueDate,
            }
          : task,
      ),
    );
  }
}
// description: string;
// status: TaskStatus;
// priority: TaskPriority;
// dueDate: string;
// createdAt: string;
