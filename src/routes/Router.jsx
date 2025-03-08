import { lazy, Suspense } from "react";
import { Navigate, useRoutes } from "react-router-dom";

// Protected Route
import ProtectedRoute from "./ProtectedRoute";

// Layouts
import MainLayout from "../layouts/MainLayout";

// Constants
import { ADMIN_ROLE, USER_ROLE, SUPER_ADMIN_ROLE } from "../constant/constant";

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
const Ticketgenerate = lazy(() => import("../pages/User/Ticketgenerate"));
import Profile from "../pages/Admin/Profile";

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
          path: "dashboard",
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
          path: "ticket-table",
          element: <TicketTable />,
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
          element: <UsersList />,
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
          element: <UsersList />,
        },
        {
          path: "profile",
          element: <Profile />,
        },
        {
          path: "ticket-generate",
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
