export interface Task {
  id: number;
  title: string;
  isDone: boolean;
  createdAt: string; // ISO string from backend
}

export interface CreateTask {
  title: string;
}
