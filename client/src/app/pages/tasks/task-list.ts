import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { TaskCard } from '../../components/tasks/task-card/task-card';
import { TaskService } from '../../services/task';

type TaskStatusFilter = 'all' | 'todo' | 'in-progress' | 'done';
type TaskSort = 'newest' | 'oldest' | 'due-asc' | 'due-desc' | 'priority';

@Component({
  selector: 'app-task-list',
  imports: [TaskCard, RouterLink],
  templateUrl: './task-list.html',
  styleUrl: './task-list.scss',
})
export class TaskList implements OnInit {
  error = signal("");
  ngOnInit() { this.taskService.loadTasks().subscribe({error:()=>this.error.set("Could not load tasks.")}); }
  private taskService = inject(TaskService);

  searchQuery = signal('');

  statusFilter = signal<TaskStatusFilter>('all');
  sortBy = signal<TaskSort>('due-asc');

  filteredTasks = computed(() => {
    const tasks = this.taskService.tasks();
    const query = this.searchQuery().toLowerCase().trim();
    const status = this.statusFilter();
    return tasks.filter((task) => {
      const matchesSearch = task.title.toLowerCase().includes(query);

      const matchesStatus = status === 'all' || task.status === status;

      return matchesSearch && matchesStatus;
    });
  });
  sortedTasks = computed(() => {
    const tasks = this.filteredTasks();
    const sort = this.sortBy();

    if (sort === 'due-asc') {
      return [...tasks].sort(
        (a, b) => (a.dueDate ? new Date(a.dueDate).getTime() : Infinity) - (b.dueDate ? new Date(b.dueDate).getTime() : Infinity),
      );
    }
    if (sort === 'due-desc') {
      return [...tasks].sort(
        (a, b) => (b.dueDate ? new Date(b.dueDate).getTime() : -Infinity) - (a.dueDate ? new Date(a.dueDate).getTime() : -Infinity),
      );
    }
    if (sort === 'priority') {
      const priorityOrder = {
        low: 1,
        medium: 2,
        high: 3,
      };

      return [...tasks].sort((a, b) => {
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      });
    }
    if (sort === 'newest') {
      return [...tasks].sort((a, b) => {
        return Date.parse(b.createdAt) - Date.parse(a.createdAt);
      });
    }

    if (sort === 'oldest') {
      return [...tasks].sort((a, b) => {
        return Date.parse(a.createdAt) - Date.parse(b.createdAt);
      });
    }

    return tasks;
  });

  viewModel = computed(() => {
    const tasks = this.taskService.tasks();
    const sorted = this.sortedTasks();

    return {
      tasks: sorted,
      total: tasks.length,
      todo: tasks.filter((task) => task.status === 'todo').length,
      inProgress: tasks.filter((task) => task.status === 'in-progress').length,
      done: tasks.filter((task) => task.status === 'done').length,
    };
  });

  onSearch(value: string): void {
    this.searchQuery.set(value);
  }
  onStatusChange(status: TaskStatusFilter): void {
    this.statusFilter.set(status);
  }
  onSortChange(value: string): void {
    if (
      value === 'due-asc' ||
      value === 'due-desc' ||
      value === 'priority' ||
      value === 'newest' ||
      value === 'oldest'
    ) {
      this.sortBy.set(value);
    }
  }
}
