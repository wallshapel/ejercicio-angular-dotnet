import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../../../services/task.service';
import { Task } from '../../../../shared/models';
import { TaskFormComponent } from '../task-form/task-form';
import { TaskListComponent } from '../task-list/task-list';

// Material
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [CommonModule, TaskFormComponent, TaskListComponent, MatProgressBarModule, MatSnackBarModule],
  templateUrl: './task.html',
  styleUrl: './task.css'
})
export class TaskComponent implements OnInit {
  private readonly api = inject(TaskService);
  private readonly snack = inject(MatSnackBar);

  // UI state as signals
  protected readonly tasks = signal<Task[]>([]);
  protected readonly loading = signal<boolean>(false);
  protected readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.load();
  }

  // Loads tasks from backend
  load(): void {
    this.loading.set(true);
    this.error.set(null);

    this.api.list().subscribe({
      next: (items) => this.tasks.set(items),
      error: () => {
        this.error.set('Failed to load tasks.');
        this.snack.open('Failed to load tasks', 'Close', { duration: 3000 });
      },
      complete: () => this.loading.set(false)
    });
  }

  // Handles task creation from the child form
  handleCreate(payload: { title: string }): void {
    this.error.set(null);

    this.api.create({ title: payload.title }).subscribe({
      next: (created) => {
        // Prepend the new task to keep newest first
        this.tasks.update((arr) => [created, ...arr]);
        this.snack.open('Task created', 'Close', { duration: 2500 });
      },
      error: () => {
        this.error.set('Failed to create task.');
        this.snack.open('Failed to create task', 'Close', { duration: 3000 });
      }
    });
  }
}
