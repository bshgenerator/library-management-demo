import { useEffect, useState } from "react";
import { membersAPI } from "@/services/api";
import type { Member } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2 } from "lucide-react";

export default function AdminMembers() {
  const [members, setMembers] = useState<Member[]>([]);
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

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this member?")) {
      await membersAPI.delete(id);
      loadMembers();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Member Management</h1>
          <p className="text-muted-foreground">Manage library members</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Member
        </Button>
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

      <Card>
        <CardHeader>
          <CardTitle>Members ({members.length})</CardTitle>
          <CardDescription>All registered library members</CardDescription>
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
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium">{member.name}</TableCell>
                    <TableCell>{member.membershipId}</TableCell>
                    <TableCell>{member.email}</TableCell>
                    <TableCell>{member.phone}</TableCell>
                    <TableCell>
                      <Badge
                        variant={member.status === "active" ? "success" : "destructive"}
                      >
                        {member.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{member.membershipType}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(member.id)}
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

