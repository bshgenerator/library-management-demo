import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardRoute from "@/components/DashboardRoute";
import Layout from "@/components/Layout";
import Login from "@/pages/Login";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminBooks from "@/pages/admin/Books";
import AdminMembers from "@/pages/admin/Members";
import AdminReports from "@/pages/admin/Reports";
import AdminSettings from "@/pages/admin/Settings";
import LibrarianDashboard from "@/pages/librarian/Dashboard";
import LibrarianCheckout from "@/pages/librarian/Checkout";
import LibrarianBooks from "@/pages/librarian/Books";
import LibrarianMembers from "@/pages/librarian/Members";
import MemberDashboard from "@/pages/member/Dashboard";
import MemberBooks from "@/pages/member/Books";
import MemberMyBooks from "@/pages/member/MyBooks";
import MemberProfile from "@/pages/member/Profile";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <DashboardRoute>
              </DashboardRoute>
            }
          />
          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Layout>
                  <AdminDashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/books"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Layout>
                  <AdminBooks />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/members"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Layout>
                  <AdminMembers />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reports"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Layout>
                  <AdminReports />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Layout>
                  <AdminSettings />
                </Layout>
              </ProtectedRoute>
            }
          />
          {/* Librarian Routes */}
          <Route
            path="/librarian/dashboard"
            element={
              <ProtectedRoute allowedRoles={["librarian"]}>
                <Layout>
                  <LibrarianDashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/librarian/checkout"
            element={
              <ProtectedRoute allowedRoles={["librarian"]}>
                <Layout>
                  <LibrarianCheckout />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/librarian/books"
            element={
              <ProtectedRoute allowedRoles={["librarian"]}>
                <Layout>
                  <LibrarianBooks />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/librarian/members"
            element={
              <ProtectedRoute allowedRoles={["librarian"]}>
                <Layout>
                  <LibrarianMembers />
                </Layout>
              </ProtectedRoute>
            }
          />
          {/* Member Routes */}
          <Route
            path="/member/dashboard"
            element={
              <ProtectedRoute allowedRoles={["member"]}>
                <Layout>
                  <MemberDashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/member/books"
            element={
              <ProtectedRoute allowedRoles={["member"]}>
                <Layout>
                  <MemberBooks />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/member/my-books"
            element={
              <ProtectedRoute allowedRoles={["member"]}>
                <Layout>
                  <MemberMyBooks />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/member/profile"
            element={
              <ProtectedRoute allowedRoles={["member"]}>
                <Layout>
                  <MemberProfile />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
