import { User, Lock, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="p-6 bg-amber-50 min-h-screen">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <h1 className="font-fugaz text-3xl bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent">
            Account Settings
          </h1>
        </div>

        {/* Profile Card */}
        <Card className="border-amber-200 mb-6">
          <CardHeader className="flex flex-row items-start space-y-0">
            <User className="h-5 w-5 mt-1 mr-2 text-amber-600" />
            <div>
              <CardTitle className="font-fugaz text-amber-900">
                Profile Information
              </CardTitle>
              <p className="font-alumni text-sm text-amber-800">
                Update your personal details
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="font-alumni text-base">Name</Label>
              <Input
                placeholder="Your Name"
                className="font-alumni mt-1 border-amber-200 focus:border-amber-400"
                defaultValue="Alex Johnson"
              />
            </div>
            <div>
              <Label className="font-alumni text-base">Email</Label>
              <Input
                type="email"
                placeholder="your@email.com"
                className="font-alumni mt-1 border-amber-200 focus:border-amber-400"
                defaultValue="alex@example.com"
                disabled
              />
            </div>
          </CardContent>
          <CardFooter className="justify-end">
            <Button className="font-alumni bg-amber-600 hover:bg-amber-700">
              Update Profile
            </Button>
          </CardFooter>
        </Card>

        {/* Security Card */}
        <Card className="border-amber-200 mb-6">
          <CardHeader className="flex flex-row items-start space-y-0">
            <Lock className="h-5 w-5 mt-1 mr-2 text-amber-600" />
            <div>
              <CardTitle className="font-fugaz text-amber-900">
                Security
              </CardTitle>
              <p className="font-alumni text-sm text-amber-800">
                Manage account security
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <Button
              variant="outline"
              className="font-alumni border-amber-300 w-full"
            >
              Change Password
            </Button>
          </CardContent>
        </Card>

        {/* Preferences Card */}
        <Card className="border-amber-200">
          <CardHeader className="flex flex-row items-start space-y-0">
            <Moon className="h-5 w-5 mt-1 mr-2 text-amber-600" />
            <div>
              <CardTitle className="font-fugaz text-amber-900">
                Preferences
              </CardTitle>
              <p className="font-alumni text-sm text-amber-800">
                Customize your experience
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-alumni text-base">
                  Email Notifications
                </Label>
                <p className="font-alumni text-sm text-amber-800">
                  Receive journal reminders
                </p>
              </div>
              <Switch
                defaultChecked
                className="data-[state=checked]:bg-amber-600"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
