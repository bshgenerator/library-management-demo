import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { membersAPI } from "@/services/api";
import type { Member } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { User, Mail, Phone, MapPin, Calendar, CreditCard } from "lucide-react";

export default function MemberProfile() {
  const { user } = useAuth();
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    if (user?.memberId) {
      loadMember();
    }
  }, [user]);

  const loadMember = async () => {
    if (!user?.memberId) return;
    setLoading(true);
    const memberData = await membersAPI.getById(user.memberId);
    if (memberData) {
      setMember(memberData);
      setFormData({
        name: memberData.name,
        email: memberData.email,
        phone: memberData.phone,
        address: memberData.address,
      });
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!user?.memberId) return;
    setSaving(true);
    try {
      await membersAPI.update(user.memberId, formData);
      await loadMember();
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      alert("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (member) {
      setFormData({
        name: member.name,
        email: member.email,
        phone: member.phone,
        address: member.address,
      });
    }
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-9 w-48 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {[...Array(2)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-40 mb-2" />
                <Skeleton className="h-4 w-64" />
              </CardHeader>
              <CardContent className="space-y-4">
                {[...Array(4)].map((_, j) => (
                  <div key={j} className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!member) {
    return <div>Member profile not found</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="text-muted-foreground">View and manage your account information</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Your account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="membershipId">Membership ID</Label>
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <Input
                  id="membershipId"
                  value={member.membershipId}
                  disabled
                  className="bg-muted"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
            </div>

            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)} className="w-full">
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button onClick={handleSave} disabled={saving} className="flex-1">
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
                <Button onClick={handleCancel} variant="outline" className="flex-1">
                  Cancel
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Membership Details</CardTitle>
            <CardDescription>Your membership information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Membership Type</Label>
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <Input
                  value={member.membershipType}
                  disabled
                  className="bg-muted capitalize"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    member.status === "active"
                      ? "success"
                      : member.status === "suspended"
                      ? "destructive"
                      : "secondary"
                  }
                >
                  {member.status}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Join Date</Label>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <Input
                  value={member.joinDate}
                  disabled
                  className="bg-muted"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

