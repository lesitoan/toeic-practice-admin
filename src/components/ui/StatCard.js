export default function StatCard({ title, value, change, changeType, icon: Icon }) {
  return (
    <div className="card-block">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <Icon className="h-6 w-6" style={{ color: 'var(--color-primary)' }} />
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium truncate" style={{ color: 'var(--color-text-secondary)' }}>{title}</dt>
            <dd className="text-lg font-medium" style={{ color: 'var(--color-text-primary)' }}>{value}</dd>
          </dl>
        </div>
      </div>
      {change && (
        <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
          <div className="text-sm">
            <span className="font-medium" style={{ 
              color: changeType === 'increase' ? 'var(--color-success)' : 'var(--color-danger)' 
            }}>
              {changeType === 'increase' ? '↗' : '↘'} {change}
            </span>
            <span style={{ color: 'var(--color-text-secondary)' }}> from last month</span>
          </div>
        </div>
      )}
    </div>
  );
} 