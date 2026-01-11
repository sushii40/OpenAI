import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Milk, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { indianStates } from '@/data/dairyCompanies';

export default function Register() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    state: '',
    district: '',
    village: '',
    cattleType: 'cow' as 'cow' | 'buffalo' | 'both',
    cattleCount: 1,
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await register({
        ...formData,
        cattleType: formData.cattleType as 'cow' | 'buffalo' | 'both',
      });
      
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Email already registered. Try logging in!');
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const isStep1Valid = formData.name && formData.email && formData.phone && formData.password;
  const isStep2Valid = formData.state && formData.district && formData.village;
  const isStep3Valid = formData.cattleType && formData.cattleCount > 0;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-grass-light via-background to-secondary">
      <Card className="w-full max-w-lg shadow-lg animate-fade-in">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-lg">
            <Milk className="h-8 w-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold">Farmer Registration</CardTitle>
          <CardDescription>
            किसान पंजीकरण - Step {step} of 3
          </CardDescription>
          
          {/* Progress Steps */}
          <div className="flex justify-center gap-2 mt-4">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 w-16 rounded-full transition-colors ${
                  s <= step ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Step 1: Personal Info */}
            {step === 1 && (
              <div className="space-y-4 animate-fade-in">
                <h3 className="font-medium text-foreground">Personal Information</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name (पूरा नाम)</Label>
                  <Input
                    id="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="farmer@example.com"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number (मोबाइल नंबर)</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+91 9876543210"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Create Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Minimum 6 characters"
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            {/* Step 2: Location */}
            {step === 2 && (
              <div className="space-y-4 animate-fade-in">
                <h3 className="font-medium text-foreground">Location Details (स्थान)</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="state">State (राज्य)</Label>
                  <Select value={formData.state} onValueChange={(v) => handleChange('state', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your state" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover max-h-60">
                      {indianStates.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="district">District (जिला)</Label>
                  <Input
                    id="district"
                    placeholder="Enter your district"
                    value={formData.district}
                    onChange={(e) => handleChange('district', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="village">Village/Town (गांव/शहर)</Label>
                  <Input
                    id="village"
                    placeholder="Enter your village or town"
                    value={formData.village}
                    onChange={(e) => handleChange('village', e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            {/* Step 3: Cattle Info */}
            {step === 3 && (
              <div className="space-y-4 animate-fade-in">
                <h3 className="font-medium text-foreground">Cattle Information (पशु जानकारी)</h3>
                
                <div className="space-y-2">
                  <Label>Type of Cattle (पशु प्रकार)</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['cow', 'buffalo', 'both'] as const).map((type) => (
                      <Button
                        key={type}
                        type="button"
                        variant={formData.cattleType === type ? 'default' : 'outline'}
                        className="h-auto py-4 flex-col gap-1"
                        onClick={() => handleChange('cattleType', type)}
                      >
                        <span className="text-2xl">{type === 'cow' ? '🐄' : type === 'buffalo' ? '🐃' : '🐄🐃'}</span>
                        <span className="text-xs capitalize">{type === 'both' ? 'Both' : type}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cattleCount">Number of Cattle (पशुओं की संख्या)</Label>
                  <Input
                    id="cattleCount"
                    type="number"
                    min="1"
                    max="500"
                    value={formData.cattleCount}
                    onChange={(e) => handleChange('cattleCount', parseInt(e.target.value) || 1)}
                    required
                  />
                </div>

                <div className="rounded-lg bg-primary/10 p-4 text-sm space-y-2">
                  <div className="flex items-center gap-2 text-primary font-medium">
                    <CheckCircle2 className="h-4 w-4" />
                    Ready to Register
                  </div>
                  <p className="text-muted-foreground">
                    After registration, you can select a dairy company and start tracking your milk supply!
                  </p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-3 pt-4">
              {step > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 gap-2"
                  onClick={() => setStep(step - 1)}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
              )}
              
              {step < 3 ? (
                <Button
                  type="button"
                  className="flex-1 gap-2"
                  disabled={step === 1 ? !isStep1Valid : !isStep2Valid}
                  onClick={() => setStep(step + 1)}
                >
                  Next
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="flex-1 gap-2"
                  disabled={!isStep3Valid || isLoading}
                >
                  {isLoading ? 'Registering...' : 'Complete Registration'}
                  <CheckCircle2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </form>

          <div className="text-center text-sm text-muted-foreground">
            Already registered?{' '}
            <Link to="/login" className="text-primary hover:underline font-medium">
              Login here
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
