import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Package, Heart, User, Calendar, MapPin, Phone, Mail } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

export default function UserDashboard() {
  const { user, token } = useAuth();
  const [activeTab, setActiveTab] = useState('orders');

  useEffect(() => {
    document.title = 'My Dashboard - SKYTRONIQX Kenya';
    
    if (!user) {
      window.location.href = '/login';
    }
  }, [user]);

  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ['/api/users', user?.id, 'orders'],
    queryFn: async () => {
      const response = await apiRequest('GET', `/api/users/${user!.id}/orders`);
      return await response.json();
    },
    enabled: !!user && !!token
  });

  const { data: wishlist, isLoading: wishlistLoading } = useQuery({
    queryKey: ['/api/users', user?.id, 'wishlist'],
    queryFn: async () => {
      const response = await apiRequest('GET', `/api/users/${user!.id}/wishlist`);
      return await response.json();
    },
    enabled: !!user && !!token
  });

  const formatPrice = (price: string) => {
    return `KSh ${Number(price).toLocaleString()}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2" data-testid="text-dashboard-title">
            Welcome back, {user.firstName || user.email}!
          </h1>
          <p className="text-muted-foreground">
            Manage your orders, wishlist, and account settings
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="orders" className="flex items-center space-x-2" data-testid="tab-orders">
              <Package className="h-4 w-4" />
              <span>My Orders</span>
            </TabsTrigger>
            <TabsTrigger value="wishlist" className="flex items-center space-x-2" data-testid="tab-wishlist">
              <Heart className="h-4 w-4" />
              <span>Wishlist</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center space-x-2" data-testid="tab-profile">
              <User className="h-4 w-4" />
              <span>Profile</span>
            </TabsTrigger>
          </TabsList>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order History</CardTitle>
              </CardHeader>
              <CardContent>
                {ordersLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-24 bg-muted rounded-lg animate-pulse"></div>
                    ))}
                  </div>
                ) : orders?.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Start shopping to see your orders here
                    </p>
                    <Button onClick={() => window.location.href = '/products'} data-testid="button-start-shopping">
                      Start Shopping
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders?.map((order: any) => (
                      <Card key={order.id} className="border">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <div>
                                <div className="font-semibold" data-testid={`text-order-id-${order.id}`}>
                                  Order #{order.id.slice(-8).toUpperCase()}
                                </div>
                                <div className="text-sm text-muted-foreground flex items-center space-x-1">
                                  <Calendar className="h-3 w-3" />
                                  <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-lg" data-testid={`text-order-total-${order.id}`}>
                                {formatPrice(order.total)}
                              </div>
                              <Badge className={getStatusColor(order.status)} data-testid={`badge-order-status-${order.id}`}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div className="flex items-start space-x-2">
                              <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                              <div>
                                <div className="font-medium">Customer:</div>
                                <div className="text-muted-foreground">{order.customerName}</div>
                              </div>
                            </div>
                            
                            <div className="flex items-start space-x-2">
                              <Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
                              <div>
                                <div className="font-medium">Contact:</div>
                                <div className="text-muted-foreground">{order.contactNumber}</div>
                              </div>
                            </div>
                            
                            <div className="flex items-start space-x-2 md:col-span-2">
                              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                              <div>
                                <div className="font-medium">Delivery Address:</div>
                                <div className="text-muted-foreground">{order.deliveryAddress}</div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Wishlist Tab */}
          <TabsContent value="wishlist" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>My Wishlist</CardTitle>
              </CardHeader>
              <CardContent>
                {wishlistLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="h-48 bg-muted rounded-lg animate-pulse"></div>
                    ))}
                  </div>
                ) : wishlist?.length === 0 ? (
                  <div className="text-center py-8">
                    <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Your wishlist is empty</h3>
                    <p className="text-muted-foreground mb-4">
                      Save products you like for later
                    </p>
                    <Button onClick={() => window.location.href = '/products'} data-testid="button-browse-products">
                      Browse Products
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {wishlist?.map((item: any) => (
                      <Card key={item.id} className="border">
                        <CardContent className="p-4">
                          <div className="aspect-square bg-muted rounded-lg mb-3 flex items-center justify-center">
                            <Package className="h-8 w-8 text-muted-foreground" />
                          </div>
                          <h4 className="font-semibold mb-2" data-testid={`text-wishlist-item-${item.id}`}>
                            Wishlist Item
                          </h4>
                          <div className="flex items-center justify-between">
                            <Button size="sm" data-testid={`button-add-to-cart-${item.id}`}>
                              Add to Cart
                            </Button>
                            <Button variant="ghost" size="sm" data-testid={`button-remove-wishlist-${item.id}`}>
                              Remove
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      type="text"
                      value={user.firstName || ''}
                      readOnly
                      data-testid="input-first-name"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      type="text"
                      value={user.lastName || ''}
                      readOnly
                      data-testid="input-last-name"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={user.email}
                      readOnly
                      data-testid="input-email"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <div className="flex items-center space-x-3 p-4 bg-muted/50 rounded-lg">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div className="text-sm">
                      <div className="font-medium">Account Status</div>
                      <div className="text-muted-foreground">
                        Active customer since {new Date().toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
}
