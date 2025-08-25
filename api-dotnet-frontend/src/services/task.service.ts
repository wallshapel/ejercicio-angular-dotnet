import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../shared/api-tokens';
import { Task, CreateTask } from '../shared/models';

@Injectable({ providedIn: 'root' })
export class TaskService {
  constructor(
    private http: HttpClient,
    @Inject(API_BASE_URL) private readonly baseUrl: string
  ) {}

  list(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.baseUrl}/api/tasks`);
  }

  create(dto: CreateTask): Observable<Task> {
    return this.http.post<Task>(`${this.baseUrl}/api/tasks`, dto);
  }
}
