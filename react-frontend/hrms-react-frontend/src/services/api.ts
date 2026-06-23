import axios from 'axios';
import type { Employee, DailyAttendanceDTO } from '../types/types';

// Axios instance — Vite proxy forwards /api → http://localhost:8080
const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// ─── Employee API ────────────────────────────────────────────
export const employeeApi = {
  getAll: () =>
    api.get<Employee[]>('/employees').then((res) => res.data),

  getById: (id: number) =>
    api.get<Employee>(`/employees/${id}`).then((res) => res.data),

  create: (employee: Partial<Employee>) =>
    api.post('/employees', employee),

  delete: (id: number) =>
    api.delete(`/employees/${id}`),
};

// ─── Attendance API ──────────────────────────────────────────
export const attendanceApi = {
  markAttendance: (id: number, statusId: number, date: string) =>
    api.post('/employees/updateattendance', {
      id,
      status_id: statusId,
      date, // "YYYY-MM-DD"
    }),

  getByDate: (date: string) =>
    api.get<DailyAttendanceDTO[]>('/employees/attendancebydate', {
      // Backend expects @RequestBody on GET — unusual, so we pass as data
      data: { date },
      headers: { 'Content-Type': 'application/json' },
    }).then((res) => res.data),

  getByEmployeeId: (id: number) =>
    api.get<DailyAttendanceDTO[]>(`/employees/attendancebyid/${id}`).then(
      (res) => res.data,
    ),
};

export default api;
