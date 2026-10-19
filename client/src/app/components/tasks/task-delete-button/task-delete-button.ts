import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-task-delete-button',
  templateUrl: './task-delete-button.html',
  styleUrl: './task-delete-button.scss',
})
export class TaskDeleteButton {
  @Input({ required: true }) taskId!: string;

  @Output() deleteTask = new EventEmitter<string>();

  onDelete(): void {
    this.deleteTask.emit(this.taskId);
  }
}
