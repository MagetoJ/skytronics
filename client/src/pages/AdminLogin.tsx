import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const { adminLogin, user } = useAuth();
  const { toast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [securityKey, setSecurityKey] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showSecurityKey, setShowSecurityKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    document.title = 'Admin Login - PC Today Kenya';
    
    if (user && (user.adminRole === 'standard_admin' || user.adminRole === 'main_admin')) {
      setLocation('/admin');
    }
  }, [user, setLocation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await adminLogin(email, password, securityKey);
      toast({
        title: "Admin Login Successful",
        description: "Welcome to PC Today Admin Panel",
      });
      setLocation('/admin');
    } catch (error) {
      toast({
        title: "Admin Login Failed",
        description: "Invalid credentials or security key. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center space-x-2">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <i className="fas fa-desktop text-primary-foreground text-xl"></i>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary">PC Today</h1>
              <p className="text-sm text-muted-foreground">Admin Portal</p>
            </div>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Admin Access</span>
            </CardTitle>
            <p className="text-center text-muted-foreground">
              Secure admin login for PC Today management
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Admin Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@pctoday.ke"
                  required
                  data-testid="input-admin-email"
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter admin password"
                    required
                    data-testid="input-admin-password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    data-testid="button-toggle-admin-password"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="securityKey">Security Key</Label>
                <div className="relative">
                  <Input
                    id="securityKey"
                    type={showSecurityKey ? "text" : "password"}
                    value={securityKey}
                    onChange={(e) => setSecurityKey(e.target.value)}
                    placeholder="Enter security key"
                    required
                    data-testid="input-security-key"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowSecurityKey(!showSecurityKey)}
                    data-testid="button-toggle-security-key"
                  >
                    {showSecurityKey ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Security key provided by main admin
                </p>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
                data-testid="button-admin-login-submit"
              >
                {isLoading ? 'Signing in...' : 'Sign In as Admin'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <div className="text-sm text-muted-foreground">
                Regular customer?{' '}
                <Link href="/login" className="text-primary hover:underline" data-testid="link-customer-login">
                  Customer Login
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Admin Info */}
        <Card>
          <CardContent className="p-4">
            <div className="text-center space-y-2">
              <h3 className="font-semibold text-sm">Admin Access Information</h3>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>• Main Admin: Full system access</p>
                <p>• Standard Admin: Products & Orders only</p>
                <p>• Security key required for enhanced protection</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
