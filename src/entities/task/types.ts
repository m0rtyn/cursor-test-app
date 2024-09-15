export interface Task {
  id: string;
  name: string;
  duration: number;
  status: 'pending' | 'completed' | 'failed';
  actualDuration?: number;
  initialDuration?: number;
}

export interface TaskState {
  tasks: Task[];
  currentTask: Task | null;
}