import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Wallet, Printer } from 'lucide-react';
import { format } from 'date-fns';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { employeeApi, attendanceApi } from '../services/api';
import type { Employee, DailyAttendanceDTO, SalarySlip } from '../types/types';
import { AttendanceStatus, PositionPayBand } from '../types/types';
import PageTransition from '../components/ui/PageTransition';
import { PositionBadge } from '../components/ui/StatusBadge';
import './Salary.css';

/** Compute salary slip for a given employee and their attendance */
function computeSalary(
  emp: Employee,
  attendance: DailyAttendanceDTO[],
  month: string,
): SalarySlip {
  // Look up base pay from position pay bands
  const positionKey = emp.position.toUpperCase().replace(/\s+/g, '_');
  const basePay = PositionPayBand[positionKey] || PositionPayBand[emp.position] || 40000;

  const hra = Math.round(basePay * 0.4);
  const da = Math.round(basePay * 0.1);
  const grossSalary = basePay + hra + da;

  // ESI deduction from employee record
  const esiDeduction = emp.esiContribution || 0;

  // PF deduction: 12% of base
  const pfDeduction = Math.round(basePay * 0.12);

  // Professional tax (flat ₹200/month)
  const professionalTax = 200;

  // Attendance-based deduction
  const workingDays = 22; // assume 22 working days/month
  const presentDays = attendance.filter(
    (a) => a.attendance_Status === AttendanceStatus.Present,
  ).length;
  const absentDays = attendance.filter(
    (a) => a.attendance_Status === AttendanceStatus.Absent,
  ).length;
  const leaveDays = attendance.filter(
    (a) => a.attendance_Status === AttendanceStatus.Leave,
  ).length;

  const dailyRate = Math.round(grossSalary / workingDays);
  const attendanceDeduction = absentDays * dailyRate;

  const totalDeductions = esiDeduction + pfDeduction + professionalTax + attendanceDeduction;
  const netSalary = grossSalary - totalDeductions;

  return {
    employee: emp,
    month,
    basePay,
    hra,
    da,
    grossSalary,
    esiDeduction,
    pfDeduction,
    professionalTax,
    attendanceDeduction,
    totalDeductions,
    netSalary: Math.max(0, netSalary),
    workingDays,
    presentDays,
    absentDays,
    leaveDays,
  };
}

function formatINR(value: number): string {
  return '₹' + value.toLocaleString('en-IN');
}

export default function Salary() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmpId, setSelectedEmpId] = useState<number | null>(null);
  const [attendance, setAttendance] = useState<DailyAttendanceDTO[]>([]);
  const [_loading, setLoading] = useState(true);
  const [selectedMonth] = useState(format(new Date(), 'MMMM yyyy'));

  useEffect(() => {
    async function load() {
      try {
        const emps = await employeeApi.getAll();
        setEmployees(emps);
        if (emps.length > 0) {
          setSelectedEmpId(emps[0].id);
        }
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  useEffect(() => {
    if (selectedEmpId === null) return;
    async function loadAtt() {
      try {
        const att = await attendanceApi.getByEmployeeId(selectedEmpId!);
        setAttendance(att);
      } catch {
        setAttendance([]);
      }
    }
    loadAtt();
  }, [selectedEmpId]);

  const selectedEmp = employees.find((e) => e.id === selectedEmpId) || null;

  const salarySlip = useMemo(() => {
    if (!selectedEmp) return null;
    return computeSalary(selectedEmp, attendance, selectedMonth);
  }, [selectedEmp, attendance, selectedMonth]);

  // Chart: salary comparison across all employees
  const salaryChartData = useMemo(() => {
    return employees.slice(0, 10).map((emp) => {
      const posKey = emp.position.toUpperCase().replace(/\s+/g, '_');
      const base = PositionPayBand[posKey] || PositionPayBand[emp.position] || 40000;
      const gross = base + Math.round(base * 0.4) + Math.round(base * 0.1);
      return {
        name: emp.name.split(' ')[0],
        salary: gross,
      };
    });
  }, [employees]);


  return (
    <PageTransition>
      <div className="page" id="salary-page">
        <div className="page-header">
          <h1 className="page-title">Salary</h1>
          <p className="page-subtitle">
            View computed payslips and salary breakdowns
          </p>
        </div>

        {/* Controls */}
        <div className="salary-controls">
          <div className="form-group">
            <label className="form-label" htmlFor="salary-employee-select">
              Select Employee
            </label>
            <select
              id="salary-employee-select"
              value={selectedEmpId || ''}
              onChange={(e) => setSelectedEmpId(Number(e.target.value))}
            >
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name} (#{emp.id})
                </option>
              ))}
            </select>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 'var(--space-3)' }}>
            <button
              className="btn btn-secondary"
              onClick={() => window.print()}
              id="print-payslip-btn"
            >
              <Printer size={16} />
              Print Payslip
            </button>
          </div>
        </div>

        {/* Payslip Card */}
        {salarySlip && selectedEmp && (
          <motion.div
            className="card payslip-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            id="payslip-card"
          >
            {/* Header */}
            <div className="payslip-header">
              <div>
                <div className="payslip-company text-gradient">HRMS Corp</div>
                <div className="payslip-subtitle">Employee Payslip</div>
              </div>
              <div className="payslip-month">
                <div className="payslip-month-label">Pay Period</div>
                <div className="payslip-month-value">{salarySlip.month}</div>
              </div>
            </div>

            {/* Employee Info */}
            <div className="payslip-employee-info">
              <div className="payslip-info-item">
                <span className="payslip-info-label">Employee Name</span>
                <span className="payslip-info-value">{selectedEmp.name}</span>
              </div>
              <div className="payslip-info-item">
                <span className="payslip-info-label">Employee ID</span>
                <span className="payslip-info-value">#{selectedEmp.id}</span>
              </div>
              <div className="payslip-info-item">
                <span className="payslip-info-label">Position</span>
                <span className="payslip-info-value">
                  <PositionBadge position={selectedEmp.position} />
                </span>
              </div>
              <div className="payslip-info-item">
                <span className="payslip-info-label">Working Days</span>
                <span className="payslip-info-value">{salarySlip.workingDays}</span>
              </div>
              <div className="payslip-info-item">
                <span className="payslip-info-label">Present Days</span>
                <span className="payslip-info-value" style={{ color: 'var(--color-success)' }}>
                  {salarySlip.presentDays}
                </span>
              </div>
              <div className="payslip-info-item">
                <span className="payslip-info-label">Absent Days</span>
                <span className="payslip-info-value" style={{ color: 'var(--color-danger)' }}>
                  {salarySlip.absentDays}
                </span>
              </div>
            </div>

            {/* Earnings / Deductions */}
            <div className="payslip-breakdown">
              {/* Earnings */}
              <div className="payslip-section earnings">
                <h4>Earnings</h4>
                <div className="payslip-line">
                  <span className="payslip-line-label">Base Pay</span>
                  <span className="payslip-line-value">{formatINR(salarySlip.basePay)}</span>
                </div>
                <div className="payslip-line">
                  <span className="payslip-line-label">HRA (40%)</span>
                  <span className="payslip-line-value">{formatINR(salarySlip.hra)}</span>
                </div>
                <div className="payslip-line">
                  <span className="payslip-line-label">DA (10%)</span>
                  <span className="payslip-line-value">{formatINR(salarySlip.da)}</span>
                </div>
                <div className="divider" />
                <div className="payslip-total">
                  <span className="payslip-total-label">Gross Salary</span>
                  <span className="payslip-total-value">{formatINR(salarySlip.grossSalary)}</span>
                </div>
              </div>

              {/* Deductions */}
              <div className="payslip-section deductions">
                <h4>Deductions</h4>
                <div className="payslip-line">
                  <span className="payslip-line-label">ESI Contribution</span>
                  <span className="payslip-line-value">-{formatINR(salarySlip.esiDeduction)}</span>
                </div>
                <div className="payslip-line">
                  <span className="payslip-line-label">PF (12%)</span>
                  <span className="payslip-line-value">-{formatINR(salarySlip.pfDeduction)}</span>
                </div>
                <div className="payslip-line">
                  <span className="payslip-line-label">Professional Tax</span>
                  <span className="payslip-line-value">-{formatINR(salarySlip.professionalTax)}</span>
                </div>
                <div className="payslip-line">
                  <span className="payslip-line-label">
                    Attendance ({salarySlip.absentDays} days)
                  </span>
                  <span className="payslip-line-value">-{formatINR(salarySlip.attendanceDeduction)}</span>
                </div>
                <div className="divider" />
                <div className="payslip-total">
                  <span className="payslip-total-label">Total Deductions</span>
                  <span className="payslip-total-value" style={{ color: 'var(--color-danger)' }}>
                    -{formatINR(salarySlip.totalDeductions)}
                  </span>
                </div>
              </div>
            </div>

            {/* Net Salary */}
            <div className="payslip-net">
              <span className="payslip-net-label">Net Salary</span>
              <span className="payslip-net-value">{formatINR(salarySlip.netSalary)}</span>
            </div>
          </motion.div>
        )}

        {/* Salary Comparison Chart */}
        <motion.div
          className="salary-chart-section"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3>
            <Wallet size={18} style={{ verticalAlign: 'middle', marginRight: 8 }} />
            Gross Salary Comparison
          </h3>
          <div className="card" style={{ padding: 'var(--space-6)' }}>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={salaryChartData}>
                <defs>
                  <linearGradient id="salaryGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.6} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{
                    background: '#1e293b',
                    border: '1px solid rgba(148,163,184,0.1)',
                    borderRadius: 12,
                    color: '#f1f5f9',
                    fontSize: 13,
                  }}
                  formatter={(value) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Gross Salary']}
                />
                <Bar dataKey="salary" fill="url(#salaryGrad)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
}
