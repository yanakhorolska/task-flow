import { Routes } from '@angular/router';

import { AppShell } from './shared/layout/app-shell/app-shell';
import { Login } from './features/auth/pages/login/login';
import { Register } from './features/auth/pages/register/register';
import { TaskList } from './features/tasks/pages/task-list/task-list';
import { TaskDetails } from './features/tasks/pages/task-details/task-details';
import { TaskForm } from './features/tasks/pages/task-form/task-form';

export const routes: Routes = [
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'register',
    component: Register,
  },
  {
    path: '',
    component: AppShell,
    children: [
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
        path: 'tasks/:id/edit',
        component: TaskForm,
      },
      {
        path: '',
        redirectTo: 'tasks',
        pathMatch: 'full',
      },
    ],
  },
];
