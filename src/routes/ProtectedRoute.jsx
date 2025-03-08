import { Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useVerifyAuthTokenQuery } from "../store/apiSlices/authApiSlice";
import { setCredentials, logout } from "../store/stateSlices/authStateSlice";
import { useEffect } from "react";

const ProtectedRoute = ({ allowedRoles, children }) => {
  const dispatch = useDispatch();
  const { token, user, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (!isAuthenticated && storedToken && storedUser) {
      dispatch(setCredentials({ user: storedUser, token: storedToken }));
    }
  }, [dispatch, isAuthenticated]);

  const { data, isLoading, isError } = useVerifyAuthTokenQuery(token, {
    skip: !token || isAuthenticated,
  });

  useEffect(() => {
    if (isError || (data && !data.user)) {
      dispatch(logout());
    }
  }, [isError, data, dispatch]);

  if (isLoading) return <p>Loading...</p>;

  if (isError || (data && !data.user)) {
    return <Navigate to="/sign-in" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/404" replace />;
  }

  return children;
};

export default ProtectedRoute;
