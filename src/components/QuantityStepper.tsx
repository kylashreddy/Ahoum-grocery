interface QuantityStepperProps {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  max?: number;
  size?: "sm" | "md";
  label: string;
}

export function QuantityStepper({ quantity, onIncrement, onDecrement, max, size = "md", label }: QuantityStepperProps) {
  const atMax = max !== undefined && quantity >= max;
  const dim = size === "sm" ? "h-7 w-7 text-sm" : "h-9 w-9 text-base";

  return (
    <div className="inline-flex items-center gap-2" role="group" aria-label={`Quantity for ${label}`}>
      <button
        type="button"
        onClick={onDecrement}
        className={`${dim} flex items-center justify-center rounded-full border border-brand-300 text-brand-700 hover:bg-brand-50 active:scale-95 transition`}
        aria-label={`Decrease quantity of ${label}`}
      >
        &minus;
      </button>
      <span className="min-w-[1.5rem] text-center font-medium tabular-nums" aria-live="polite">
        {quantity}
      </span>
      <button
        type="button"
        onClick={onIncrement}
        disabled={atMax}
        className={`${dim} flex items-center justify-center rounded-full text-white transition active:scale-95 ${
          atMax ? "bg-brand-200 cursor-not-allowed" : "bg-brand-500 hover:bg-brand-600"
        }`}
        aria-label={`Increase quantity of ${label}`}
      >
        +
      </button>
    </div>
  );
}
