import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
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
import { SplashScreen } from "./screens/SplashScreen";
import { OnboardingScreen } from "./screens/OnboardingScreen";
import { PhoneSignInScreen } from "./screens/PhoneSignInScreen";
import { OtpVerificationScreen } from "./screens/OtpVerificationScreen";
import { SelectLocationScreen } from "./screens/SelectLocationScreen";
import { useCartStore } from "./stores/cartStore";
import { useOnboardingStore } from "./stores/onboardingStore";

// Gates "/" only, on a shopper's very first-ever visit — every other route
// (including deep links into this same tour) stays directly reachable.
function HomeGate() {
  const hasOnboarded = useOnboardingStore((s) => s.hasOnboarded);
  if (!hasOnboarded) return <Navigate to="/splash" replace />;
  return <HomeScreen />;
}

function MainApp() {
  const reconcile = useCartStore((s) => s.reconcile);

  // Reconciles the persisted cart against live data once per load. See DECISIONS.md #3.
  useEffect(() => {
    reconcile();
  }, [reconcile]);

  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<HomeGate />} />
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

function App() {
  return (
    <Routes>
      <Route path="/splash" element={<SplashScreen />} />
      <Route path="/onboarding" element={<OnboardingScreen />} />
      <Route path="/login/phone" element={<PhoneSignInScreen />} />
      <Route path="/login/verify" element={<OtpVerificationScreen />} />
      <Route path="/select-location" element={<SelectLocationScreen />} />
      <Route path="/*" element={<MainApp />} />
    </Routes>
  );
}

export default App;
