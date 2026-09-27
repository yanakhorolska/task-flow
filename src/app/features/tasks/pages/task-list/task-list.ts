import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { TaskCard } from '../../components/task-card/task-card';
import { TaskService } from '../../services/task';

@Component({
  selector: 'app-task-list',
  imports: [TaskCard, AsyncPipe],
  templateUrl: './task-list.html',
  styleUrl: './task-list.scss',
})
export class TaskList {
  private taskService = inject(TaskService);

  tasks$ = this.taskService.getTasks();
}
