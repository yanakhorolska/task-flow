import { Routes } from '@angular/router';
import { TaskList } from './features/tasks/pages/task-list/task-list';
import { TaskDetails } from './features/tasks/pages/task-details/task-details';
import { TaskForm } from './features/tasks/pages/task-form/task-form';

export const routes: Routes = [
  {
    path: 'tasks',
    component: TaskList,
  },
  {
    path: 'tasks/new',
    component: TaskForm,
  },
  {
    path: 'tasks/:id',
    component: TaskDetails,
  },
  {
    path: '',
    redirectTo: 'tasks',
    pathMatch: 'full',
  },
];
