import { Routes } from '@angular/router';

import { AppShell } from './components/layout/app-shell/app-shell';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { TaskList } from './pages/tasks/task-list';
import { TaskDetails } from './pages/task-details/task-details';
import { TaskForm } from './pages/task-form/task-form';
import { CalendarPage } from './pages/calendar/calendar';
import { FocusPage } from './pages/focus/focus';
import { PhonesPage } from './pages/phones/phones';
import { NotesPage } from './pages/notes/notes';
import { GoalsPage } from './pages/goals/goals';
import { WishlistPage } from './pages/wishlist/wishlist';

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
      { path: 'tasks', component: TaskList },
      { path: 'tasks/new', component: TaskForm },
      { path: 'tasks/:id', component: TaskDetails },
      { path: 'tasks/:id/edit', component: TaskForm },
      { path: 'calendar', component: CalendarPage },
      { path: 'focus', component: FocusPage },
      { path: 'phones', component: PhonesPage },
      { path: 'notes', component: NotesPage },
      { path: 'goals', component: GoalsPage },
      { path: 'wishlist', component: WishlistPage },
      { path: '', redirectTo: 'tasks', pathMatch: 'full' },
    ],
  },
];
