import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../services/auth';
import { TaskService } from '../../../services/task';
@Component({selector:'app-shell',imports:[RouterOutlet,RouterLink,RouterLinkActive],templateUrl:'./app-shell.html',styleUrl:'./app-shell.scss'})
export class AppShell {
  auth=inject(AuthService);
  private tasks=inject(TaskService);
  logout(){this.tasks.clear();this.auth.logout();}
}
