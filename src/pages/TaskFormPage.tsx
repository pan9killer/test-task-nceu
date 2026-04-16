import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import { Alert, Button, CircularProgress, Stack, Typography } from '@mui/material';
import { useMemo, useState } from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import { TaskForm, type TaskFormValues } from '../components/TaskForm';
import { useCreateTagMutation, useCreateTaskMutation, useGetTagsQuery, useGetTaskQuery, useUpdateTaskMutation } from '../store/tasksApi';
import type { Tag, Task } from '../types';

type Props = {
  mode: 'create' | 'edit';
};

export function TaskFormPage({ mode }: Props) {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const [formError, setFormError] = useState<string | null>(null);
  const { data: tags = [], isLoading: tagsLoading, isError: tagsError } = useGetTagsQuery();
  const { data: task, isLoading: taskLoading, isError: taskError } = useGetTaskQuery(id, { skip: mode !== 'edit' || !id });
  const [createTag] = useCreateTagMutation();
  const [createTask, { isLoading: isCreating }] = useCreateTaskMutation();
  const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();

  const isLoading = tagsLoading || (mode === 'edit' && taskLoading);
  const isSubmitting = isCreating || isUpdating;
  const title = useMemo(() => (mode === 'edit' ? 'Редактирование задачи' : 'Создание задачи'), [mode]);

  async function resolveTags(rawTags: TaskFormValues['tags']) {
    const resolvedTags: Tag[] = [];

    for (const rawTag of rawTags) {
      const name = typeof rawTag === 'string' ? rawTag.trim() : rawTag.name.trim();
      if (!name) continue;

      const existing = [...tags, ...resolvedTags].find((tag) => tag.name.toLowerCase() === name.toLowerCase());
      if (existing) {
        resolvedTags.push(existing);
        continue;
      }

      const created = await createTag({ name }).unwrap();
      resolvedTags.push(created);
    }

    return Array.from(new Map(resolvedTags.map((tag) => [tag.id, tag])).values());
  }

  async function handleSubmit(values: TaskFormValues) {
    try {
      setFormError(null);
      const resolvedTags = await resolveTags(values.tags);
      const now = new Date().toISOString();

      if (mode === 'edit' && task) {
        const payload: Task = {
          ...task,
          title: values.title.trim(),
          description: values.description?.trim() || undefined,
          status: values.status,
          priority: values.priority,
          deadline: values.deadline,
          tags: resolvedTags.map((tag) => tag.id),
          updatedAt: now,
        };

        await updateTask({ id: task.id, body: payload }).unwrap();
        navigate(`/task/${task.id}`);
        return;
      }

      const payload: Task = {
        id: crypto.randomUUID(),
        title: values.title.trim(),
        description: values.description?.trim() || undefined,
        status: values.status,
        priority: values.priority,
        deadline: values.deadline,
        tags: resolvedTags.map((tag) => tag.id),
        createdAt: now,
        updatedAt: now,
      };

      const createdTask = await createTask(payload).unwrap();
      navigate(`/task/${createdTask.id}`);
    } catch (error) {
      setFormError('Не удалось сохранить задачу. Проверьте данные и повторите попытку.');
      console.error(error);
    }
  }

  if (isLoading) {
    return (
      <Stack alignItems="center" justifyContent="center" sx={{ py: 8 }}>
        <CircularProgress />
      </Stack>
    );
  }

  if (tagsError || (mode === 'edit' && taskError)) {
    return <Alert severity="error">Не удалось загрузить форму.</Alert>;
  }

  return (
    <Stack spacing={3}>
      <Button component={RouterLink} to={mode === 'edit' && task ? `/task/${task.id}` : '/'} startIcon={<ArrowBackRoundedIcon />} sx={{ alignSelf: 'flex-start' }}>
        Назад
      </Button>

      <Stack spacing={0.5}>
        <Typography variant="h4" fontWeight={700}>
          {title}
        </Typography>
        <Typography color="text.secondary">
          Используются react-hook-form, zod, RTK Query и json-server.
        </Typography>
      </Stack>

      <TaskForm initialTask={task} availableTags={tags} errorMessage={formError} submitting={isSubmitting} onSubmit={handleSubmit} />
    </Stack>
  );
}
