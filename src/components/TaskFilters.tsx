import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import {
  Button,
  Card,
  CardContent,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { TASK_PRIORITY_OPTIONS, TASK_STATUS_OPTIONS } from '../constants';
import type { SortBy, Tag, TaskPriority, TaskStatus } from '../types';

type Filters = {
  search: string;
  status: TaskStatus | 'all';
  priority: TaskPriority | 'all';
  tagId: string | 'all';
  sortBy: SortBy;
};

type Props = {
  filters: Filters;
  tags: Tag[];
  onChange: <K extends keyof Filters>(key: K, value: Filters[K]) => void;
  onReset: () => void;
};

export function TaskFilters({ filters, tags, onChange, onReset }: Props) {
  return (
    <Card elevation={0} sx={{ border: '1px solid rgba(15, 23, 42, 0.08)' }}>
      <CardContent>
        <Stack spacing={2.5}>
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" gap={1}>
            <Typography variant="h6">Фильтрация и поиск</Typography>
            <Button startIcon={<ClearRoundedIcon />} onClick={onReset}>
              Сбросить
            </Button>
          </Stack>

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} useFlexGap flexWrap="wrap">
            <TextField
              label="Поиск по названию"
              value={filters.search}
              onChange={(event) => onChange('search', event.target.value)}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRoundedIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />

            <FormControl sx={{ minWidth: 180 }}>
              <InputLabel id="status-filter-label">Статус</InputLabel>
              <Select
                labelId="status-filter-label"
                label="Статус"
                value={filters.status}
                onChange={(event) => onChange('status', event.target.value as Filters['status'])}
              >
                <MenuItem value="all">Все</MenuItem>
                {TASK_STATUS_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 180 }}>
              <InputLabel id="priority-filter-label">Приоритет</InputLabel>
              <Select
                labelId="priority-filter-label"
                label="Приоритет"
                value={filters.priority}
                onChange={(event) => onChange('priority', event.target.value as Filters['priority'])}
              >
                <MenuItem value="all">Все</MenuItem>
                {TASK_PRIORITY_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 180 }}>
              <InputLabel id="tag-filter-label">Тег</InputLabel>
              <Select
                labelId="tag-filter-label"
                label="Тег"
                value={filters.tagId}
                onChange={(event) => onChange('tagId', event.target.value as Filters['tagId'])}
              >
                <MenuItem value="all">Все</MenuItem>
                {tags.map((tag) => (
                  <MenuItem key={tag.id} value={tag.id}>
                    {tag.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 180 }}>
              <InputLabel id="sort-filter-label">Сортировка</InputLabel>
              <Select
                labelId="sort-filter-label"
                label="Сортировка"
                value={filters.sortBy}
                onChange={(event) => onChange('sortBy', event.target.value as SortBy)}
              >
                <MenuItem value="createdAt">По дате создания</MenuItem>
                <MenuItem value="deadline">По дедлайну</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
