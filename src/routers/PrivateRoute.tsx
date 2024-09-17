// PrivateRoute.tsx
import React from "react";
import { Route, Outlet, Navigate } from "react-router-dom";
import { useAuth } from "context/AuthContext";

const PrivateRoute: React.FC = ({
}) => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/login" />
  );
};

export default PrivateRoute;
