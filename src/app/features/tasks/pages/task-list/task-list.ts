import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { map } from 'rxjs';

import { TaskCard } from '../../components/task-card/task-card';
import { TaskService } from '../../services/task';

@Component({
  selector: 'app-task-list',
  imports: [TaskCard, AsyncPipe, RouterLink],
  templateUrl: './task-list.html',
  styleUrl: './task-list.scss',
})
export class TaskList {
  private taskService = inject(TaskService);

  viewModel$ = this.taskService.getTasks().pipe(
    map((tasks) => ({
      tasks,
      total: tasks.length,
      todo: tasks.filter((task) => task.status === 'todo').length,
      inProgress: tasks.filter((task) => task.status === 'in-progress').length,
      done: tasks.filter((task) => task.status === 'done').length,
    })),
  );
}
