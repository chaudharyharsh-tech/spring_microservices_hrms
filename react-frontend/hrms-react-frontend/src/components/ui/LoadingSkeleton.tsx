interface LoadingSkeletonProps {
  variant?: 'text' | 'title' | 'avatar' | 'card';
  width?: string;
  height?: string;
  count?: number;
}

export default function LoadingSkeleton({
  variant = 'text',
  width,
  height,
  count = 1,
}: LoadingSkeletonProps) {
  const className = `skeleton skeleton-${variant}`;

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={className}
          style={{
            width: width || undefined,
            height: height || undefined,
          }}
        />
      ))}
    </>
  );
}

/** Full-page skeleton loader for tables */
export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      <div style={{ padding: 'var(--space-4)' }}>
        <div className="skeleton" style={{ height: 40, borderRadius: 'var(--radius-md)' }} />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            gap: 'var(--space-4)',
            padding: 'var(--space-3) var(--space-4)',
            borderTop: '1px solid var(--border-color)',
          }}
        >
          <div className="skeleton skeleton-avatar" />
          <div style={{ flex: 1 }}>
            <div className="skeleton skeleton-text" style={{ width: '40%' }} />
            <div className="skeleton skeleton-text" style={{ width: '25%' }} />
          </div>
          <div className="skeleton" style={{ width: 80, height: 24, borderRadius: 'var(--radius-full)' }} />
        </div>
      ))}
    </div>
  );
}

/** Grid of skeleton stat cards */
export function StatCardSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton skeleton-card" />
      ))}
    </div>
  );
}
