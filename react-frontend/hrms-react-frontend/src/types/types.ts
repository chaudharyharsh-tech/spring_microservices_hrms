// =============================================
// HRMS TypeScript Types
// Mirrors the Spring backend models & DTOs
// =============================================

/** Matches springmvc.model.Employee */
export interface Employee {
  id: number;
  name: string;
  position: string;
  dateOfBirth: string | null;
  dateOfJoining: string | null;
  aadharNumber: string | null;
  esiNo: string | null; // JSON: "esino" from backend (via getESINo)
  esiContribution: number;
}

/** Matches springmvc.dto.DailyAttendanceDTO */
export interface DailyAttendanceDTO {
  date: string; // "YYYY-MM-DD"
  employee: Employee;
  attendance_Status: number; // 1=Present, 2=Absent, 3=Leave
}

/** Attendance status constants matching AttendanceStatuses table */
export const AttendanceStatus = {
  Present: 1,
  Absent: 2,
  Leave: 3,
} as const;

/** Human-readable labels for attendance status */
export const AttendanceStatusLabel: Record<number, string> = {
  [AttendanceStatus.Present]: 'Present',
  [AttendanceStatus.Absent]: 'Absent',
  [AttendanceStatus.Leave]: 'Leave',
};

/** Color variants for attendance status */
export const AttendanceStatusVariant: Record<number, string> = {
  [AttendanceStatus.Present]: 'success',
  [AttendanceStatus.Absent]: 'danger',
  [AttendanceStatus.Leave]: 'warning',
};

/** Position pay bands (monthly base salary in INR) for salary computation */
export const PositionPayBand: Record<string, number> = {
  INTERN: 15000,
  SOFTWARE_ENGINEER: 60000,
  SENIOR_SOFTWARE_ENGINEER: 90000,
  TECHNICAL_LEAD: 120000,
  ENGINEERING_MANAGER: 150000,
  CEO: 300000,
  MANAGER: 80000,
  ANALYST: 50000,
  QA_TESTER: 45000,
  HR_EXECUTIVE: 40000,
  PRODUCT_MANAGER: 100000,
  DATA_ANALYST: 55000,
  SCRUM_MASTER: 85000,
  DEVOPS_ENGINEER: 75000,
  BACKEND_DEVELOPER: 65000,
  FRONTEND_DEVELOPER: 60000,
  DATABASE_ADMIN: 70000,
  SYSTEMS_ANALYST: 65000,
  MARKETING_LEAD: 70000,
  SUPPORT_ENGINEER: 40000,
  CONTENT_WRITER: 35000,
  SALES_EXECUTIVE: 45000,
  OPERATIONS_MANAGER: 85000,
  SECURITY_ANALYST: 70000,
  TECHNICAL_WRITER: 45000,
};

/** Computed salary slip structure */
export interface SalarySlip {
  employee: Employee;
  month: string;
  basePay: number;
  hra: number; // 40% of base
  da: number; // 10% of base
  grossSalary: number;
  esiDeduction: number;
  pfDeduction: number; // 12% of base
  professionalTax: number;
  attendanceDeduction: number;
  totalDeductions: number;
  netSalary: number;
  workingDays: number;
  presentDays: number;
  absentDays: number;
  leaveDays: number;
}
