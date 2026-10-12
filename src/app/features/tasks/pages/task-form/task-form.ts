import { Component, effect, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { TaskService } from '../../services/task';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './task-form.html',
  styleUrl: './task-form.scss',
})
export class TaskForm {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private taskService = inject(TaskService);

  private taskId = this.route.snapshot.paramMap.get('id');

  isEditMode = this.taskId !== null;

  taskForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: [''],
    status: ['todo', Validators.required],
    priority: ['medium', Validators.required],
    dueDate: ['', Validators.required],
  });

  onSubmit(): void {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    const formValue = this.taskForm.getRawValue();

    if (this.isEditMode && this.taskId) {
      this.taskService.updateTask(Number(this.taskId), {
        id: Number(this.taskId),
        ...formValue,
      } as Task);

      this.router.navigate(['/tasks', this.taskId]);
      return;
    }
    this.taskService.addTask({
      id: Date.now(),
      ...formValue,
    } as Task);
    this.router.navigate(['/tasks']);
    return;
  }
  private fillEditForm = effect(() => {
    if (!this.taskId) {
      return;
    }

    const task = this.taskService.tasks().find((task) => task.id === Number(this.taskId));

    if (!task) {
      return;
    }

    this.taskForm.patchValue({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate,
    });
  });
}
