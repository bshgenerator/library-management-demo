import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { booksAPI, reservationsAPI } from "@/services/api";
import type { Book } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, BookOpen, Calendar } from "lucide-react";

export default function MemberBooks() {
  const { user } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [reserving, setReserving] = useState<string | null>(null);

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    setLoading(true);
    const data = await booksAPI.getAll();
    setBooks(data);
    setLoading(false);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadBooks();
      return;
    }
    setLoading(true);
    const results = await booksAPI.search(searchQuery);
    setBooks(results);
    setLoading(false);
  };

  const handleReserve = async (bookId: string) => {
    if (!user?.memberId) return;
    
    setReserving(bookId);
    try {
      await reservationsAPI.create(bookId, user.memberId);
      alert("Book reserved successfully!");
      loadBooks();
    } catch (error) {
      alert("Failed to reserve book. Please try again.");
    } finally {
      setReserving(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Browse Books</h1>
        <p className="text-muted-foreground">Search and reserve books from the library</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search Books</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Search by title, author, or ISBN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button onClick={handleSearch}>
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Available Books ({books.length})</CardTitle>
          <CardDescription>Browse and reserve books from the catalog</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>ISBN</TableHead>
                  <TableHead>Genre</TableHead>
                  <TableHead>Available</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {books.map((book) => (
                  <TableRow key={book.id}>
                    <TableCell className="font-medium">{book.title}</TableCell>
                    <TableCell>{book.author}</TableCell>
                    <TableCell>{book.isbn}</TableCell>
                    <TableCell>{book.genre}</TableCell>
                    <TableCell>
                      {book.availableCopies} / {book.totalCopies}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          book.status === "available"
                            ? "success"
                            : book.status === "checked_out"
                            ? "warning"
                            : "secondary"
                        }
                      >
                        {book.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {book.availableCopies > 0 ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReserve(book.id)}
                          disabled={reserving === book.id}
                        >
                          <BookOpen className="h-3 w-3 mr-1" />
                          {reserving === book.id ? "Reserving..." : "Reserve"}
                        </Button>
                      ) : (
                        <span className="text-xs text-muted-foreground">Unavailable</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

