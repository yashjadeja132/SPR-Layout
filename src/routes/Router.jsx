import { lazy, Suspense } from "react";
import { Navigate, useRoutes } from "react-router-dom";

// Protected Route
import ProtectedRoute from "./ProtectedRoute";

// Layouts
import MainLayout from "../layouts/MainLayout";

// Constants
import { ADMIN_ROLE, MEMBER_ROLE } from "../constant/constant";

// Common Pages
import LandingPage from "../pages/common/LandingPage";
import NotFound from "../pages/common/NotFound";
import Error from "../pages/common/Error";

// Auth Pages
import SignIn from "../pages/auth/SignIn";

// Lazy-loaded Pages
const UsersList = lazy(() => import("../pages/Admin/UsersList"));

// Loader Component
const Loader = () => <div className="loader">Loading...</div>;

const Router = () => {
  const routes = useRoutes([
    {
      path: "/a",
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
      path: "/m/:admin",
      element: (
        <Suspense fallback={<Loader />}>
          <ProtectedRoute allowedRoles={[MEMBER_ROLE]}>
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
      element: <LandingPage />,
    },
    {
      path: "/sign-in",
      element: <SignIn />,
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
