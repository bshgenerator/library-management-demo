import { useCallback, useEffect, useState } from "react";
import type { Transaction, Fine } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { bshengine } from "@/lib/bshengine";
import type { BshResponse } from "@bshsolutions/sdk/types";

export default function AdminReports() {
  const [activeCheckouts, setActiveCheckouts] = useState<BshResponse<Transaction>>({data: []} as unknown as BshResponse<Transaction>);
  const [overdueBooks, setOverdueBooks] = useState<BshResponse<Transaction>>({data: []} as unknown as BshResponse<Transaction>);
  const [unpaidFines, setUnpaidFines] = useState<BshResponse<Fine>>({data: []} as unknown as BshResponse<Fine>);

  const loadActiveCheckouts = useCallback(async () => {
    await bshengine.entity('Transactions').search<Transaction>({
      payload: {
        filters: [
          { field: 'status', operator: 'eq', value: 'active' }
        ],
        pagination: {
          page: 1,
          size: 5
        }
      },
      onSuccess: (response) => {
        setActiveCheckouts(response);
      }
    });
  }, []);

  const loadOverdueBooks = useCallback(async () => {
    await bshengine.entity('Transactions').search<Transaction>({
      payload: {
        filters: [
          { field: 'status', operator: 'eq', value: 'overdue' }
        ],
        pagination: {
          page: 1,
          size: 5
        }
      },
      onSuccess: (response) => {
        setOverdueBooks(response);
      }
    });
  }, []);

  const loadUnpaidFines = useCallback(async () => {
    await bshengine.entity('Fines').search<Fine>({
      payload: {
        filters: [
          { field: 'status', operator: 'eq', value: 'unpaid' }
        ],
        pagination: {
          page: 1,
          size: 5
        }
      },
      onSuccess: (response) => {
        setUnpaidFines(response);
      }
    });
  }, []);

  useEffect(() => {
    loadActiveCheckouts()
    loadOverdueBooks()
    loadUnpaidFines()
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Reports & Analytics</h1>
        <p className="text-muted-foreground">Library reports and statistics</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Checkouts ({activeCheckouts.pagination?.total || 0})</CardTitle>
          <CardDescription>Books currently checked out</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Book ID</TableHead>
                <TableHead>Member ID</TableHead>
                <TableHead>Checkout Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activeCheckouts.data.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.id}</TableCell>
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
          <CardTitle>Overdue Books ({overdueBooks.pagination?.total || 0})</CardTitle>
          <CardDescription>Books past their due date</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Book ID</TableHead>
                <TableHead>Member ID</TableHead>
                <TableHead>Checkout Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {overdueBooks.data.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.id}</TableCell>
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
          <CardTitle>Unpaid Fines ({unpaidFines.pagination?.total || 0})</CardTitle>
          <CardDescription>Outstanding fine payments</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Member ID</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Issue Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {unpaidFines.data.map((fine) => (
                <TableRow key={fine.id}>
                  <TableCell>{fine.id}</TableCell>
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

