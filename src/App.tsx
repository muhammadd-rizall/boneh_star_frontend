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
import NotificationPage from "@/page/admin/notifications/NotificationPage";
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

function AdminPermissionGuard({ permission, children }: { permission: string; children: React.ReactNode }) {
  const hasPermission = useAuthStore((state) => state.hasPermission);
  if (!hasPermission(permission)) {
    return <Navigate to="/admin/dashboard" replace />;
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
        <Route path="buses" element={<AdminPermissionGuard permission="buses.view"><BusPage /></AdminPermissionGuard>} />
        <Route path="bus-categories" element={<AdminPermissionGuard permission="categories.view"><BusCategoryPage /></AdminPermissionGuard>} />
        <Route path="bus-facilities" element={<AdminPermissionGuard permission="facilities.view"><BusFacilityPage /></AdminPermissionGuard>} />
        <Route path="galleries" element={<AdminPermissionGuard permission="company_profile.view"><GalleryPage /></AdminPermissionGuard>} />
        <Route path="activity-types" element={<AdminPermissionGuard permission="activities.view"><ActivityTypePage /></AdminPermissionGuard>} />
        <Route path="route-types" element={<AdminPermissionGuard permission="routes.view"><RouteTypePage /></AdminPermissionGuard>} />
        <Route path="drivers" element={<AdminPermissionGuard permission="drivers.view"><DriverPage /></AdminPermissionGuard>} />
        <Route path="bookings" element={<AdminPermissionGuard permission="bookings.view"><BookingPage /></AdminPermissionGuard>} />
        <Route path="quotations" element={<AdminPermissionGuard permission="quotations.view"><QuotationPage /></AdminPermissionGuard>} />
        <Route path="transactions" element={<AdminPermissionGuard permission="transactions.view"><TransactionPage /></AdminPermissionGuard>} />
        <Route path="payments" element={<AdminPermissionGuard permission="payments.view"><PaymentPage /></AdminPermissionGuard>} />
        <Route path="payment-methods" element={<AdminPermissionGuard permission="payment_methods.view"><PaymentMethodPage /></AdminPermissionGuard>} />
        <Route path="notifications" element={<NotificationPage />} />
        <Route path="reviews" element={<AdminPermissionGuard permission="reviews.view"><ReviewPage /></AdminPermissionGuard>} />
        <Route path="reports/bookings" element={<AdminPermissionGuard permission="reports.bookings"><BookingReportPage /></AdminPermissionGuard>} />
        <Route path="reports/income" element={<AdminPermissionGuard permission="reports.income"><IncomeReportPage /></AdminPermissionGuard>} />
        <Route path="reports/bus-availability" element={<AdminPermissionGuard permission="buses.view"><BusAvailabilityReportPage /></AdminPermissionGuard>} />
        <Route path="users" element={<AdminPermissionGuard permission="users.view"><UserPage /></AdminPermissionGuard>} />
        <Route path="customers" element={<AdminPermissionGuard permission="customers.view"><CustomerPage /></AdminPermissionGuard>} />
        <Route path="roles" element={<AdminPermissionGuard permission="roles.view"><RolePage /></AdminPermissionGuard>} />
        <Route path="settings" element={<AdminPermissionGuard permission="company_profile.view"><CompanyProfilePage /></AdminPermissionGuard>} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
