import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs';

import { TaskService } from '../../services/task';

@Component({
  selector: 'app-task-details',
  imports: [AsyncPipe],
  templateUrl: './task-details.html',
  styleUrl: './task-details.scss',
})
export class TaskDetails {
  private route = inject(ActivatedRoute);
  private taskService = inject(TaskService);

  task$ = this.route.paramMap.pipe(
    map((params) => Number(params.get('id'))),

    switchMap((id) => this.taskService.getTask(id)),
  );
}
