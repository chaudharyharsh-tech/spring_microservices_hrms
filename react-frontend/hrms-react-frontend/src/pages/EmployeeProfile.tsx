import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  User,
  Briefcase,
  CalendarDays,
  Calendar,
} from 'lucide-react';
import { format } from 'date-fns';
import { employeeApi, attendanceApi } from '../services/api';
import type { Employee, DailyAttendanceDTO } from '../types/types';
import PageTransition from '../components/ui/PageTransition';
import { PositionBadge, AttendanceBadge } from '../components/ui/StatusBadge';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { AttendanceStatus } from '../types/types';
import './EmployeeProfile.css';



export default function EmployeeProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [attendance, setAttendance] = useState<DailyAttendanceDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!id) return;
      try {
        const emp = await employeeApi.getById(Number(id));
        setEmployee(emp);

        try {
          const att = await attendanceApi.getByEmployeeId(Number(id));
          setAttendance(att);
        } catch {
          setAttendance([]);
        }
      } catch {
        setEmployee(null);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();

  // Compute attendance summary for chart
  const presentCount = attendance.filter((a) => a.attendance_Status === AttendanceStatus.Present).length;
  const absentCount = attendance.filter((a) => a.attendance_Status === AttendanceStatus.Absent).length;
  const leaveCount = attendance.filter((a) => a.attendance_Status === AttendanceStatus.Leave).length;

  const chartData = [
    { name: 'Present', value: presentCount, color: '#10b981' },
    { name: 'Absent', value: absentCount, color: '#ef4444' },
    { name: 'Leave', value: leaveCount, color: '#f59e0b' },
  ];

  if (loading) {
    return (
      <PageTransition>
        <div className="page">
          <LoadingSkeleton variant="title" />
          <div style={{ marginTop: 24 }}>
            <LoadingSkeleton variant="card" />
          </div>
        </div>
      </PageTransition>
    );
  }

  if (!employee) {
    return (
      <PageTransition>
        <div className="page">
          <div className="empty-state">
            <User />
            <h3>Employee not found</h3>
            <p>The employee you're looking for doesn't exist.</p>
            <button className="btn btn-primary" onClick={() => navigate('/employees')} style={{ marginTop: 16 }}>
              Back to Employees
            </button>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="page" id="employee-profile-page">
        {/* Back Button */}
        <button
          className="btn btn-ghost profile-back-btn"
          onClick={() => navigate('/employees')}
          id="profile-back-btn"
        >
          <ArrowLeft size={18} />
          Back to Employees
        </button>

        {/* Hero Section */}
        <motion.div
          className="card profile-hero"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="avatar avatar-xl" style={{ position: 'relative', zIndex: 1 }}>
            {getInitials(employee.name)}
          </div>
          <div className="profile-hero-info">
            <div className="profile-hero-name">{employee.name}</div>
            <div className="profile-hero-id">Employee #{employee.id}</div>
            <PositionBadge position={employee.position} />
          </div>
        </motion.div>

        {/* Detail Cards */}
        <div className="profile-details-grid">
          <motion.div
            className="card profile-detail-card"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <h3>
              <User size={18} style={{ color: 'var(--accent-primary)' }} />
              Personal Details
            </h3>
            <div className="profile-detail-list">
              <div className="profile-detail-item">
                <span className="profile-detail-label">Full Name</span>
                <span className="profile-detail-value">{employee.name}</span>
              </div>
              <div className="profile-detail-item">
                <span className="profile-detail-label">Date of Birth</span>
                <span className="profile-detail-value">
                  {employee.dateOfBirth
                    ? format(new Date(employee.dateOfBirth), 'dd MMM yyyy')
                    : '—'}
                </span>
              </div>
              <div className="profile-detail-item">
                <span className="profile-detail-label">Aadhar Number</span>
                <span className="profile-detail-value" style={{ fontFamily: 'monospace' }}>
                  {employee.aadharNumber
                    ? employee.aadharNumber.replace(/(.{4})/g, '$1 ').trim()
                    : '—'}
                </span>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="card profile-detail-card"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <h3>
              <Briefcase size={18} style={{ color: 'var(--accent-secondary)' }} />
              Employment Details
            </h3>
            <div className="profile-detail-list">
              <div className="profile-detail-item">
                <span className="profile-detail-label">Position</span>
                <span className="profile-detail-value">{employee.position}</span>
              </div>
              <div className="profile-detail-item">
                <span className="profile-detail-label">Date of Joining</span>
                <span className="profile-detail-value">
                  {employee.dateOfJoining
                    ? format(new Date(employee.dateOfJoining), 'dd MMM yyyy')
                    : '—'}
                </span>
              </div>
              <div className="profile-detail-item">
                <span className="profile-detail-label">ESI Number</span>
                <span className="profile-detail-value" style={{ fontFamily: 'monospace' }}>
                  {employee.esiNo || '—'}
                </span>
              </div>
              <div className="profile-detail-item">
                <span className="profile-detail-label">ESI Contribution</span>
                <span className="profile-detail-value">₹{employee.esiContribution || 0}</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Attendance Section */}
        <motion.div
          className="profile-attendance-section"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <h3>
            <CalendarDays size={18} style={{ color: 'var(--accent-primary)' }} />
            Attendance Summary
          </h3>

          {/* Chart */}
          {attendance.length > 0 && (
            <div className="card" style={{ marginBottom: 'var(--space-6)', padding: 'var(--space-6)' }}>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartData} barCategoryGap={40}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
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
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {chartData.map((entry, idx) => (
                      <Cell key={idx} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* History List */}
          <h3>
            <Calendar size={18} style={{ color: 'var(--accent-primary)' }} />
            Attendance History
          </h3>
          {attendance.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', color: 'var(--text-tertiary)', padding: 'var(--space-10)' }}>
              No attendance records found
            </div>
          ) : (
            <div className="attendance-history-list">
              {attendance.map((record, i) => (
                <motion.div
                  key={`${record.date}-${i}`}
                  className="attendance-history-item"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.02 * i }}
                >
                  <span className="attendance-history-date">
                    {format(new Date(record.date), 'EEE, dd MMM yyyy')}
                  </span>
                  <AttendanceBadge status={record.attendance_Status} />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </PageTransition>
  );
}
