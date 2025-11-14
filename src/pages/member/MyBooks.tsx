import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { transactionsAPI, booksAPI } from "@/services/api";
import type { Transaction, Book } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BookOpen, Calendar, AlertCircle, RefreshCw } from "lucide-react";

export default function MemberMyBooks() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [books, setBooks] = useState<Record<string, Book>>({});
  const [loading, setLoading] = useState(true);
  const [renewing, setRenewing] = useState<string | null>(null);

  useEffect(() => {
    if (user?.memberId) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    if (!user?.memberId) return;
    setLoading(true);
    const memberTransactions = await transactionsAPI.getByMemberId(user.memberId);
    const activeTransactions = memberTransactions.filter((t) => t.status === "active");
    setTransactions(activeTransactions);

    // Load book details for each transaction
    const bookPromises = activeTransactions.map((t) => booksAPI.getById(t.bookId));
    const bookResults = await Promise.all(bookPromises);
    const booksMap: Record<string, Book> = {};
    bookResults.forEach((book, index) => {
      if (book) {
        booksMap[activeTransactions[index].bookId] = book;
      }
    });
    setBooks(booksMap);
    setLoading(false);
  };

  const handleRenew = async (transactionId: string, currentDueDate: string) => {
    setRenewing(transactionId);
    try {
      // Calculate new due date (extend by 14 days)
      const currentDate = new Date(currentDueDate);
      const newDueDate = new Date(currentDate);
      newDueDate.setDate(newDueDate.getDate() + 14);
      const newDueDateStr = newDueDate.toISOString().split("T")[0];

      await transactionsAPI.renew(transactionId, newDueDateStr);
      alert("Book renewed successfully! New due date: " + newDueDateStr);
      loadData();
    } catch (error) {
      alert("Failed to renew book. Please try again.");
    } finally {
      setRenewing(null);
    }
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  const daysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diff = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Books</h1>
        <p className="text-muted-foreground">View and manage your borrowed books</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Currently Borrowed Books ({transactions.length})</CardTitle>
          <CardDescription>Books you have checked out from the library</CardDescription>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">You don't have any borrowed books at the moment.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Book</TableHead>
                  <TableHead>Checkout Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => {
                  const book = books[transaction.bookId];
                  const overdue = isOverdue(transaction.dueDate);
                  const daysLeft = daysUntilDue(transaction.dueDate);
                  
                  return (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {book?.title || `Book ID: ${transaction.bookId}`}
                          </div>
                          {book && (
                            <div className="text-sm text-muted-foreground">
                              by {book.author}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{transaction.checkoutDate}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className={overdue ? "text-red-600 font-medium" : ""}>
                            {transaction.dueDate}
                          </span>
                        </div>
                        {!overdue && daysLeft <= 7 && (
                          <div className="text-xs text-yellow-600 mt-1">
                            {daysLeft} day{daysLeft !== 1 ? "s" : ""} remaining
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {overdue ? (
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
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRenew(transaction.id, transaction.dueDate)}
                          disabled={renewing === transaction.id}
                        >
                          <RefreshCw className={`h-3 w-3 mr-1 ${renewing === transaction.id ? "animate-spin" : ""}`} />
                          {renewing === transaction.id ? "Renewing..." : "Renew"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

