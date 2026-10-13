import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { TaskCard } from '../../components/tasks/task-card/task-card';
import { TaskService } from '../../services/task';

@Component({
  selector: 'app-task-list',
  imports: [TaskCard, RouterLink],
  templateUrl: './task-list.html',
  styleUrl: './task-list.scss',
})
export class TaskList {
  private taskService = inject(TaskService);

  viewModel = computed(() => {
    const tasks = this.taskService.tasks();

    return {
      tasks,
      total: tasks.length,
      todo: tasks.filter((task) => task.status === 'todo').length,
      inProgress: tasks.filter((task) => task.status === 'in-progress').length,
      done: tasks.filter((task) => task.status === 'done').length,
    };
  });
}
