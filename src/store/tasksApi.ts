import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { CreateTaskDto, Tag, Task, UpdateTaskDto } from '../types';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

export const tasksApi = createApi({
  reducerPath: 'tasksApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
  }),
  tagTypes: ['Task', 'Tag'],
  endpoints: (builder) => ({
    getTasks: builder.query<Task[], void>({
      query: () => '/tasks',
      providesTags: (result) =>
        result
          ? [
              ...result.map((task) => ({ type: 'Task' as const, id: task.id })),
              { type: 'Task' as const, id: 'LIST' },
            ]
          : [{ type: 'Task' as const, id: 'LIST' }],
    }),
    getTask: builder.query<Task, string>({
      query: (id) => `/tasks/${id}`,
      providesTags: (_, __, id) => [{ type: 'Task', id }],
    }),
    createTask: builder.mutation<Task, CreateTaskDto>({
      query: (body) => ({
        url: '/tasks',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Task', id: 'LIST' }],
    }),
    updateTask: builder.mutation<Task, { id: string; body: UpdateTaskDto }>({
      query: ({ id, body }) => ({
        url: `/tasks/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_, __, { id }) => [{ type: 'Task', id }, { type: 'Task', id: 'LIST' }],
    }),
    patchTaskStatus: builder.mutation<Task, { id: string; status: Task['status'] }>({
      query: ({ id, status }) => ({
        url: `/tasks/${id}`,
        method: 'PATCH',
        body: { status, updatedAt: new Date().toISOString() },
      }),
      invalidatesTags: (_, __, { id }) => [{ type: 'Task', id }, { type: 'Task', id: 'LIST' }],
    }),
    deleteTask: builder.mutation<void, string>({
      query: (id) => ({
        url: `/tasks/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Task', id: 'LIST' }],
    }),
    getTags: builder.query<Tag[], void>({
      query: () => '/tags',
      providesTags: (result) =>
        result
          ? [
              ...result.map((tag) => ({ type: 'Tag' as const, id: tag.id })),
              { type: 'Tag' as const, id: 'LIST' },
            ]
          : [{ type: 'Tag' as const, id: 'LIST' }],
    }),
    createTag: builder.mutation<Tag, Pick<Tag, 'name'>>({
      query: (body) => ({
        url: '/tags',
        method: 'POST',
        body: {
          id: crypto.randomUUID(),
          ...body,
        },
      }),
      invalidatesTags: [{ type: 'Tag', id: 'LIST' }],
    }),
  }),
});

export const {
  useCreateTagMutation,
  useCreateTaskMutation,
  useDeleteTaskMutation,
  useGetTagsQuery,
  useGetTaskQuery,
  useGetTasksQuery,
  usePatchTaskStatusMutation,
  useUpdateTaskMutation,
} = tasksApi;
