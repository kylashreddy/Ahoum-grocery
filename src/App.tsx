import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { AppShell } from "./components/layout/AppShell";
import { HomeScreen } from "./screens/HomeScreen";
import { ExploreScreen } from "./screens/ExploreScreen";
import { CategoryScreen } from "./screens/CategoryScreen";
import { ProductDetailScreen } from "./screens/ProductDetailScreen";
import { SearchScreen } from "./screens/SearchScreen";
import { CartScreen } from "./screens/CartScreen";
import { FavoritesScreen } from "./screens/FavoritesScreen";
import { CheckoutScreen } from "./screens/CheckoutScreen";
import { CheckoutSuccessScreen } from "./screens/CheckoutSuccessScreen";
import { CheckoutFailureScreen } from "./screens/CheckoutFailureScreen";
import { AccountScreen } from "./screens/AccountScreen";
import { useCartStore } from "./stores/cartStore";

function App() {
  const reconcile = useCartStore((s) => s.reconcile);

  // Reconciles the persisted cart against live data once per load. See DECISIONS.md #3.
  useEffect(() => {
    reconcile();
  }, [reconcile]);

  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/explore" element={<ExploreScreen />} />
        <Route path="/category/:categoryId" element={<CategoryScreen />} />
        <Route path="/product/:productId" element={<ProductDetailScreen />} />
        <Route path="/search" element={<SearchScreen />} />
        <Route path="/cart" element={<CartScreen />} />
        <Route path="/favorites" element={<FavoritesScreen />} />
        <Route path="/checkout" element={<CheckoutScreen />} />
        <Route path="/checkout/success" element={<CheckoutSuccessScreen />} />
        <Route path="/checkout/failure" element={<CheckoutFailureScreen />} />
        <Route path="/account" element={<AccountScreen />} />
      </Routes>
    </AppShell>
  );
}

export default App;
