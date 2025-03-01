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

// Function to Create Role-Based Routes
const createProtectedRoute = (path, role, Component) => ({
  path,
  element: (
    <ProtectedRoute allowedRoles={[role]}>
      <MainLayout />
    </ProtectedRoute>
  ),
  children: [
    {
      index: true,
      element: <Component />,
    },
  ],
});

const Router = () => {
  const routes = useRoutes([
    {
      path: "/admin",
      element: (
        <Suspense fallback={<Loader />}>
          {createProtectedRoute("/admin", ADMIN_ROLE, <UsersList />)}
        </Suspense>
      ),
    },
    {
      path: "/member/:admin",
      element: (
        <Suspense fallback={<Loader />}>
          {createProtectedRoute("/member/:admin", MEMBER_ROLE, <UsersList />)}
        </Suspense>
      ),
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
