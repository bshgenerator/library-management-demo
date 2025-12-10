import { useEffect, useState } from "react";
import { booksAPI } from "@/services/api";
import type { Book } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { bshengine } from "@/lib/bshengine";
import type { BshResponse } from "@bshsolutions/sdk";

export default function AdminBooks() {
  const [books, setBooks] = useState<BshResponse<Book>>({
    data: [],
    timestamp: 0,
    code: 0,
    status: ""
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    setLoading(true);
    await bshengine.entity('Books').search<Book>({
      payload: {
        pagination: {
          page: 1,
          size: 10
        }
      },
      onSuccess: (response) => {
        setBooks(response);
        setLoading(false);
      }
    });
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadBooks();
      return;
    }
    setLoading(true);
    await bshengine.entity('Books').search<Book>({
      payload: {
        filters: [
          {
            operator: 'or',
            filters: [
              {field: 'title', operator: 'ilike', value: searchQuery},
              {field: 'author', operator: 'ilike', value: searchQuery},
              {field: 'isbn', operator: 'ilike', value: searchQuery},
              {field: 'genre', operator: 'ilike', value: searchQuery},
            ]
          }
        ],
        pagination: {
          page: 1,
          size: 10
        }
      },
      onSuccess: (response) => {
        setBooks(response);
        setLoading(false);
      }
    });
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this book?")) {
      await booksAPI.delete(id);
      loadBooks();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Book Management</h1>
          <p className="text-muted-foreground">Manage library catalog</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Book
        </Button>
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
          <CardTitle>Books ({books.pagination?.total || 0})</CardTitle>
          <CardDescription>All books in the library catalog</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>ISBN</TableHead>
                  <TableHead>Genre</TableHead>
                  <TableHead>Copies</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {books.data.map((book) => (
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
                          book.status === "available" ? "success" : "warning"
                        }
                      >
                        {book.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(book.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
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

