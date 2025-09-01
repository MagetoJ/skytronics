import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Login() {
  const [, setLocation] = useLocation();
  const { login, user } = useAuth();
  const { toast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    document.title = 'Login - PC Today Kenya';
    
    if (user) {
      setLocation('/dashboard');
    }
  }, [user, setLocation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      toast({
        title: "Login Successful",
        description: "Welcome back to PC Today!",
      });
      
      // Redirect based on user role
      if (user?.adminRole === 'standard_admin' || user?.adminRole === 'main_admin') {
        setLocation('/admin');
      } else {
        setLocation('/dashboard');
      }
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Invalid email or password. Please try again.",
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
              <p className="text-sm text-muted-foreground">Electronics Kenya</p>
            </div>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">Welcome Back</CardTitle>
            <p className="text-center text-muted-foreground">
              Sign in to your PC Today account
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  data-testid="input-login-email"
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
                    placeholder="Enter your password"
                    required
                    data-testid="input-login-password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    data-testid="button-toggle-password"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
                data-testid="button-login-submit"
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-6 text-center space-y-4">
              <div className="text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link href="/register" className="text-primary hover:underline" data-testid="link-register">
                  Create account
                </Link>
              </div>
              
              <div className="text-sm text-muted-foreground">
                Admin access?{' '}
                <Link href="/admin/login" className="text-primary hover:underline" data-testid="link-admin-login">
                  Admin Login
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="text-center space-y-4">
          <div className="grid grid-cols-3 gap-4 text-xs">
            <div className="flex flex-col items-center space-y-1">
              <i className="fas fa-truck text-primary"></i>
              <span className="text-muted-foreground">Free Delivery</span>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <i className="fas fa-money-bill-wave text-primary"></i>
              <span className="text-muted-foreground">Cash on Delivery</span>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <i className="fas fa-shield-alt text-primary"></i>
              <span className="text-muted-foreground">1 Year Warranty</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
