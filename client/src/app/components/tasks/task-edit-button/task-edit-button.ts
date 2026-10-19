import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-task-edit-button',
  imports: [RouterLink],
  templateUrl: './task-edit-button.html',
  styleUrl: './task-edit-button.scss',
})
export class TaskEditButton {
  @Input({ required: true }) taskId!: string;
}
