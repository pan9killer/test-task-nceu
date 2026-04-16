import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  MenuItem,
} from '@mui/material';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { z } from 'zod';
import { TASK_PRIORITY_OPTIONS, TASK_STATUS_OPTIONS } from '../constants';
import type { Tag, Task, TaskPriority, TaskStatus } from '../types';

const taskSchema = z.object({
  title: z.string().trim().min(5, 'Минимум 5 символов'),
  description: z.string().trim().max(500, 'Максимум 500 символов').optional().or(z.literal('')),
  status: z.enum(['todo', 'inProgress', 'done']),
  priority: z.enum(['low', 'medium', 'high']),
  deadline: z.string().min(1, 'Укажите дедлайн'),
  tags: z.array(z.union([z.string(), z.object({ id: z.string(), name: z.string() })])).min(1, 'Выберите хотя бы один тег'),
});

export type TaskFormValues = z.infer<typeof taskSchema>;

type Props = {
  initialTask?: Task | null;
  availableTags: Tag[];
  errorMessage?: string | null;
  submitting?: boolean;
  onSubmit: (values: TaskFormValues) => Promise<void> | void;
};

function mapTaskToFormValues(task: Task | null | undefined, availableTags: Tag[]): TaskFormValues {
  return {
    title: task?.title ?? '',
    description: task?.description ?? '',
    status: task?.status ?? 'todo',
    priority: task?.priority ?? 'medium',
    deadline: task?.deadline ?? '',
    tags: task?.tags.map((tagId) => availableTags.find((tag) => tag.id === tagId) ?? tagId) ?? [],
  };
}

export function TaskForm({ initialTask, availableTags, errorMessage, submitting = false, onSubmit }: Props) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: mapTaskToFormValues(initialTask, availableTags),
  });

  useEffect(() => {
    reset(mapTaskToFormValues(initialTask, availableTags));
  }, [initialTask, availableTags, reset]);

  return (
    <Card elevation={0} sx={{ border: '1px solid rgba(15, 23, 42, 0.08)' }}>
      <CardContent>
        <Box
          component="form"
          onSubmit={handleSubmit(async (values) => {
            await onSubmit(values);
          })}
        >
          <Stack spacing={3}>
            {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Заголовок"
                  required
                  error={Boolean(errors.title)}
                  helperText={errors.title?.message}
                />
              )}
            />

            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Описание"
                  multiline
                  minRows={4}
                  error={Boolean(errors.description)}
                  helperText={errors.description?.message ?? 'Необязательное поле, максимум 500 символов'}
                />
              )}
            />

            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <TextField {...field} select label="Статус" required error={Boolean(errors.status)} helperText={errors.status?.message}>
                  {TASK_STATUS_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />

            <Controller
              name="priority"
              control={control}
              render={({ field }) => (
                <FormControl error={Boolean(errors.priority)}>
                  <FormLabel>Приоритет</FormLabel>
                  <RadioGroup row {...field}>
                    {TASK_PRIORITY_OPTIONS.map((option) => (
                      <FormControlLabel key={option.value} value={option.value} control={<Radio />} label={option.label} />
                    ))}
                  </RadioGroup>
                </FormControl>
              )}
            />

            <Controller
              name="deadline"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Дедлайн"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  required
                  error={Boolean(errors.deadline)}
                  helperText={errors.deadline?.message}
                />
              )}
            />

            <Controller
              name="tags"
              control={control}
              render={({ field }) => (
                <Autocomplete<Tag | string, true, false, true>
                  multiple
                  freeSolo
                  options={availableTags}
                  value={field.value}
                  onChange={(_, value) => field.onChange(value)}
                  getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                  isOptionEqualToValue={(option, value) => typeof value !== 'string' && option.id === value.id}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        {...getTagProps({ index })}
                        key={typeof option === 'string' ? option : option.id}
                        label={typeof option === 'string' ? option : option.name}
                      />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Теги"
                      placeholder="Выберите или введите новый тег"
                      error={Boolean(errors.tags)}
                      helperText={errors.tags?.message}
                    />
                  )}
                />
              )}
            />

            <Stack direction="row" spacing={1.5}>
              <Button type="submit" variant="contained" startIcon={<SaveRoundedIcon />} disabled={submitting}>
                {initialTask ? 'Сохранить изменения' : 'Создать задачу'}
              </Button>
              <Button type="button" variant="outlined" onClick={() => reset(mapTaskToFormValues(initialTask, availableTags))}>
                Сбросить
              </Button>
            </Stack>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
}
