import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskEditButton } from './task-edit-button';

describe('TasEditButton', () => {
  let component: TaskEditButton;
  let fixture: ComponentFixture<TaskEditButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskEditButton],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskEditButton);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
