import React from 'react';
import { Link } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Star, ShoppingCart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: string;
  name: string;
  description?: string;
  price: string;
  imageUrl?: string;
  stock: number;
  category: string;
  brand?: string;
  averageRating?: string;
  featured?: boolean;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    if (product.stock <= 0) {
      toast({
        title: "Out of Stock",
        description: "This product is currently out of stock.",
        variant: "destructive",
      });
      return;
    }

    addToCart(product);
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const formatPrice = (price: string) => {
    return `KSh ${Number(price).toLocaleString()}`;
  };

  const renderStars = (rating: string) => {
    const numRating = Number(rating) || 0;
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`h-4 w-4 ${i <= numRating ? 'text-secondary fill-current' : 'text-gray-300'}`}
        />
      );
    }
    return stars;
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow" data-testid={`card-product-${product.id}`}>
      <div className="relative">
        <img
          src={product.imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300'}
          alt={product.name}
          className="w-full h-48 object-cover"
          data-testid={`img-product-${product.id}`}
        />
        {product.featured && (
          <Badge className="absolute top-2 left-2 bg-secondary text-secondary-foreground">
            Featured
          </Badge>
        )}
      </div>
      
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <h4 className="font-semibold text-card-foreground line-clamp-2" data-testid={`text-product-name-${product.id}`}>
            {product.name}
          </h4>
          {user && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-muted-foreground hover:text-destructive p-1"
              data-testid={`button-wishlist-${product.id}`}
            >
              <Heart className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        {product.averageRating && Number(product.averageRating) > 0 && (
          <div className="flex items-center space-x-2">
            <div className="flex">
              {renderStars(product.averageRating)}
            </div>
            <span className="text-sm text-muted-foreground" data-testid={`text-rating-${product.id}`}>
              ({Number(product.averageRating).toFixed(1)})
            </span>
          </div>
        )}
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-primary" data-testid={`text-price-${product.id}`}>
              {formatPrice(product.price)}
            </span>
            <Badge 
              variant={product.stock > 0 ? "default" : "destructive"}
              data-testid={`badge-stock-${product.id}`}
            >
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
            </Badge>
          </div>
        </div>
        
        <div className="space-y-2">
          <Button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className="w-full"
            data-testid={`button-add-to-cart-${product.id}`}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add to Cart
          </Button>
          <Link href={`/products/${product.id}`}>
            <Button variant="outline" className="w-full" data-testid={`button-view-details-${product.id}`}>
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
