import { useEffect } from 'react';
import { Link } from 'wouter';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';

// Helper function to normalize image URLs
const normalizeImageUrl = (imageUrl: string | null | undefined): string | null => {
  if (!imageUrl) return null;
  
  // Fix malformed object storage URLs
  if (imageUrl.startsWith('https://public-objects/')) {
    return imageUrl.replace('https://public-objects/', '/public-objects/');
  }
  
  // Return as-is for valid URLs
  return imageUrl;
};

export default function Cart() {
  const { items, updateQuantity, removeFromCart, getTotal, getItemCount } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    document.title = 'Shopping Cart | PC Worx Kenya';
  }, []);

  const formatPrice = (price: string) => {
    return `KSh ${Number(price).toLocaleString()}`;
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Card className="max-w-md mx-auto text-center p-8">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
            <p className="text-muted-foreground mb-6">
              Looks like you haven't added any electronics to your cart yet.
            </p>
            <Link href="/products">
              <Button data-testid="button-shop-now">Shop Now</Button>
            </Link>
          </Card>
        </div>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <h1 className="text-3xl font-bold mb-6" data-testid="text-cart-title">
              Shopping Cart ({getItemCount()} items)
            </h1>

            {items.map((item) => (
              <Card key={item.productId}>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <img
                      src={normalizeImageUrl(item.imageUrl) || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150'}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                      data-testid={`img-cart-item-${item.productId}`}
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150';
                      }}
                    />
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg" data-testid={`text-cart-item-name-${item.productId}`}>
                        {item.name}
                      </h3>
                      <p className="text-xl font-bold text-primary" data-testid={`text-cart-item-price-${item.productId}`}>
                        {formatPrice(item.price)}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        data-testid={`button-decrease-${item.productId}`}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      
                      <Input
                        type="number"
                        min="1"
                        max={item.stock}
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.productId, parseInt(e.target.value) || 1)}
                        className="w-16 text-center"
                        data-testid={`input-quantity-${item.productId}`}
                      />
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                        data-testid={`button-increase-${item.productId}`}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFromCart(item.productId)}
                      className="text-destructive hover:text-destructive"
                      data-testid={`button-remove-${item.productId}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-semibold" data-testid="text-subtotal">
                    {formatPrice(getTotal().toString())}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span>Delivery:</span>
                  <span className="font-semibold text-accent">Free</span>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-primary" data-testid="text-total">
                      {formatPrice(getTotal().toString())}
                    </span>
                  </div>
                </div>

                {user ? (
                  <Link href="/checkout">
                    <Button size="lg" className="w-full" data-testid="button-proceed-checkout">
                      Proceed to Checkout
                    </Button>
                  </Link>
                ) : (
                  <div className="space-y-2">
                    <Link href="/login">
                      <Button size="lg" className="w-full" data-testid="button-login-to-checkout">
                        Login to Checkout
                      </Button>
                    </Link>
                    <p className="text-xs text-muted-foreground text-center">
                      New customer? <Link href="/register" className="text-primary hover:underline">Create account</Link>
                    </p>
                  </div>
                )}

                <div className="pt-4 space-y-2 text-xs text-muted-foreground">
                  <p>✓ Cash on Delivery available</p>
                  <p>✓ 1 Year warranty included</p>
                  <p>✓ Free delivery in Nairobi</p>
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
