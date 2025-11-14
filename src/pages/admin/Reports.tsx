import { useEffect, useState } from "react";
import { transactionsAPI, finesAPI, booksAPI, membersAPI } from "@/services/api";
import type { Transaction, Fine } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function AdminReports() {
  const [activeCheckouts, setActiveCheckouts] = useState<Transaction[]>([]);
  const [overdueBooks, setOverdueBooks] = useState<Transaction[]>([]);
  const [unpaidFines, setUnpaidFines] = useState<Fine[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    setLoading(true);
    const [transactions, fines] = await Promise.all([
      transactionsAPI.getAll(),
      finesAPI.getAll(),
    ]);

    setActiveCheckouts(transactions.filter((t) => t.status === "active"));
    setOverdueBooks(transactions.filter((t) => t.status === "overdue"));
    setUnpaidFines(fines.filter((f) => f.status === "unpaid"));
    setLoading(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Reports & Analytics</h1>
        <p className="text-muted-foreground">Library reports and statistics</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Checkouts</CardTitle>
          <CardDescription>Books currently checked out</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Book ID</TableHead>
                <TableHead>Member ID</TableHead>
                <TableHead>Checkout Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activeCheckouts.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.bookId}</TableCell>
                  <TableCell>{transaction.memberId}</TableCell>
                  <TableCell>{transaction.checkoutDate}</TableCell>
                  <TableCell>{transaction.dueDate}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-800">
                      {transaction.status}
                    </span>
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
          <CardDescription>Books past their due date</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Book ID</TableHead>
                <TableHead>Member ID</TableHead>
                <TableHead>Checkout Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {overdueBooks.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.bookId}</TableCell>
                  <TableCell>{transaction.memberId}</TableCell>
                  <TableCell>{transaction.checkoutDate}</TableCell>
                  <TableCell>{transaction.dueDate}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 rounded text-xs bg-red-100 text-red-800">
                      {transaction.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Unpaid Fines</CardTitle>
          <CardDescription>Outstanding fine payments</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member ID</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Issue Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {unpaidFines.map((fine) => (
                <TableRow key={fine.id}>
                  <TableCell>{fine.memberId}</TableCell>
                  <TableCell>${fine.amount.toFixed(2)}</TableCell>
                  <TableCell>{fine.reason}</TableCell>
                  <TableCell>{fine.issueDate}</TableCell>
                  <TableCell>{fine.dueDate}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 rounded text-xs bg-red-100 text-red-800">
                      {fine.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

