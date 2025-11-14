import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, BookOpen, Users, Settings } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <BookOpen className="h-8 w-8 text-primary" />
                <span className="ml-2 text-xl font-semibold text-foreground">Library System</span>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-foreground hover:text-muted-foreground transition-colors"
                >
                  Dashboard
                </Link>
                {user?.role === "admin" && (
                  <>
                    <Link
                      to="/admin/books"
                      className="inline-flex items-center px-1 pt-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Books
                    </Link>
                    <Link
                      to="/admin/members"
                      className="inline-flex items-center px-1 pt-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Members
                    </Link>
                    <Link
                      to="/admin/reports"
                      className="inline-flex items-center px-1 pt-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Reports
                    </Link>
                    <Link
                      to="/admin/settings"
                      className="inline-flex items-center px-1 pt-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Settings
                    </Link>
                  </>
                )}
                {user?.role === "librarian" && (
                  <>
                    <Link
                      to="/librarian/checkout"
                      className="inline-flex items-center px-1 pt-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Checkout
                    </Link>
                    <Link
                      to="/librarian/books"
                      className="inline-flex items-center px-1 pt-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Books
                    </Link>
                    <Link
                      to="/librarian/members"
                      className="inline-flex items-center px-1 pt-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Members
                    </Link>
                  </>
                )}
                {user?.role === "member" && (
                  <>
                    <Link
                      to="/member/books"
                      className="inline-flex items-center px-1 pt-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Browse Books
                    </Link>
                    <Link
                      to="/member/my-books"
                      className="inline-flex items-center px-1 pt-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                      My Books
                    </Link>
                    <Link
                      to="/member/profile"
                      className="inline-flex items-center px-1 pt-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Profile
                    </Link>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                {user?.name} ({user?.role})
              </span>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}

