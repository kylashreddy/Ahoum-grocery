import { Link, NavLink } from "react-router-dom";
import { AccountIcon, CartIcon, ExploreIcon, HeartIcon, HomeIcon, SearchIcon } from "../icons";
import { useCartStore } from "../../stores/cartStore";

const LINKS = [
  { to: "/", label: "Shop", Icon: HomeIcon, end: true },
  { to: "/explore", label: "Explore", Icon: ExploreIcon, end: false },
  { to: "/cart", label: "Cart", Icon: CartIcon, end: false },
  { to: "/favorites", label: "Favourite", Icon: HeartIcon, end: false },
  { to: "/account", label: "Account", Icon: AccountIcon, end: false },
] as const;

// Desktop counterpart to the mobile BottomTabBar. See DESIGN_NOTES.md #1.
export function TopNav() {
  const itemCount = useCartStore((s) => s.lines.reduce((sum, l) => sum + l.quantity, 0));

  return (
    <header className="sticky top-0 z-30 hidden border-b border-black/5 bg-surface/95 backdrop-blur lg:block">
      <div className="mx-auto flex max-w-7xl items-center gap-8 px-8 py-4">
        <Link to="/" className="text-lg font-semibold text-brand-700">
          🥬 Ahoum Grocery
        </Link>

        <Link
          to="/search"
          className="flex flex-1 max-w-md items-center gap-2 rounded-full bg-surface-muted px-4 py-2 text-sm text-ink-muted transition hover:bg-black/[0.06]"
        >
          <SearchIcon className="h-4 w-4" />
          Search for products, brands...
        </Link>

        <nav aria-label="Primary" className="ml-auto">
          <ul className="flex items-center gap-6">
            {LINKS.map(({ to, label, Icon, end }) => (
              <li key={to} className="relative">
                <NavLink
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 text-sm font-medium transition ${
                      isActive ? "text-brand-600" : "text-ink-muted hover:text-ink"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span className="relative">
                        <Icon className="h-4.5 w-4.5" filled={label === "Favourite" && isActive} />
                        {label === "Cart" && itemCount > 0 && (
                          <span className="absolute -right-2 -top-2 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-brand-500 px-1 text-[9px] font-semibold text-white">
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
      </div>
    </header>
  );
}
