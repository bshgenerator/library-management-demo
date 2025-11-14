import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">System Settings</h1>
        <p className="text-muted-foreground">Configure library policies and settings</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Loan Policies</CardTitle>
          <CardDescription>Configure book loan duration and limits</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="loanPeriod">Default Loan Period (days)</Label>
            <Input id="loanPeriod" type="number" defaultValue={14} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="maxBooks">Maximum Books Per Member</Label>
            <Input id="maxBooks" type="number" defaultValue={5} />
          </div>
          <Button onClick={() => console.log("UPDATE SETTINGS: Loan policies")}>
            Save Changes
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Fine Policies</CardTitle>
          <CardDescription>Configure fine calculation rules</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="dailyFine">Daily Fine Rate ($)</Label>
            <Input id="dailyFine" type="number" step="0.01" defaultValue={0.50} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="maxFine">Maximum Fine Cap ($)</Label>
            <Input id="maxFine" type="number" step="0.01" defaultValue={50.00} />
          </div>
          <Button onClick={() => console.log("UPDATE SETTINGS: Fine policies")}>
            Save Changes
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Reservation Policies</CardTitle>
          <CardDescription>Configure book reservation settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="maxReservations">Maximum Reservations Per Member</Label>
            <Input id="maxReservations" type="number" defaultValue={3} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="holdDuration">Reservation Hold Duration (days)</Label>
            <Input id="holdDuration" type="number" defaultValue={7} />
          </div>
          <Button onClick={() => console.log("UPDATE SETTINGS: Reservation policies")}>
            Save Changes
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

