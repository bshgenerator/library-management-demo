import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import type { Transaction, Reservation, Fine } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BookOpen, Clock, DollarSign, AlertCircle } from "lucide-react";
import type { BshResponse } from "@bshsolutions/sdk/types";
import { bshengine } from "@/lib/bshengine";

export default function MemberDashboard() {
  const { user } = useAuth();
  const [currentBooks, setCurrentBooks] = useState<BshResponse<Transaction>>({ data: [] } as unknown as BshResponse<Transaction>);
  const [reservations, setReservations] = useState<BshResponse<Reservation>>({ data: [] } as unknown as BshResponse<Reservation>);
  const [fines, setFines] = useState<BshResponse<Fine>>({ data: [] } as unknown as BshResponse<Fine>);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.userId) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    if (!user?.userId) return;
    setLoading(true);

    await Promise.all([
      bshengine.entity('Transactions').search<Transaction>({
        payload: {
          filters: [
            { field: 'memberId', operator: 'eq', value: user.userId }
          ]
        },
        onSuccess: (response) => {
          setCurrentBooks(response);
        }
      }),
      bshengine.entity('Reservations').search<Reservation>({
        payload: {
          filters: [
            { field: 'memberId', operator: 'eq', value: user.userId }
          ]
        },
        onSuccess: (response) => {
          setReservations(response);
        }
      }),
      bshengine.entity('Fines').search<Fine>({
        payload: {
          filters: [
            { field: 'memberId', operator: 'eq', value: user.userId }
          ]
        },
        onSuccess: (response) => {
          setFines(response);
        }
      })
    ]);
    setLoading(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const totalFines = fines.data.reduce((sum, f) => sum + f.amount, 0);
  const upcomingDueDates = currentBooks
    .data.filter((t) => {
      const dueDate = new Date(t.dueDate);
      const today = new Date();
      const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return daysUntilDue <= 7 && daysUntilDue > 0;
    }).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {user?.profile?.firstName} {user?.profile?.lastName}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Books</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentBooks.data.length}</div>
            <p className="text-xs text-muted-foreground">Books borrowed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Due Dates</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingDueDates}</div>
            <p className="text-xs text-muted-foreground">Due within 7 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outstanding Fines</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalFines.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Unpaid fines</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Currently Borrowed Books</CardTitle>
            <CardDescription>Books you have checked out</CardDescription>
          </CardHeader>
          <CardContent>
            {currentBooks.data.length === 0 ? (
              <p className="text-sm text-muted-foreground">No books currently borrowed</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Book ID</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentBooks.data.map((transaction) => {
                    const dueDate = new Date(transaction.dueDate);
                    const today = new Date();
                    const isOverdue = dueDate < today;
                    return (
                      <TableRow key={transaction.id}>
                        <TableCell>{transaction.bookId}</TableCell>
                        <TableCell>{transaction.dueDate}</TableCell>
                        <TableCell>
                          {isOverdue ? (
                            <span className="px-2 py-1 rounded text-xs bg-red-100 text-red-800 flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              Overdue
                            </span>
                          ) : (
                            <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-800">
                              Active
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>My Reservations</CardTitle>
            <CardDescription>Books you have reserved</CardDescription>
          </CardHeader>
          <CardContent>
            {reservations.data.length === 0 ? (
              <p className="text-sm text-muted-foreground">No active reservations</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Book ID</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Reserved Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reservations.data.map((reservation) => (
                    <TableRow key={reservation.id}>
                      <TableCell>{reservation.bookId}</TableCell>
                      <TableCell>#{reservation.position}</TableCell>
                      <TableCell>{reservation.reservationDate}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

