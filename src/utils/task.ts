import type { Tag, Task, TaskStatus } from '../types';

export const PAGE_SIZE = 6;

export function formatDate(date: string) {
  return new Intl.DateTimeFormat('ru-RU', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
}

export function isTaskOverdue(task: Task) {
  if (task.status === 'done') return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return new Date(task.deadline) < today;
}

export function getTagName(tagId: string, tags: Tag[]) {
  return tags.find((tag) => tag.id === tagId)?.name ?? tagId;
}

export function getStatusLabel(status: TaskStatus) {
  return (
    {
      todo: 'To do',
      inProgress: 'In progress',
      done: 'Done',
    }[status] ?? status
  );
}
