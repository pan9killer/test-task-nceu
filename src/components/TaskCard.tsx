import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import FlagRoundedIcon from '@mui/icons-material/FlagRounded';
import { Box, Card, CardActionArea, CardContent, Chip, MenuItem, Select, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { TASK_STATUS_OPTIONS } from '../constants';
import { usePatchTaskStatusMutation } from '../store/tasksApi';
import type { Tag, Task } from '../types';
import { formatDate, getStatusLabel, getTagName, isTaskOverdue } from '../utils/task';
import styles from './TaskCard.module.css';

type Props = {
  task: Task;
  tags: Tag[];
  onTagClick: (tagId: string) => void;
};

export function TaskCard({ task, tags, onTagClick }: Props) {
  const navigate = useNavigate();
  const [patchTaskStatus, { isLoading }] = usePatchTaskStatusMutation();
  const overdue = isTaskOverdue(task);

  return (
    <Card className={`${styles.card} ${overdue ? styles.overdue : ''}`} elevation={0}>
      <CardActionArea onClick={() => navigate(`/task/${task.id}`)} sx={{ height: '100%' }}>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, height: '100%' }}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={2}>
            <Box>
              <Typography variant="h6" gutterBottom>
                {task.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ minHeight: 42 }}>
                {task.description || 'Без описания'}
              </Typography>
            </Box>

            <Select
              size="small"
              value={task.status}
              disabled={isLoading}
              onClick={(event) => event.stopPropagation()}
              onChange={(event) => {
                event.stopPropagation();
                void patchTaskStatus({ id: task.id, status: event.target.value as Task['status'] });
              }}
              sx={{ minWidth: 145 }}
            >
              {TASK_STATUS_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </Stack>

          <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap" useFlexGap>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <FlagRoundedIcon fontSize="small" color="action" />
              <Typography variant="body2">{task.priority}</Typography>
            </Stack>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <CalendarMonthRoundedIcon fontSize="small" color="action" />
              <Typography variant="body2" color={overdue ? 'error.main' : 'text.primary'}>
                {formatDate(task.deadline)}
              </Typography>
            </Stack>
            {overdue && (
              <Chip label="Просрочено" size="small" color="error" variant="outlined" onClick={(e) => e.stopPropagation()} />
            )}
            <Chip label={getStatusLabel(task.status)} size="small" color="primary" variant="outlined" onClick={(e) => e.stopPropagation()} />
          </Stack>

          <Stack direction="row" gap={1} flexWrap="wrap" useFlexGap sx={{ mt: 'auto' }}>
            {task.tags.map((tagId) => (
              <Chip
                key={tagId}
                label={getTagName(tagId, tags)}
                size="small"
                clickable
                onClick={(event) => {
                  event.stopPropagation();
                  onTagClick(tagId);
                }}
              />
            ))}
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
