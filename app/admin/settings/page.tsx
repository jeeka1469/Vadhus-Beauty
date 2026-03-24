import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function AdminSettingsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-sans text-3xl font-semibold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your salon settings</p>
      </div>

      <div className="space-y-8 max-w-2xl">
        {/* Business Info */}
        <Card>
          <CardHeader>
            <CardTitle className="font-sans">Business Information</CardTitle>
            <CardDescription>Update your salon details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="business_name">Business Name</Label>
              <Input id="business_name" defaultValue="Vadhus Beauty" className="mt-2" />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" defaultValue="+91 7506528283" className="mt-2" />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="vadhusbeauty@gmail.com" className="mt-2" />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input id="address" defaultValue="104 A Wing, Ram Kutir Residency, Asalpha, Mumbai, Maharashtra 400053" className="mt-2" />
            </div>
            <p className="text-sm text-muted-foreground">Business details are currently managed via code and environment configuration.</p>
          </CardContent>
        </Card>

        {/* Operating Hours */}
        <Card>
          <CardHeader>
            <CardTitle className="font-sans">Operating Hours</CardTitle>
            <CardDescription>Set your business hours</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="open_time">Opening Time</Label>
                <Input id="open_time" type="time" defaultValue="09:00" className="mt-2" />
              </div>
              <div>
                <Label htmlFor="close_time">Closing Time</Label>
                <Input id="close_time" type="time" defaultValue="20:00" className="mt-2" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="closed_sunday" defaultChecked className="h-4 w-4 rounded border-input" />
              <Label htmlFor="closed_sunday" className="cursor-pointer">
                Closed on Sundays
              </Label>
            </div>
            <p className="text-sm text-muted-foreground">Operating hours are currently managed via code and environment configuration.</p>
          </CardContent>
        </Card>

        {/* Tax Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="font-sans">Tax Settings</CardTitle>
            <CardDescription>Configure tax rates for invoices</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="gst_rate">GST Rate (%)</Label>
              <Input id="gst_rate" type="number" defaultValue="18" className="mt-2" />
            </div>
            <div>
              <Label htmlFor="gst_number">GST Number</Label>
              <Input id="gst_number" placeholder="Enter GST number" className="mt-2" />
            </div>
            <p className="text-sm text-muted-foreground">Tax configuration persistence is not enabled yet in this build.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
