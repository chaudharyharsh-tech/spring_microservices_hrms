import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users,
  UserCheck,
  UserX,
  CalendarOff,
  TrendingUp,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { employeeApi, attendanceApi } from '../services/api';
import type { Employee, DailyAttendanceDTO } from '../types/types';
import { AttendanceStatus } from '../types/types';
import PageTransition from '../components/ui/PageTransition';
import StatCard from '../components/ui/StatCard';
import { PositionBadge } from '../components/ui/StatusBadge';
import { StatCardSkeleton } from '../components/ui/LoadingSkeleton';
import './Dashboard.css';

const PIE_COLORS = ['#10b981', '#ef4444', '#f59e0b'];

export default function Dashboard() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [attendance, setAttendance] = useState<DailyAttendanceDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const emps = await employeeApi.getAll();
        setEmployees(emps);

        // Try loading today's attendance
        try {
          const today = new Date().toISOString().split('T')[0];
          const att = await attendanceApi.getByDate(today);
          setAttendance(att);
        } catch {
          // No attendance data for today — that's fine
          setAttendance([]);
        }
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const presentCount = attendance.filter(
    (a) => a.attendance_Status === AttendanceStatus.Present,
  ).length;
  const absentCount = attendance.filter(
    (a) => a.attendance_Status === AttendanceStatus.Absent,
  ).length;
  const leaveCount = attendance.filter(
    (a) => a.attendance_Status === AttendanceStatus.Leave,
  ).length;

  // Pie chart data
  const pieData = [
    { name: 'Present', value: presentCount || 1 },
    { name: 'Absent', value: absentCount || 0 },
    { name: 'Leave', value: leaveCount || 0 },
  ];

  // Mock weekly trend for area chart (based on employee count)
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const trendData = weekDays.map((day) => ({
    day,
    present: Math.max(0, employees.length - Math.floor(Math.random() * 5)),
    absent: Math.floor(Math.random() * 4),
  }));

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();

  return (
    <PageTransition>
      <div className="page" id="dashboard-page">
        <div className="page-header">
          <h1 className="page-title">
            Dashboard
          </h1>
          <p className="page-subtitle">
            Welcome back — here's what's happening today
          </p>
        </div>

        {/* Stat Cards */}
        {loading ? (
          <StatCardSkeleton />
        ) : (
          <div className="grid grid-4">
            <StatCard
              icon={Users}
              label="Total Employees"
              value={employees.length}
              variant="default"
              index={0}
            />
            <StatCard
              icon={UserCheck}
              label="Present Today"
              value={presentCount}
              variant="success"
              index={1}
            />
            <StatCard
              icon={UserX}
              label="Absent Today"
              value={absentCount}
              variant="danger"
              index={2}
            />
            <StatCard
              icon={CalendarOff}
              label="On Leave"
              value={leaveCount}
              variant="warning"
              index={3}
            />
          </div>
        )}

        {/* Charts Row */}
        <div className="dashboard-grid-top" style={{ marginTop: 'var(--space-6)' }}>
          {/* Attendance Trend */}
          <motion.div
            className="card dashboard-chart-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3>
              <TrendingUp size={18} style={{ verticalAlign: 'middle', marginRight: 8 }} />
              Weekly Attendance Trend
            </h3>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="gradPresent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" />
                <XAxis dataKey="day" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    background: '#1e293b',
                    border: '1px solid rgba(148,163,184,0.1)',
                    borderRadius: 12,
                    color: '#f1f5f9',
                    fontSize: 13,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="present"
                  stroke="#6366f1"
                  fill="url(#gradPresent)"
                  strokeWidth={2}
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Attendance Breakdown Pie */}
          <motion.div
            className="card dashboard-chart-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3>Today's Breakdown</h3>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
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
            </div>
            {/* Legend */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-6)', marginTop: 'var(--space-2)' }}>
              {pieData.map((entry, idx) => (
                <div key={entry.name} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 'var(--font-sm)', color: 'var(--text-secondary)' }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: PIE_COLORS[idx] }} />
                  {entry.name}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Recent Employees */}
        <motion.div
          className="dashboard-recent"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3>Recent Employees</h3>
          <div className="grid grid-4">
            {employees.slice(0, 8).map((emp, i) => (
              <motion.div
                key={emp.id}
                className="employee-mini-card"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.05 }}
                onClick={() => navigate(`/employees/${emp.id}`)}
              >
                <div className="avatar avatar-md">{getInitials(emp.name)}</div>
                <div className="employee-mini-info">
                  <div className="employee-mini-name truncate">{emp.name}</div>
                  <div className="employee-mini-position">
                    <PositionBadge position={emp.position} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
}
