export interface Task {
  id: string;
  name: string;
  duration: number;
  status: 'pending' | 'completed' | 'failed';
  actualDuration?: number;
}

export interface TaskState {
  tasks: Task[];
  currentTask: Task | null;
}