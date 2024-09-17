export interface Task {
  id: string;
  title: string;
  status: 'active' | 'completed' | 'failed';
  createdAt: string;
  initialDuration: number;
  actualDuration?: number;
}

export interface TaskState {
  tasks: Task[];
  currentTask: Task | null;
}