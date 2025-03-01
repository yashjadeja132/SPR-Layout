import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useVerifyAuthTokenQuery } from "../store/apiSlices/authApiSlice";

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { token, user } = useSelector((state) => state.auth);
  const { data, isLoading, isError } = useVerifyAuthTokenQuery(token, {
    skip: !token,
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError || !data?.valid) return <Navigate to="/sign-in" replace />;

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/404" replace />;
  }

  return children;
};

export default ProtectedRoute;
