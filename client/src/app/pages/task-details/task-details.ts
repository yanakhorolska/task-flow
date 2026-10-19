import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TaskService } from '../../services/task';
import { Task } from '../../models/task.model';
import { TaskDeleteButton } from '../../components/tasks/task-delete-button/task-delete-button';
import { TaskEditButton } from '../../components/tasks/task-edit-button/task-edit-button';
@Component({selector:'app-task-details',imports:[RouterLink,TaskDeleteButton,TaskEditButton],templateUrl:'./task-details.html',styleUrl:'./task-details.scss'})
export class TaskDetails implements OnInit {
  private route=inject(ActivatedRoute);
  private router=inject(Router);
  private tasks=inject(TaskService);
  private taskId=this.route.snapshot.paramMap.get('id') ?? '';
  task=signal<Task|null>(null);
  isLoading=signal(true);
  error=signal('');
  isDeleteModalOpen=false;
  taskToDeleteId:string|null=null;
  ngOnInit(){this.tasks.getTaskById(this.taskId).subscribe({
    next:t=>{this.task.set(t);this.isLoading.set(false);},
    error:()=>{this.error.set('Task not found');this.isLoading.set(false);},
  });}
  openDeleteModal(id:string){this.taskToDeleteId=id;this.isDeleteModalOpen=true;}
  cancelDelete(){this.isDeleteModalOpen=false;this.taskToDeleteId=null;}
  onDelete(id:string){this.openDeleteModal(id);}
  confirmDelete(){
    if(!this.taskToDeleteId)return;
    this.tasks.deleteTask(this.taskToDeleteId).subscribe({
      next:()=>this.router.navigate(['/tasks']),
      error:()=>this.error.set('Could not delete task.'),
    });
  }
}
