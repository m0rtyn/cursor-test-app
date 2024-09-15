export interface Task {
  id: string;
  title: string;
  status: 'active' | 'completed' | 'paused';
  actualDuration?: number;
  createdAt: string; // Добавляем поле createdAt
  initialDuration?: number;
}

export interface TaskState {
  tasks: Task[];
  currentTask: Task | null;
}