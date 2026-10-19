import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { TaskService } from '../../services/task';
import { TaskStatus, TaskPriority } from '../../models/task.model';
@Component({ selector:'app-task-form', imports:[ReactiveFormsModule,RouterLink],templateUrl:'./task-form.html',styleUrl:'./task-form.scss' })
export class TaskForm implements OnInit {
  private fb=inject(FormBuilder);
  private route=inject(ActivatedRoute);
  private router=inject(Router);
  private tasks=inject(TaskService);
  private taskId=this.route.snapshot.paramMap.get('id');
  isEditMode=this.taskId!==null;
  error=signal('');
  saving=signal(false);
  taskForm=this.fb.nonNullable.group({
    title:['',[Validators.required,Validators.minLength(3)]],
    description:[''],
    status:this.fb.nonNullable.control<TaskStatus>('todo',Validators.required),
    priority:this.fb.nonNullable.control<TaskPriority>('medium',Validators.required),
    dueDate:[''],
  });
  ngOnInit(){
    if(this.taskId) this.tasks.getTaskById(this.taskId).subscribe({
      next:task=>this.taskForm.patchValue({title:task.title,description:task.description??'',status:task.status,priority:task.priority,dueDate:task.dueDate?.slice(0,10)??''}),
      error:()=>this.error.set('Could not load task.'),
    });
  }
  onSubmit(){
    if(this.taskForm.invalid){this.taskForm.markAllAsTouched();return;}
    const values=this.taskForm.getRawValue();
    const data={...values,dueDate:values.dueDate ? new Date(values.dueDate+'T00:00:00.000Z').toISOString() : null};
    this.saving.set(true);this.error.set('');
    const request=this.isEditMode && this.taskId ? this.tasks.updateTask(this.taskId,data) : this.tasks.addTask(data);
    request.subscribe({
      next:task=>{this.saving.set(false);this.router.navigate(['/tasks',task.id]);},
      error:()=>{this.saving.set(false);this.error.set('Could not save task.');},
    });
  }
}
