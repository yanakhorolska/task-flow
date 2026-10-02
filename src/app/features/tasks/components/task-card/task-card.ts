import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-card',
  imports: [RouterLink, DatePipe],
  templateUrl: './task-card.html',
  styleUrl: './task-card.scss',
})
export class TaskCard {
  @Input({ required: true }) task!: Task;

  @Output() deleteTask = new EventEmitter<number>();

  onDelete(): void {
    this.deleteTask.emit(this.task.id);
  }
}
