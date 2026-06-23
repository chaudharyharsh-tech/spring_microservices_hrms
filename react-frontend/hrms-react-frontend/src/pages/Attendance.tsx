import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  CalendarCheck,
  UserCheck,
  UserX,
  CalendarOff,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { employeeApi, attendanceApi } from '../services/api';
import type { Employee, DailyAttendanceDTO } from '../types/types';
import { AttendanceStatus, AttendanceStatusLabel } from '../types/types';
import PageTransition from '../components/ui/PageTransition';
import { PositionBadge } from '../components/ui/StatusBadge';
import { TableSkeleton } from '../components/ui/LoadingSkeleton';
import './Attendance.css';

const PIE_COLORS = ['#10b981', '#ef4444', '#f59e0b'];

export default function Attendance() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<DailyAttendanceDTO[]>([]);
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), 'yyyy-MM-dd'),
  );
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);

  // Build a map of empId → status for the selected date
  const attendanceMap = new Map<number, number>();
  attendanceRecords.forEach((rec) => {
    attendanceMap.set(rec.employee.id, rec.attendance_Status);
  });

  useEffect(() => {
    loadEmployees();
  }, []);

  useEffect(() => {
    loadAttendance();
  }, [selectedDate]);

  async function loadEmployees() {
    try {
      const data = await employeeApi.getAll();
      setEmployees(data);
    } catch {
      toast.error('Failed to load employees');
    }
  }

  async function loadAttendance() {
    setLoading(true);
    try {
      const data = await attendanceApi.getByDate(selectedDate);
      setAttendanceRecords(data);
    } catch {
      setAttendanceRecords([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(empId: number, newStatus: number) {
    setUpdating(empId);
    try {
      await attendanceApi.markAttendance(empId, newStatus, selectedDate);
      // Update local state
      setAttendanceRecords((prev) => {
        const existing = prev.find((r) => r.employee.id === empId);
        if (existing) {
          return prev.map((r) =>
            r.employee.id === empId ? { ...r, attendance_Status: newStatus } : r,
          );
        } else {
          // New entry
          const emp = employees.find((e) => e.id === empId);
          if (!emp) return prev;
          return [
            ...prev,
            {
              date: selectedDate,
              employee: emp,
              attendance_Status: newStatus,
            },
          ];
        }
      });
      toast.success(
        `Marked ${AttendanceStatusLabel[newStatus]} for #${empId}`,
      );
    } catch {
      toast.error('Failed to update attendance');
    } finally {
      setUpdating(null);
    }
  }

  const presentCount = attendanceRecords.filter((a) => a.attendance_Status === AttendanceStatus.Present).length;
  const absentCount = attendanceRecords.filter((a) => a.attendance_Status === AttendanceStatus.Absent).length;
  const leaveCount = attendanceRecords.filter((a) => a.attendance_Status === AttendanceStatus.Leave).length;

  const pieData = [
    { name: 'Present', value: presentCount || 0 },
    { name: 'Absent', value: absentCount || 0 },
    { name: 'Leave', value: leaveCount || 0 },
  ];

  const getStatusClass = (status: number) => {
    switch (status) {
      case 1: return 'status-select-present';
      case 2: return 'status-select-absent';
      case 3: return 'status-select-leave';
      default: return '';
    }
  };

  const getInitials = (name: string) =>
    name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase();

  return (
    <PageTransition>
      <div className="page" id="attendance-page">
        <div className="page-header">
          <h1 className="page-title">Attendance</h1>
          <p className="page-subtitle">
            Track and manage daily employee attendance
          </p>
        </div>

        {/* Controls */}
        <div className="attendance-controls">
          <div className="attendance-date-picker">
            <CalendarCheck size={18} color="var(--accent-primary)" />
            <label htmlFor="attendance-date">Select Date:</label>
            <input
              type="date"
              id="attendance-date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
        </div>

        {/* Summary Chips */}
        <div className="attendance-summary-row">
          <div className="attendance-summary-chip" style={{ color: 'var(--color-success)' }}>
            <UserCheck size={16} />
            Present: {presentCount}
          </div>
          <div className="attendance-summary-chip" style={{ color: 'var(--color-danger)' }}>
            <UserX size={16} />
            Absent: {absentCount}
          </div>
          <div className="attendance-summary-chip" style={{ color: 'var(--color-warning)' }}>
            <CalendarOff size={16} />
            Leave: {leaveCount}
          </div>
        </div>

        {/* Table + Chart */}
        <div className="attendance-chart-row">
          {/* Attendance Table */}
          {loading ? (
            <TableSkeleton rows={6} />
          ) : (
            <motion.div
              className="table-container card"
              style={{ padding: 0 }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <table>
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Position</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((emp, i) => {
                    const currentStatus = attendanceMap.get(emp.id) || 0;
                    return (
                      <motion.tr
                        key={emp.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.03 * i }}
                      >
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                            <div className="avatar avatar-sm">{getInitials(emp.name)}</div>
                            <div>
                              <div style={{ fontWeight: 600, fontSize: 'var(--font-sm)' }}>{emp.name}</div>
                              <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)', fontFamily: 'monospace' }}>
                                #{emp.id}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <PositionBadge position={emp.position} />
                        </td>
                        <td>
                          <select
                            className={`attendance-status-select ${getStatusClass(currentStatus)}`}
                            value={currentStatus}
                            onChange={(e) =>
                              handleStatusChange(emp.id, Number(e.target.value))
                            }
                            disabled={updating === emp.id}
                            id={`status-select-${emp.id}`}
                          >
                            <option value={0}>— Select —</option>
                            <option value={1}>✓ Present</option>
                            <option value={2}>✕ Absent</option>
                            <option value={3}>◷ Leave</option>
                          </select>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </motion.div>
          )}

          {/* Pie Chart */}
          <motion.div
            className="card"
            style={{ padding: 'var(--space-6)' }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 style={{ fontWeight: 700, marginBottom: 'var(--space-4)' }}>
              Breakdown
            </h3>
            {attendanceRecords.length === 0 ? (
              <div style={{
                textAlign: 'center',
                color: 'var(--text-tertiary)',
                padding: 'var(--space-10) 0',
                fontSize: 'var(--font-sm)',
              }}>
                No data for this date
              </div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      dataKey="value"
                      stroke="none"
                      paddingAngle={3}
                    >
                      {pieData.map((_, idx) => (
                        <Cell key={idx} fill={PIE_COLORS[idx]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: '#1e293b',
                        border: '1px solid rgba(148,163,184,0.1)',
                        borderRadius: 12,
                        color: '#f1f5f9',
                        fontSize: 13,
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--space-3)',
                  marginTop: 'var(--space-3)',
                }}>
                  {pieData.map((entry, idx) => (
                    <div key={entry.name} style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: 'var(--font-sm)',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)' }}>
                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: PIE_COLORS[idx] }} />
                        {entry.name}
                      </div>
                      <span style={{ fontWeight: 700 }}>{entry.value}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
