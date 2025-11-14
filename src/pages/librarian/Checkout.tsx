import { useState } from "react";
import { transactionsAPI, booksAPI, membersAPI } from "@/services/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookCheck, BookX } from "lucide-react";

export default function LibrarianCheckout() {
  const [bookId, setBookId] = useState("");
  const [memberId, setMemberId] = useState("");
  const [action, setAction] = useState<"checkout" | "return">("checkout");
  const [transactionId, setTransactionId] = useState("");

  const handleCheckout = async () => {
    if (!bookId || !memberId) {
      alert("Please enter both book ID and member ID");
      return;
    }

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14); // 14 days from now

    try {
      await transactionsAPI.checkout(
        bookId,
        memberId,
        dueDate.toISOString().split("T")[0]
      );
      alert("Book checked out successfully!");
      setBookId("");
      setMemberId("");
    } catch (error) {
      alert("Error: " + (error as Error).message);
    }
  };

  const handleReturn = async () => {
    if (!transactionId) {
      alert("Please enter transaction ID");
      return;
    }

    try {
      await transactionsAPI.return(transactionId);
      alert("Book returned successfully!");
      setTransactionId("");
    } catch (error) {
      alert("Error: " + (error as Error).message);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Checkout & Return</h1>
        <p className="text-muted-foreground">Process book checkouts and returns</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookCheck className="h-5 w-5" />
              Checkout Book
            </CardTitle>
            <CardDescription>Check out a book to a member</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="checkout-book">Book ID</Label>
              <Input
                id="checkout-book"
                placeholder="Enter book ID"
                value={bookId}
                onChange={(e) => setBookId(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="checkout-member">Member ID</Label>
              <Input
                id="checkout-member"
                placeholder="Enter member ID"
                value={memberId}
                onChange={(e) => setMemberId(e.target.value)}
              />
            </div>
            <Button onClick={handleCheckout} className="w-full">
              Checkout Book
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookX className="h-5 w-5" />
              Return Book
            </CardTitle>
            <CardDescription>Process a book return</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="return-transaction">Transaction ID</Label>
              <Input
                id="return-transaction"
                placeholder="Enter transaction ID"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
              />
            </div>
            <Button onClick={handleReturn} variant="destructive" className="w-full">
              Return Book
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

