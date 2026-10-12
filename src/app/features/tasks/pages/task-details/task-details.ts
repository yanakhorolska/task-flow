import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { TaskService } from '../../services/task';
import { TaskDeleteButton } from '../../components/task-delete-button/task-delete-button';
import { TaskEditButton } from '../../components/task-edit-button/task-edit-button';

@Component({
  selector: 'app-task-details',
  imports: [RouterLink, TaskDeleteButton, TaskEditButton],
  templateUrl: './task-details.html',
  styleUrl: './task-details.scss',
})
export class TaskDetails {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private taskService = inject(TaskService);

  private taskId = Number(this.route.snapshot.paramMap.get('id'));

  task = computed(() => this.taskService.tasks().find((task) => task.id === this.taskId));

  isDeleteModalOpen = false;
  taskToDeleteId: number | null = null;

  openDeleteModal(id: number): void {
    this.taskToDeleteId = id;
    this.isDeleteModalOpen = true;
  }

  confirmDelete(): void {
    if (this.taskToDeleteId === null) {
      return;
    }

    this.taskService.deleteTask(this.taskToDeleteId);

    this.isDeleteModalOpen = false;
    this.taskToDeleteId = null;

    this.router.navigate(['/tasks']);
  }

  cancelDelete(): void {
    this.isDeleteModalOpen = false;
    this.taskToDeleteId = null;
  }

  onDelete(id: number): void {
    this.openDeleteModal(id);
  }
}
