import { NavLink } from "react-router-dom";
import { AccountIcon, CartIcon, ExploreIcon, HeartIcon, HomeIcon } from "../icons";
import { useCartStore } from "../../stores/cartStore";

const TABS = [
  { to: "/", label: "Shop", Icon: HomeIcon, end: true },
  { to: "/explore", label: "Explore", Icon: ExploreIcon, end: false },
  { to: "/cart", label: "Cart", Icon: CartIcon, end: false },
  { to: "/favorites", label: "Favourite", Icon: HeartIcon, end: false },
  { to: "/account", label: "Account", Icon: AccountIcon, end: false },
] as const;

export function BottomTabBar() {
  const itemCount = useCartStore((s) => s.lines.reduce((sum, l) => sum + l.quantity, 0));

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-black/5 bg-surface/95 backdrop-blur pb-[env(safe-area-inset-bottom)] lg:hidden"
    >
      <ul className="mx-auto flex max-w-md items-stretch justify-between px-2">
        {TABS.map(({ to, label, Icon, end }) => (
          <li key={to} className="relative flex-1">
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium transition ${
                  isActive ? "text-brand-600" : "text-ink-muted"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className="relative">
                    <Icon className="h-5 w-5" filled={label === "Favourite" && isActive} />
                    {label === "Cart" && itemCount > 0 && (
                      <span className="absolute -right-2 -top-1.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-brand-500 px-1 text-[9px] font-semibold text-white">
                        {itemCount}
                      </span>
                    )}
                  </span>
                  {label}
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
