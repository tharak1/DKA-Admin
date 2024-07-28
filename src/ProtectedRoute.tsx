import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { GetUser } from './redux/UserSlice';
import { RootState } from './redux/PersistanceStorage';
 // Assuming you have a RootState type defined in your store

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const user = useSelector((state: RootState) => GetUser(state));

  if (!user) {
    // Redirect to the login page if not authenticated
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
