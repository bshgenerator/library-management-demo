import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function DashboardRoute() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect based on user role (priority: admin > librarian > member)
  if (user.roles?.includes("admin")) {
    return <Navigate to="/admin/dashboard" replace />;
  }
  
  if (user.roles?.includes("librarian")) {
    return <Navigate to="/librarian/dashboard" replace />;
  }
  
  if (user.roles?.includes("member")) {
    return <Navigate to="/member/dashboard" replace />;
  }

  // Default fallback to login if no role is found
  return <Navigate to="/login" replace />;
}
