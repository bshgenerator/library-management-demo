import { useEffect, useState } from "react";
import { membersAPI, transactionsAPI, finesAPI } from "@/services/api";
import type { Member, Transaction, Fine } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";

export default function LibrarianMembers() {
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [memberTransactions, setMemberTransactions] = useState<Transaction[]>([]);
  const [memberFines, setMemberFines] = useState<Fine[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    setLoading(true);
    const data = await membersAPI.getAll();
    setMembers(data);
    setLoading(false);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadMembers();
      return;
    }
    setLoading(true);
    const results = await membersAPI.search(searchQuery);
    setMembers(results);
    setLoading(false);
  };

  const handleViewMember = async (memberId: string) => {
    const [transactions, fines] = await Promise.all([
      transactionsAPI.getByMemberId(memberId),
      finesAPI.getByMemberId(memberId),
    ]);
    const member = members.find((m) => m.id === memberId);
    setSelectedMember(member || null);
    setMemberTransactions(transactions);
    setMemberFines(fines);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Member Management</h1>
        <p className="text-muted-foreground">View and manage member accounts</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search Members</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Search by name, email, or membership ID..."
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

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Members ({members.length})</CardTitle>
            <CardDescription>All library members</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div>Loading...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Membership ID</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">{member.name}</TableCell>
                      <TableCell>{member.membershipId}</TableCell>
                      <TableCell>
                        <Badge
                          variant={member.status === "active" ? "success" : "destructive"}
                        >
                          {member.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewMember(member.id)}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {selectedMember && (
          <Card>
            <CardHeader>
              <CardTitle>Member Details</CardTitle>
              <CardDescription>{selectedMember.name}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium">Email: {selectedMember.email}</p>
                <p className="text-sm font-medium">Phone: {selectedMember.phone}</p>
                <p className="text-sm font-medium">Status: {selectedMember.status}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Current Checkouts ({memberTransactions.filter(t => t.status === 'active').length})</h3>
                <div className="text-sm space-y-1">
                  {memberTransactions.filter(t => t.status === 'active').map((t) => (
                    <div key={t.id}>
                      Book {t.bookId} - Due: {t.dueDate}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Outstanding Fines</h3>
                <div className="text-sm">
                  ${memberFines.filter(f => f.status === 'unpaid').reduce((sum, f) => sum + f.amount, 0).toFixed(2)}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

