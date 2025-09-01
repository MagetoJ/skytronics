import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  ShoppingCart, 
  Search, 
  Menu, 
  User,
  LogOut,
  Settings
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useLocation();
  const { user, logout } = useAuth();
  const { getItemCount } = useCart();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-3" data-testid="link-home">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <i className="fas fa-desktop text-primary-foreground text-lg"></i>
              </div>
              <div>
                <h1 className="text-xl font-bold text-primary">PC Today</h1>
                <p className="text-xs text-muted-foreground">Electronics Kenya</p>
              </div>
            </Link>
            
            {/* Navigation Links */}
            <nav className="hidden md:flex space-x-6">
              <Link href="/products" className="text-foreground hover:text-primary font-medium" data-testid="link-products">
                Products
              </Link>
              <Link href="/products?category=smartphones" className="text-muted-foreground hover:text-primary" data-testid="link-smartphones">
                Smartphones
              </Link>
              <Link href="/products?category=laptops" className="text-muted-foreground hover:text-primary" data-testid="link-laptops">
                Laptops
              </Link>
              <Link href="/products?category=tvs" className="text-muted-foreground hover:text-primary" data-testid="link-tvs">
                Smart TVs
              </Link>
            </nav>
          </div>
          
          {/* Search Bar */}
          <div className="flex-1 max-w-lg mx-8 hidden md:block">
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="text"
                placeholder="Search electronics in Nairobi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4"
                data-testid="input-search"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </form>
          </div>
          
          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {user && (
              <Link href="/dashboard">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="relative"
                  data-testid="button-wishlist"
                >
                  <Heart className="h-5 w-5" />
                  <Badge variant="secondary" className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                    0
                  </Badge>
                </Button>
              </Link>
            )}
            
            <Link href="/cart">
              <Button 
                variant="ghost" 
                size="sm" 
                className="relative"
                data-testid="button-cart"
              >
                <ShoppingCart className="h-5 w-5" />
                <Badge variant="default" className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                  {getItemCount()}
                </Badge>
              </Button>
            </Link>
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" data-testid="button-user-menu">
                    <User className="h-5 w-5" />
                    <span className="ml-2 hidden md:inline">
                      {user.firstName || user.email}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" data-testid="link-dashboard">
                      <Settings className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  {(user.adminRole === 'standard_admin' || user.adminRole === 'main_admin') && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin" data-testid="link-admin">
                        <Settings className="mr-2 h-4 w-4" />
                        Admin Panel
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} data-testid="button-logout">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex space-x-2">
                <Link href="/login">
                  <Button variant="outline" data-testid="button-login">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button data-testid="button-register">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
            
            <Button variant="ghost" size="sm" className="md:hidden" data-testid="button-mobile-menu">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
