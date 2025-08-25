import { Routes } from '@angular/router';
import { TaskComponent } from './features/tasks/task/task';

export const routes: Routes = [
  { path: '', component: TaskComponent },
  { path: '**', redirectTo: '' }
];
