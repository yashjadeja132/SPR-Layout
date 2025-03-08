import { lazy, Suspense } from "react";
import { Navigate, useRoutes } from "react-router-dom";

// Protected Route
import ProtectedRoute from "./ProtectedRoute";

// Layouts
import MainLayout from "../layouts/MainLayout";

// Constants
import { ADMIN_ROLE, USER_ROLE, SUPER_ADMIN_ROLE, STAFF_ROLE } from "../constant/constant";

// Common Pages
import LandingPage from "../pages/common/LandingPage";
import NotFound from "../pages/common/NotFound";
import Error from "../pages/common/Error";

// Auth Pages
import SignIn from "../pages/auth/SignIn";
import Singup from "../pages/auth/Singup";

// Lazy-loaded Pages
const UsersList = lazy(() => import("../pages/Admin/UsersList"));
const Dashboard = lazy(() => import("../pages/SuperAdmin/Dashboard"));
const TicketTable = lazy(() => import("../pages/SuperAdmin/TicketTable"));
const LogTable = lazy(() => import("../pages/SuperAdmin/LogTable"));
const AdminTable = lazy(() => import("../pages/SuperAdmin/AdminTable"));
const Ticketgenerate = lazy(() => import("../pages/User/Ticketgenerate"));
import Profile from "../pages/Admin/Profile";
import Staff from "../pages/SuperAdmin/Staff";

// Loader Component
const Loader = () => <div className="loader">Loading...</div>;

const Router = () => {
  const routes = useRoutes([
    {
      path: "/super",
      element: (
        <Suspense fallback={<Loader />}>
          <ProtectedRoute allowedRoles={[SUPER_ADMIN_ROLE]}>
            <MainLayout />
          </ProtectedRoute>
        </Suspense>
      ),
      children: [
        {
          index: true,
          element: <Dashboard />,
        },
        {
          path: "user-table",
          element: <UsersList />,
        },
        {
          path: "log-table",
          element: <LogTable />,
        },
        {
          path: "admin-table",
          element: <AdminTable />,
        },
        {
          path: "profile",
          element: <Profile />,
        },
        {
          path: "staff-member",
          element: <Staff />,
        },
        {
          path: "tickets",
          element: <Ticketgenerate />,
        },
      ],
    },
    {
      path: "/admin",
      element: (
        <Suspense fallback={<Loader />}>
          <ProtectedRoute allowedRoles={[ADMIN_ROLE]}>
            <MainLayout />
          </ProtectedRoute>
        </Suspense>
      ),
      children: [
        {
          index: true,
          element: <Dashboard />,
        },
        {
          path: "user-table",
          element: <UsersList />,
        },
        {
          path: "log-table",
          element: <LogTable />,
        },
        {
          path: "profile",
          element: <Profile />,
        },
        {
          path: "staff-member",
          element: <Staff />,
        },
        {
          path: "tickets",
          element: <Ticketgenerate />,
        },
      ],
    },
    {
      path: "/user",
      element: (
        <Suspense fallback={<Loader />}>
          <ProtectedRoute allowedRoles={[USER_ROLE]}>
            <MainLayout />
          </ProtectedRoute>
        </Suspense>
      ),
      children: [
        {
          index: true,
          element: <Dashboard />,
        },
        {
          path: "profile",
          element: <Profile />,
        },
        {
          path: "tickets",
          element: <Ticketgenerate />,
        },
        {
          path: "notification",
          element: <Ticketgenerate />,
        },
      ],
    },
    {
      path: "/staff",
      element: (
        <Suspense fallback={<Loader />}>
          <ProtectedRoute allowedRoles={[STAFF_ROLE]}>
            <MainLayout />
          </ProtectedRoute>
        </Suspense>
      ),
      children: [
        {
          index: true,
          element: <Dashboard />,
        },
        {
          path: "profile",
          element: <Profile />,
        },
        {
          path: "tickets",
          element: <Ticketgenerate />,
        },
        {
          path: "notification",
          element: <Ticketgenerate />,
        },
      ],
    },
    {
      path: "/sign-in",
      element: <SignIn />,
    },
    {
      path: "/sign-up",
      element: <Singup />,
    },
    {
      path: "/",
      element: <Navigate to="/sign-in" replace />,
    },
    {
      path: "/error",
      element: <Error />,
    },
    {
      path: "*",
      element: <NotFound />,
    },
    {
      path: "/404",
      element: <NotFound />,
    },
  ]);

  return routes;
};

export default Router;
