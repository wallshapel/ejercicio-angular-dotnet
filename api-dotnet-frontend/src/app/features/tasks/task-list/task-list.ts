import { Component, Input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { Task } from '../../../../shared/models';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, DatePipe],
  templateUrl: './task-list.html',
  styleUrl: './task-list.css'
})
export class TaskListComponent {
  @Input() tasks: Task[] = [];

  // Desktop columns; some will be hidden on mobile via CSS
  protected readonly displayedColumns = ['title', 'createdAt', 'isDone'];
}
