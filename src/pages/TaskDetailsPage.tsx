import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { Alert, Button, Card, CardContent, Chip, CircularProgress, Divider, Stack, Typography } from '@mui/material';
import { useMemo, useState } from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { useDeleteTaskMutation, useGetTagsQuery, useGetTaskQuery } from '../store/tasksApi';
import { formatDate, getStatusLabel, getTagName, isTaskOverdue } from '../utils/task';

export function TaskDetailsPage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const { data: task, isLoading, isError } = useGetTaskQuery(id, { skip: !id });
  const { data: tags = [] } = useGetTagsQuery();
  const [deleteTask, { isLoading: isDeleting }] = useDeleteTaskMutation();

  const overdue = useMemo(() => (task ? isTaskOverdue(task) : false), [task]);

  if (isLoading) {
    return (
      <Stack alignItems="center" justifyContent="center" sx={{ py: 8 }}>
        <CircularProgress />
      </Stack>
    );
  }

  if (isError || !task) {
    return <Alert severity="error">Задача не найдена или сервер недоступен.</Alert>;
  }

  return (
    <>
      <Stack spacing={3}>
        <Button component={RouterLink} to="/" startIcon={<ArrowBackRoundedIcon />} sx={{ alignSelf: 'flex-start' }}>
          Назад к списку
        </Button>

        <Card elevation={0} sx={{ border: '1px solid rgba(15, 23, 42, 0.08)' }}>
          <CardContent>
            <Stack spacing={3}>
              <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" gap={2}>
                <Stack spacing={1}>
                  <Typography variant="h4" fontWeight={700}>
                    {task.title}
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    <Chip label={getStatusLabel(task.status)} color="primary" variant="outlined" />
                    <Chip label={task.priority} color="secondary" variant="outlined" />
                    {overdue && <Chip label="Просрочено" color="error" variant="outlined" />}
                  </Stack>
                </Stack>

                <Stack direction="row" spacing={1.5}>
                  <Button component={RouterLink} to={`/task/${task.id}/edit`} variant="outlined" startIcon={<EditRoundedIcon />}>
                    Редактировать
                  </Button>
                  <Button color="error" variant="contained" startIcon={<DeleteOutlineRoundedIcon />} onClick={() => setDialogOpen(true)}>
                    Удалить
                  </Button>
                </Stack>
              </Stack>

              <Divider />

              <Stack spacing={2}>
                <Typography>
                  <strong>Описание:</strong> {task.description || 'Без описания'}
                </Typography>
                <Typography color={overdue ? 'error.main' : 'text.primary'}>
                  <strong>Дедлайн:</strong> {formatDate(task.deadline)}
                </Typography>
                <Typography>
                  <strong>Создано:</strong> {formatDate(task.createdAt)}
                </Typography>
                <Typography>
                  <strong>Обновлено:</strong> {formatDate(task.updatedAt)}
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {task.tags.map((tagId) => (
                    <Chip key={tagId} label={getTagName(tagId, tags)} />
                  ))}
                </Stack>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Stack>

      <ConfirmDialog
        open={dialogOpen}
        title="Удалить задачу?"
        description="Это действие нельзя будет отменить."
        confirmText="Удалить"
        loading={isDeleting}
        onClose={() => setDialogOpen(false)}
        onConfirm={async () => {
          await deleteTask(task.id).unwrap();
          navigate('/');
        }}
      />
    </>
  );
}
