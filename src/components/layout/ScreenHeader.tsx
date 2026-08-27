import { useNavigate } from "react-router-dom";
import { BackIcon } from "../icons";

interface ScreenHeaderProps {
  title: string;
  right?: React.ReactNode;
}

export function ScreenHeader({ title, right }: ScreenHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-black/5 bg-surface/95 px-4 py-3.5 backdrop-blur lg:hidden">
      <button
        type="button"
        onClick={() => navigate(-1)}
        aria-label="Go back"
        className="flex h-9 w-9 items-center justify-center rounded-full text-ink hover:bg-black/5"
      >
        <BackIcon className="h-5 w-5" />
      </button>
      <h1 className="flex-1 text-base font-semibold text-ink">{title}</h1>
      {right}
    </header>
  );
}
