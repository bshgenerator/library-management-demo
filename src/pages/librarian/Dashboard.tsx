import { useEffect, useState } from "react";
import { statsAPI, reservationsAPI, transactionsAPI } from "@/services/api";
import type { LibraryStats, Reservation, Transaction } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BookCheck, AlertCircle, Clock, ArrowRight } from "lucide-react";

export default function LibrarianDashboard() {
  const [stats, setStats] = useState<LibraryStats | null>(null);
  const [pendingReservations, setPendingReservations] = useState<Reservation[]>([]);
  const [overdueBooks, setOverdueBooks] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [statsData, reservations, transactions] = await Promise.all([
      statsAPI.getLibraryStats(),
      reservationsAPI.getAll(),
      transactionsAPI.getAll(),
    ]);

    setStats(statsData);
    setPendingReservations(reservations.filter((r) => r.status === "pending"));
    setOverdueBooks(transactions.filter((t) => t.status === "overdue"));
    setLoading(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Librarian Dashboard</h1>
        <p className="text-muted-foreground">Today's operations and quick actions</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Checkouts</CardTitle>
            <BookCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.activeCheckouts || 0}</div>
            <p className="text-xs text-muted-foreground">Active checkouts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Books</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {stats?.overdueBooks || 0}
            </div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reservations</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.pendingReservations || 0}</div>
            <p className="text-xs text-muted-foreground">Awaiting processing</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Pending Reservations</CardTitle>
            <CardDescription>Books ready for checkout</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Book ID</TableHead>
                  <TableHead>Member ID</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingReservations.slice(0, 5).map((reservation) => (
                  <TableRow key={reservation.id}>
                    <TableCell>{reservation.bookId}</TableCell>
                    <TableCell>{reservation.memberId}</TableCell>
                    <TableCell>{reservation.position}</TableCell>
                    <TableCell>
                      <button
                        className="text-primary hover:underline"
                        onClick={() => console.log("PROCESS RESERVATION:", reservation.id)}
                      >
                        Process
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Overdue Books</CardTitle>
            <CardDescription>Books past due date</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Book ID</TableHead>
                  <TableHead>Member ID</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {overdueBooks.slice(0, 5).map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{transaction.bookId}</TableCell>
                    <TableCell>{transaction.memberId}</TableCell>
                    <TableCell>{transaction.dueDate}</TableCell>
                    <TableCell>
                      <button
                        className="text-primary hover:underline"
                        onClick={() => console.log("VIEW OVERDUE:", transaction.id)}
                      >
                        View
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <a href="/librarian/checkout" className="block text-sm text-primary hover:underline">
            <ArrowRight className="inline h-4 w-4 mr-2" />
            Checkout/Return Books
          </a>
          <a href="/librarian/books" className="block text-sm text-primary hover:underline">
            <ArrowRight className="inline h-4 w-4 mr-2" />
            Browse Books
          </a>
          <a href="/librarian/members" className="block text-sm text-primary hover:underline">
            <ArrowRight className="inline h-4 w-4 mr-2" />
            View Members
          </a>
        </CardContent>
      </Card>
    </div>
  );
}

