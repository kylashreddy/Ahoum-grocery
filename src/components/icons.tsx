import type { SVGProps } from "react";

export type IconProps = SVGProps<SVGSVGElement> & { filled?: boolean };

function base(props: SVGProps<SVGSVGElement>) {
  return { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, viewBox: "0 0 24 24", ...props };
}

export function HomeIcon({ filled: _filled, ...props }: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5" />
    </svg>
  );
}

export function ExploreIcon({ filled: _filled, ...props }: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}

export function CartIcon({ filled: _filled, ...props }: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="9" cy="20" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="18" cy="20" r="1.4" fill="currentColor" stroke="none" />
      <path d="M2.5 3h2l2.2 11.4a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 2-1.6L21 7H6" />
    </svg>
  );
}

export function HeartIcon({ filled, ...props }: IconProps) {
  return (
    <svg {...base(props)} fill={filled ? "currentColor" : "none"}>
      <path d="M12 20.5s-7.5-4.6-9.8-9.2C.7 7.8 2.4 4.5 5.7 4.5c2 0 3.4 1.1 4.3 2.5.4.6.9.6 1.3 0 .9-1.4 2.3-2.5 4.3-2.5 3.3 0 5 3.3 3.5 6.8-2.3 4.6-9.8 9.2-9.8 9.2Z" />
    </svg>
  );
}

export function AccountIcon({ filled: _filled, ...props }: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M4.5 20c1.4-3.6 4.3-5.5 7.5-5.5S18.1 16.4 19.5 20" />
    </svg>
  );
}

export function SearchIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base(props)}>
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

export function BackIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base(props)}>
      <path d="M15 5 8 12l7 7" />
    </svg>
  );
}

export function CloseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base(props)}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function FilterIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base(props)}>
      <path d="M4 6h16M7 12h10M10 18h4" />
    </svg>
  );
}

export function TrashIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base(props)}>
      <path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m-8 0 1 13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1l1-13" />
    </svg>
  );
}
