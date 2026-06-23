import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number | string;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  index?: number;
}

const variantStyles: Record<string, { bg: string; color: string }> = {
  default: { bg: 'rgba(99, 102, 241, 0.12)', color: '#6366f1' },
  success: { bg: 'rgba(16, 185, 129, 0.12)', color: '#10b981' },
  warning: { bg: 'rgba(245, 158, 11, 0.12)', color: '#f59e0b' },
  danger: { bg: 'rgba(239, 68, 68, 0.12)', color: '#ef4444' },
  info: { bg: 'rgba(59, 130, 246, 0.12)', color: '#3b82f6' },
};

export default function StatCard({ icon: Icon, label, value, variant = 'default', index = 0 }: StatCardProps) {
  const style = variantStyles[variant];

  return (
    <motion.div
      className="card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      style={{ cursor: 'default' }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <p style={{
            fontSize: 'var(--font-sm)',
            color: 'var(--text-secondary)',
            marginBottom: 'var(--space-2)',
            fontWeight: 500,
          }}>
            {label}
          </p>
          <p style={{
            fontSize: 'var(--font-3xl)',
            fontWeight: 800,
            letterSpacing: '-0.025em',
            lineHeight: 1.1,
          }}>
            {value}
          </p>
        </div>
        <div style={{
          width: 48,
          height: 48,
          borderRadius: 'var(--radius-lg)',
          background: style.bg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Icon size={22} color={style.color} />
        </div>
      </div>
    </motion.div>
  );
}
