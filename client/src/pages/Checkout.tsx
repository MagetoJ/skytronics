import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

export default function Checkout() {
  const [, setLocation] = useLocation();
  const { user, token } = useAuth();
  const { items, clearCart, getTotal } = useCart();
  const { toast } = useToast();

  const [customerName, setCustomerName] = useState(user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : '');
  const [contactNumber, setContactNumber] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');

  useEffect(() => {
    document.title = 'Checkout - PC Worx Kenya';
    
    if (!user) {
      setLocation('/login');
      return;
    }

    if (items.length === 0) {
      setLocation('/cart');
      return;
    }
  }, [user, items, setLocation]);

  const orderMutation = useMutation({
    mutationFn: async () => {
      const orderData = {
        items: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity
        })),
        customerName,
        deliveryAddress,
        contactNumber
      };

      await apiRequest('POST', '/api/orders', orderData);
    },
    onSuccess: () => {
      clearCart();
      toast({
        title: "Order Placed Successfully!",
        description: "Your order has been placed. You will receive a confirmation call shortly.",
      });
      setLocation('/dashboard');
    },
    onError: (error) => {
      toast({
        title: "Order Failed",
        description: "Failed to place order. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customerName.trim() || !contactNumber.trim() || !deliveryAddress.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    orderMutation.mutate();
  };

  const formatPrice = (price: string) => {
    return `KSh ${Number(price).toLocaleString()}`;
  };

  if (!user || items.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Delivery Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="customerName">Full Name *</Label>
                    <Input
                      id="customerName"
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Enter your full name"
                      required
                      data-testid="input-customer-name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="contactNumber">Phone Number *</Label>
                    <Input
                      id="contactNumber"
                      type="tel"
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value)}
                      placeholder="+254 712 345 678"
                      required
                      data-testid="input-contact-number"
                    />
                  </div>

                  <div>
                    <Label htmlFor="deliveryAddress">Delivery Address *</Label>
                    <Textarea
                      id="deliveryAddress"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder="Enter your full delivery address including building, floor, and any landmarks"
                      rows={4}
                      required
                      data-testid="textarea-delivery-address"
                    />
                  </div>

                  <div className="pt-4">
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full"
                      disabled={orderMutation.isPending}
                      data-testid="button-place-order"
                    >
                      {orderMutation.isPending ? 'Placing Order...' : 'Place Order (Cash on Delivery)'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3 p-4 bg-accent/10 rounded-lg">
                  <i className="fas fa-money-bill-wave text-accent text-xl"></i>
                  <div>
                    <div className="font-medium">Cash on Delivery</div>
                    <div className="text-sm text-muted-foreground">
                      Pay when you receive your order
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                  <p>• Free delivery within Nairobi</p>
                  <p>• You can inspect products before payment</p>
                  <p>• Have exact change ready for smooth delivery</p>
                  <p>• Our delivery team will call before arrival</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Order Items */}
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.productId} className="flex items-center space-x-3">
                      <img
                        src={item.imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=80'}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-lg"
                        data-testid={`img-checkout-item-${item.productId}`}
                      />
                      <div className="flex-1">
                        <div className="font-medium text-sm" data-testid={`text-checkout-item-name-${item.productId}`}>
                          {item.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Qty: {item.quantity}
                        </div>
                      </div>
                      <div className="font-medium text-sm" data-testid={`text-checkout-item-total-${item.productId}`}>
                        {formatPrice((Number(item.price) * item.quantity).toString())}
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Order Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-medium" data-testid="text-checkout-subtotal">
                      {formatPrice(getTotal().toString())}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Delivery:</span>
                    <span className="font-medium text-accent">Free</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-primary" data-testid="text-checkout-total">
                      {formatPrice(getTotal().toString())}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Notice */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <i className="fas fa-shield-alt text-accent text-lg mt-1"></i>
                  <div className="text-sm">
                    <div className="font-medium mb-1">Secure Order</div>
                    <div className="text-muted-foreground">
                      Your order is secure and will be processed immediately. 
                      Our delivery team will contact you to confirm delivery details.
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
