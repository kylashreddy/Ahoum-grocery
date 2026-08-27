interface ErrorStateProps {
  message?: string;
  onRetry: () => void;
}

export function ErrorState({ message = "Something went wrong while loading this.", onRetry }: ErrorStateProps) {
  return (
    <div
      className="flex flex-col items-center gap-3 rounded-2xl bg-danger-bg px-6 py-14 text-center"
      role="alert"
    >
      <span className="text-4xl" aria-hidden="true">
        ⚠️
      </span>
      <p className="font-medium text-ink">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-2 rounded-full bg-danger px-5 py-2 text-sm font-medium text-white transition hover:opacity-90"
      >
        Try again
      </button>
    </div>
  );
}
