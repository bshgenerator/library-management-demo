import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import type { BshResponse } from "@bshsolutions/sdk/types";
import { bshengine } from "@/lib/bshengine";
import type { Member } from "@/types";

export default function AdminMembers() {
  const [members, setMembers] = useState<BshResponse<Member>>({
    data: [],
    timestamp: 0,
    code: 0,
    status: ""
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    setLoading(true);
    await bshengine.user.search<Member>({
      payload: {
        filters: [
          {field: 'roles', operator: 'ilike', value: 'member'}
        ]
      },
      onSuccess: (response) => {
        setMembers(response);
        setLoading(false);
      }
    })
    setLoading(false);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadMembers();
      return;
    }
    setLoading(true);
    await bshengine.user.search<Member>({
      payload: {
        filters: [
          {field: 'roles', operator: 'ilike', value: 'member'},
          {field: 'profile', operator: 'ilike', value: searchQuery}
        ]
      },
      onSuccess: (response) => {
        setMembers(response);
        setLoading(false);
      }
    })
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this member?")) {
      await bshengine.user.deleteById({id: id});
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
          <CardTitle>Members ({members.pagination?.total || 0})</CardTitle>
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
                {members.data.map((member) => (
                  <TableRow key={member.userId}>
                    <TableCell className="font-medium">{member.profile?.firstName} {member.profile?.lastName}</TableCell>
                    <TableCell>{member.profile?.membershipId || 'N/A'}</TableCell>
                    <TableCell>{member.email}</TableCell>
                    <TableCell>{member.profile?.phone}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          member.status === "ACTIVATED" ? "success" :
                          member.status === "REQUIRED_ACTIVATION" ? "warning" :
                          member.status === "DISABLED" ? "destructive" :
                          member.status === "REQUIRED_RESET_PASSWORD" ? "warning" :
                          "secondary"
                        }
                      >
                        {member.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{member.profile?.membershipType || 'N/A'}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(member.userId)}
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

