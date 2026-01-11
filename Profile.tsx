import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { dairyCompanies } from '@/data/dairyCompanies';
import { User, MapPin, Phone, Mail, Building2, Edit2, Save, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Profile() {
  const { farmer, updateFarmer } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: farmer?.name || '',
    phone: farmer?.phone || '',
    district: farmer?.district || '',
    village: farmer?.village || '',
    cattleCount: farmer?.cattleCount || 1,
  });

  const selectedDairy = dairyCompanies.find(d => d.id === farmer?.selectedDairy);

  const handleSave = () => {
    updateFarmer(editData);
    setIsEditing(false);
    toast({
      title: "Profile Updated! ✅",
      description: "Your profile information has been saved.",
    });
  };

  const handleCancel = () => {
    setEditData({
      name: farmer?.name || '',
      phone: farmer?.phone || '',
      district: farmer?.district || '',
      village: farmer?.village || '',
      cattleCount: farmer?.cattleCount || 1,
    });
    setIsEditing(false);
  };

  if (!farmer) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container py-6 space-y-6 max-w-3xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <User className="h-6 w-6 text-primary" />
              My Profile
            </h1>
            <p className="text-muted-foreground">
              Manage your farmer profile and settings
            </p>
          </div>
          
          {!isEditing ? (
            <Button variant="outline" className="gap-2" onClick={() => setIsEditing(true)}>
              <Edit2 className="h-4 w-4" />
              Edit Profile
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={handleCancel}>
                <X className="h-4 w-4 mr-1" />
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave}>
                <Save className="h-4 w-4 mr-1" />
                Save
              </Button>
            </div>
          )}
        </div>

        {/* Profile Card */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center">
                <span className="text-4xl">👨‍🌾</span>
              </div>
              <div>
                <CardTitle className="text-xl">{farmer.name}</CardTitle>
                <CardDescription className="flex items-center gap-2 mt-1">
                  <Badge variant="outline">ID: {farmer.id}</Badge>
                  <Badge className="bg-primary/20 text-primary">
                    {farmer.cattleType === 'both' ? '🐄🐃' : farmer.cattleType === 'cow' ? '🐄 Cow' : '🐃 Buffalo'}
                  </Badge>
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Personal Info */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  Full Name
                </Label>
                {isEditing ? (
                  <Input
                    id="name"
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  />
                ) : (
                  <p className="text-foreground font-medium">{farmer.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  Email
                </Label>
                <p className="text-foreground font-medium">{farmer.email}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  Phone Number
                </Label>
                {isEditing ? (
                  <Input
                    id="phone"
                    value={editData.phone}
                    onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                  />
                ) : (
                  <p className="text-foreground font-medium">{farmer.phone}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  State
                </Label>
                <p className="text-foreground font-medium">{farmer.state}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="district">District</Label>
                {isEditing ? (
                  <Input
                    id="district"
                    value={editData.district}
                    onChange={(e) => setEditData({ ...editData, district: e.target.value })}
                  />
                ) : (
                  <p className="text-foreground font-medium">{farmer.district}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="village">Village/Town</Label>
                {isEditing ? (
                  <Input
                    id="village"
                    value={editData.village}
                    onChange={(e) => setEditData({ ...editData, village: e.target.value })}
                  />
                ) : (
                  <p className="text-foreground font-medium">{farmer.village}</p>
                )}
              </div>
            </div>

            {/* Cattle Info */}
            <div className="border-t pt-6">
              <h3 className="font-semibold mb-4">Cattle Information</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Cattle Type</Label>
                  <p className="text-foreground font-medium capitalize">
                    {farmer.cattleType === 'both' ? 'Cow & Buffalo' : farmer.cattleType}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cattleCount">Number of Cattle</Label>
                  {isEditing ? (
                    <Input
                      id="cattleCount"
                      type="number"
                      min="1"
                      value={editData.cattleCount}
                      onChange={(e) => setEditData({ ...editData, cattleCount: parseInt(e.target.value) || 1 })}
                    />
                  ) : (
                    <p className="text-foreground font-medium">{farmer.cattleCount}</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Selected Dairy */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Selected Dairy Company
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDairy ? (
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center text-2xl">
                    {selectedDairy.logo}
                  </div>
                  <div>
                    <p className="font-semibold text-lg">{selectedDairy.name}</p>
                    <p className="text-sm text-muted-foreground">
                      ₹{selectedDairy.pricePerLiter.cow}/L (Cow) • ₹{selectedDairy.pricePerLiter.buffalo}/L (Buffalo)
                    </p>
                  </div>
                </div>
                <Badge className="bg-primary/20 text-primary">Active</Badge>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Building2 className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No dairy company selected yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Registration Info */}
        <Card>
          <CardContent className="py-4">
            <p className="text-sm text-muted-foreground text-center">
              Registered on {new Date(farmer.registeredAt).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
