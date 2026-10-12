import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskDeleteButton } from './task-delete-button';

describe('TaskDeleteButton', () => {
  let component: TaskDeleteButton;
  let fixture: ComponentFixture<TaskDeleteButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskDeleteButton],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskDeleteButton);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
