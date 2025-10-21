export type Task = {
  id: string;
  title: string;
  note?: string;
  completed: boolean;
  createdAt: string;
  scheduledAt?: string | null;
  notificationId?: string | null;
  priority?: "low" | "medium" | "high";
  subtasks?: { id: string; title: string; completed: boolean }[];
  [key: string]: any;
};

export type Change = {
  op: 'create' | 'update' | 'delete';
  id: string;
  payload: any;
  ts: number;
};
