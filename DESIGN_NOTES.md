# Design notes: mobile → desktop adaptations

The Figma reference is mobile-only. These are the three deliberate adaptations made for desktop, plus the reasoning behind each.

## 1. Bottom tab bar → persistent top nav bar

**Mobile** keeps the Figma's five-item bottom tab bar (Shop / Explore / Cart / Favourite / Account) fixed to the bottom of the viewport, within thumb reach.

**Desktop** moves the same five destinations into a persistent header (`TopNav`) alongside the logo and an always-visible search bar, and drops the bottom bar entirely (`hidden lg:block` / `lg:hidden` split between `TopNav` and `BottomTabBar`).

**Why.** A bottom tab bar is a mobile convention solving a reachability problem that doesn't exist with a mouse — on a wide viewport it just wastes the bottom of the screen and disconnects navigation from the search bar, which is the primary entry point on desktop. Pinning navigation to the top, next to a permanently visible search field, matches how desktop grocery/e-commerce sites are actually used (search-first, nav-second).

## 2. Filters: full-screen modal sheet → always-visible sidebar

**Mobile** presents filters (category screen's "Categories" / "Brand" checkboxes from the Figma Filters screen) as a full-screen sheet triggered by a filter icon, with an explicit "Apply Filter" button to close it — appropriate when screen space is too tight to show filters and results simultaneously.

**Desktop** renders the identical `FiltersPanel` component permanently in a left-hand sidebar (`CategoryScreen`'s `<aside className="hidden ... lg:block">`) next to the product grid, with no modal and no "Apply" step — changes take effect immediately since there's room to see both the controls and their effect at once.

**Why.** The friction of a modal (open → change → apply → close) exists to save space on a small screen. Desktop has the horizontal space to make filters and their effect co-visible, which is strictly better for iteration speed — so keeping the modal there too would be copying a mobile constraint onto a screen that doesn't have it.

## 3. Product grid: 2 columns → 4–5 columns, and cart becomes a two-pane layout

**Mobile** uses a 2-column product grid (matching the Figma's card proportions) and a single stacked column for the cart, with the "Go to Checkout" total pinned as the last element the user scrolls to.

**Desktop** scales the grid up to 4 columns (`lg:grid-cols-4`) and 5 on extra-wide viewports, and restructures the Cart screen into two panes: a scrollable item list on the left and a `sticky` order-summary card (subtotal / delivery / total / checkout button) on the right (`CartScreen`'s `lg:flex-row` layout).

**Why.** Simply stretching a 2-column grid or a stacked cart across a wide viewport produces oversized cards and a checkout button that's easy to lose track of while scrolling through items. A denser grid uses the space the brief explicitly asks for ("product grid of at least 4 columns where space permits"), and a sticky summary pane means the total and checkout action stay in view regardless of how long the cart is — a small but real usability win that a straight mobile-layout stretch wouldn't give.
