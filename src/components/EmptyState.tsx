interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
}

export function EmptyState({ icon = "🛒", title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl bg-surface px-6 py-14 text-center" role="status">
      <span className="text-4xl" aria-hidden="true">
        {icon}
      </span>
      <p className="font-medium text-ink">{title}</p>
      {description && <p className="max-w-xs text-sm text-ink-muted">{description}</p>}
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="mt-2 rounded-full bg-brand-500 px-5 py-2 text-sm font-medium text-white transition hover:bg-brand-600"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
