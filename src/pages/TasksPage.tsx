import { useMemo, useState } from 'react';
import { Alert, CircularProgress, Grid, Pagination, Stack, Typography } from '@mui/material';
import { TaskCard } from '../components/TaskCard';
import { TaskFilters } from '../components/TaskFilters';
import { useGetTagsQuery, useGetTasksQuery } from '../store/tasksApi';
import type { SortBy, TaskPriority, TaskStatus } from '../types';
import { PAGE_SIZE } from '../utils/task';

export function TasksPage() {
  const { data: tasks = [], isLoading: isTasksLoading, isError: isTasksError } = useGetTasksQuery();
  const { data: tags = [], isLoading: isTagsLoading, isError: isTagsError } = useGetTagsQuery();
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<{
    search: string;
    status: TaskStatus | 'all';
    priority: TaskPriority | 'all';
    tagId: string | 'all';
    sortBy: SortBy;
  }>({
    search: '',
    status: 'all',
    priority: 'all',
    tagId: 'all',
    sortBy: 'createdAt',
  });

  const filteredTasks = useMemo(() => {
    return [...tasks]
      .filter((task) => (filters.status === 'all' ? true : task.status === filters.status))
      .filter((task) => (filters.priority === 'all' ? true : task.priority === filters.priority))
      .filter((task) => (filters.tagId === 'all' ? true : task.tags.includes(filters.tagId)))
      .filter((task) => task.title.toLowerCase().includes(filters.search.toLowerCase().trim()))
      .sort((a, b) => new Date(a[filters.sortBy]).getTime() - new Date(b[filters.sortBy]).getTime());
  }, [filters, tasks]);

  const totalPages = Math.max(1, Math.ceil(filteredTasks.length / PAGE_SIZE));
  const pagedTasks = filteredTasks.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleFilterChange = <K extends keyof typeof filters>(key: K, value: (typeof filters)[K]) => {
    setPage(1);
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  if (isTasksLoading || isTagsLoading) {
    return (
      <Stack alignItems="center" justifyContent="center" sx={{ py: 8 }}>
        <CircularProgress />
      </Stack>
    );
  }

  if (isTasksError || isTagsError) {
    return <Alert severity="error">Не удалось загрузить данные. Проверьте json-server.</Alert>;
  }

  return (
    <Stack spacing={3}>
      <Stack spacing={0.5}>
        <Typography variant="h4" fontWeight={700}>
          Список задач
        </Typography>
        <Typography color="text.secondary">
          Управление задачами, тегами, статусами и дедлайнами в одном интерфейсе.
        </Typography>
      </Stack>

      <TaskFilters
        tags={tags}
        filters={filters}
        onChange={handleFilterChange}
        onReset={() => {
          setPage(1);
          setFilters({
            search: '',
            status: 'all',
            priority: 'all',
            tagId: 'all',
            sortBy: 'createdAt',
          });
        }}
      />

      {pagedTasks.length === 0 ? (
        <Alert severity="info">По текущим фильтрам задачи не найдены.</Alert>
      ) : (
        <Grid container spacing={2.5}>
          {pagedTasks.map((task) => (
            <Grid key={task.id} size={{ xs: 12, md: 6 }}>
              <TaskCard task={task} tags={tags} onTagClick={(tagId) => handleFilterChange('tagId', tagId)} />
            </Grid>
          ))}
        </Grid>
      )}

      <Stack direction="row" justifyContent="space-between" alignItems="center" gap={2}>
        <Typography color="text.secondary">Найдено задач: {filteredTasks.length}</Typography>
        <Pagination page={page} count={totalPages} onChange={(_, value) => setPage(value)} color="primary" />
      </Stack>
    </Stack>
  );
}
