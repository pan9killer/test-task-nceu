import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from './shared/AppLayout';
import { TaskDetailsPage } from './pages/TaskDetailsPage';
import { TaskFormPage } from './pages/TaskFormPage';
import { TasksPage } from './pages/TasksPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <TasksPage />,
      },
      {
        path: 'task/new',
        element: <TaskFormPage mode="create" />,
      },
      {
        path: 'task/:id',
        element: <TaskDetailsPage />,
      },
      {
        path: 'task/:id/edit',
        element: <TaskFormPage mode="edit" />,
      },
    ],
  },
]);
