import { useCartStore } from "../stores/cartStore";
import { CloseIcon } from "./icons";

/**
 * Surfaces what changed when the persisted cart was reconciled against live
 * data on load (engineering challenge B) — items removed, price updates,
 * quantity clamps — instead of silently mutating totals.
 */
export function ReconciliationBanner() {
  const notes = useCartStore((s) => s.lastReconciliation);
  const dismiss = useCartStore((s) => s.dismissReconciliation);

  if (notes.length === 0) return null;

  return (
    <div className="border-b border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900" role="status">
      <div className="mx-auto flex max-w-7xl items-start gap-3">
        <span aria-hidden="true">ℹ️</span>
        <ul className="flex-1 space-y-1">
          {notes.map((note) => (
            <li key={note.productId}>
              <span className="font-medium">{note.productName}:</span> {note.detail}
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss cart update notice"
          className="rounded-full p-1 text-amber-700 hover:bg-amber-100"
        >
          <CloseIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
