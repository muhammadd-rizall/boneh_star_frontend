import { Routes, Route, Navigate } from "react-router-dom";
import AdminLogin from "@/page/auth/admin/Login";
import DahsbordLayout from "@/layouts/admin/DahsbordLayout";
import { useAuthStore } from "@/store/useAuthStore";
import DashboardPage from "@/page/admin/dashboard/DashboardPage";
import UserPage from "@/page/admin/users/UserPage";
import RolePage from "@/page/admin/roles/RolePage";
import CustomerPage from "@/page/admin/customers/CustomerPage";
import BusCategoryPage from "@/page/admin/bus-categories/BusCategoryPage";
import BusFacilityPage from "@/page/admin/bus-facilities/BusFacilityPage";
import ActivityTypePage from "@/page/admin/activity-types/ActivityTypePage";
import RouteTypePage from "@/page/admin/route-types/RouteTypePage";
import DriverPage from "@/page/admin/drivers/DriverPage";
import BookingPage from "@/page/admin/bookings/BookingPage";
import QuotationPage from "@/page/admin/quotations/QuotationPage";
import TransactionPage from "@/page/admin/transactions/TransactionPage";
import PaymentMethodPage from "@/page/admin/payment-methods/PaymentMethodPage";
import PaymentPage from "@/page/admin/payments/PaymentPage";
import ReviewPage from "@/page/admin/reviews/ReviewPage";
import BookingReportPage from "@/page/admin/reports/BookingReportPage";
import IncomeReportPage from "@/page/admin/reports/IncomeReportPage";
import BusAvailabilityReportPage from "@/page/admin/reports/BusAvailabilityReportPage";
import CompanyProfilePage from "@/page/admin/company-profile/CompanyProfilePage";
import GalleryPage from "@/features/admin/galleries/pages/GalleryPage";
import "./App.css";
import BusPage from "./page/admin/buses/BusPage";
import Home from "@/page/public/home";
import ContactPage from "@/page/public/contact";
import FleetPage from "@/page/public/fleet";
import AboutPage from "@/page/public/about";
import CustomerProfilePage from "@/page/customer/profile";
import BookingIndexPage from "@/page/customer/bookings";
import BookingDetailPage from "@/page/customer/bookings/BookingDetailPage";
import HistoryDetailPage from "@/page/customer/bookings/HistoryDetailPage";
import BookingRequestPage from "@/page/customer/bookings/request";
import ReviewIndexPage from "@/page/customer/reviews";
import NotificationIndexPage from "@/page/customer/notifications";
import LoginPage from "@/page/auth/public/Login";
import RegisterPage from "@/page/auth/public/Register";
import ForgotPasswordPage from "@/page/auth/public/ForgotPassword";
import ResetPasswordPage from "@/page/auth/public/ResetPassword";
import GoogleCallbackPage from "@/page/auth/public/GoogleCallbackPage";
import { useCustomerAuthStore } from "@/features/auth/public";
import Loader from "@/components/feedback/Loader";

function CustomerProtectedRoute({ children }: { children: React.ReactNode }) {
  const isCustomerAuthenticated = useCustomerAuthStore((state) => state.isAuthenticated);
  const hasHydrated = useCustomerAuthStore((state) => state.hasHydrated);

  if (!hasHydrated) {
    return <Loader text="Memuat sesi pelanggan..." />;
  }

  if (!isCustomerAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return <>{children}</>;
}

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isCustomerAuthenticated = useCustomerAuthStore((state) => state.isAuthenticated);
  const hasCustomerHydrated = useCustomerAuthStore((state) => state.hasHydrated);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/armada" element={<FleetPage />} />
      <Route path="/galery" element={<Navigate to="/tentang-kami" replace />} />
      <Route path="/tentang-kami" element={<AboutPage />} />
      <Route
        path="/customer/profile"
        element={
          <CustomerProtectedRoute>
            <CustomerProfilePage />
          </CustomerProtectedRoute>
        }
      />
      <Route
        path="/customer/bookings"
        element={
          <CustomerProtectedRoute>
            <BookingIndexPage />
          </CustomerProtectedRoute>
        }
      />
      <Route
        path="/customer/bookings/request"
        element={
          <CustomerProtectedRoute>
            <BookingRequestPage />
          </CustomerProtectedRoute>
        }
      />
      <Route
        path="/customer/bookings/:id"
        element={
          <CustomerProtectedRoute>
            <BookingDetailPage />
          </CustomerProtectedRoute>
        }
      />
      <Route
        path="/customer/history/:id"
        element={
          <CustomerProtectedRoute>
            <HistoryDetailPage />
          </CustomerProtectedRoute>
        }
      />
      <Route
        path="/customer/reviews"
        element={
          <CustomerProtectedRoute>
            <ReviewIndexPage />
          </CustomerProtectedRoute>
        }
      />
      <Route
        path="/customer/notifications"
        element={
          <CustomerProtectedRoute>
            <NotificationIndexPage />
          </CustomerProtectedRoute>
        }
      />
      <Route
        path="/auth/login"
        element={hasCustomerHydrated ? (isCustomerAuthenticated ? <Navigate to="/" /> : <LoginPage />) : <Loader text="Memuat sesi pelanggan..." />}
      />
      <Route
        path="/auth/register"
        element={hasCustomerHydrated ? (isCustomerAuthenticated ? <Navigate to="/" /> : <RegisterPage />) : <Loader text="Memuat sesi pelanggan..." />}
      />
      <Route
        path="/auth/forgot-password"
        element={hasCustomerHydrated ? (isCustomerAuthenticated ? <Navigate to="/" /> : <ForgotPasswordPage />) : <Loader text="Memuat sesi pelanggan..." />}
      />
      <Route
        path="/auth/reset-password"
        element={hasCustomerHydrated ? (isCustomerAuthenticated ? <Navigate to="/" /> : <ResetPasswordPage />) : <Loader text="Memuat sesi pelanggan..." />}
      />
      <Route
        path="/auth/callback"
        element={<GoogleCallbackPage />}
      />
      <Route
        path="/admin/login"
        element={
          isAuthenticated ? <Navigate to="/admin/dashboard" /> : <AdminLogin />
        }
      />

      <Route
        path="/admin"
        element={
          isAuthenticated ? <DahsbordLayout /> : <Navigate to="/admin/login" />
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="buses" element={<BusPage />} />
        <Route path="bus-categories" element={<BusCategoryPage />} />
        <Route path="bus-facilities" element={<BusFacilityPage />} />
        <Route path="galleries" element={<GalleryPage />} />
        <Route path="activity-types" element={<ActivityTypePage />} />
        <Route path="route-types" element={<RouteTypePage />} />
        <Route path="drivers" element={<DriverPage />} />
        <Route path="bookings" element={<BookingPage />} />
        <Route path="quotations" element={<QuotationPage />} />
        <Route path="transactions" element={<TransactionPage />} />
        <Route path="payments" element={<PaymentPage />} />
        <Route path="payment-methods" element={<PaymentMethodPage />} />
        <Route path="reviews" element={<ReviewPage />} />
        <Route path="reports/bookings" element={<BookingReportPage />} />
        <Route path="reports/income" element={<IncomeReportPage />} />
        <Route path="reports/bus-availability" element={<BusAvailabilityReportPage />} />
        <Route path="users" element={<UserPage />} />
        <Route path="customers" element={<CustomerPage />} />
        <Route path="roles" element={<RolePage />} />
        <Route path="settings" element={<CompanyProfilePage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
