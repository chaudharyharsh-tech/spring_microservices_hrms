import { AttendanceStatusLabel, AttendanceStatusVariant } from '../../types/types';

interface StatusBadgeProps {
  status: number; // 1, 2, or 3
}

export function AttendanceBadge({ status }: StatusBadgeProps) {
  const label = AttendanceStatusLabel[status] || 'Unknown';
  const variant = AttendanceStatusVariant[status] || 'info';
  return <span className={`badge badge-${variant}`}>{label}</span>;
}

interface PositionBadgeProps {
  position: string;
}

export function PositionBadge({ position }: PositionBadgeProps) {
  // Format position: "SOFTWARE_ENGINEER" → "Software Engineer"
  const formatted = position
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/\bUi\/ux\b/i, 'UI/UX')
    .replace(/\bCeo\b/i, 'CEO')
    .replace(/\bHr\b/i, 'HR')
    .replace(/\bQa\b/i, 'QA')
    .replace(/\bDevops\b/i, 'DevOps');

  return <span className="badge badge-accent">{formatted}</span>;
}
