import { useEffect, useState } from 'react';
import { useRoute, Link } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Heart, Star, ShoppingCart, Minus, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';

export default function ProductDetails() {
  const [, params] = useRoute('/products/:id');
  const productId = params?.id;
  const [quantity, setQuantity] = useState(1);
  const [reviewRating, setReviewRating] = useState('5');
  const [reviewComment, setReviewComment] = useState('');
  
  const { user, token } = useAuth();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: product, isLoading } = useQuery({
    queryKey: ['/api/products', productId],
    queryFn: async () => {
      const response = await api.getProduct(productId!);
      return await response.json();
    },
    enabled: !!productId
  });

  const { data: reviews } = useQuery({
    queryKey: ['/api/products', productId, 'reviews'],
    queryFn: async () => {
      const response = await api.getProductReviews(productId!);
      return await response.json();
    },
    enabled: !!productId
  });

  const reviewMutation = useMutation({
    mutationFn: async () => {
      await api.createReview(productId!, { 
        rating: parseInt(reviewRating), 
        comment: reviewComment 
      }, token!);
    },
    onSuccess: () => {
      toast({
        title: "Review submitted",
        description: "Thank you for your review!",
      });
      setReviewComment('');
      queryClient.invalidateQueries({ queryKey: ['/api/products', productId, 'reviews'] });
      queryClient.invalidateQueries({ queryKey: ['/api/products', productId] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      });
    }
  });

  useEffect(() => {
    if (product) {
      document.title = `${product.name} - ${product.category} | PC Today Kenya`;
      
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', 
          `Buy ${product.name} in Nairobi. Price: KSh ${Number(product.price).toLocaleString()}. ${product.description || ''} Cash on delivery available. Electronics shop Kenya.`
        );
      }
    }
  }, [product]);

  const handleAddToCart = () => {
    if (!product || product.stock <= 0) {
      toast({
        title: "Out of Stock",
        description: "This product is currently out of stock.",
        variant: "destructive",
      });
      return;
    }

    addToCart(product, quantity);
    toast({
      title: "Added to Cart",
      description: `${quantity} x ${product.name} added to your cart.`,
    });
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to submit a review.",
        variant: "destructive",
      });
      return;
    }
    reviewMutation.mutate();
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="w-full h-96 bg-muted rounded-lg animate-pulse"></div>
            <div className="space-y-4">
              <div className="h-8 bg-muted rounded animate-pulse"></div>
              <div className="h-4 bg-muted rounded w-2/3 animate-pulse"></div>
              <div className="h-32 bg-muted rounded animate-pulse"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="p-12 text-center">
            <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
            <p className="text-muted-foreground mb-4">
              The product you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/products">
              <Button data-testid="button-back-to-products">Back to Products</Button>
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
        {/* Breadcrumb */}
        <nav className="flex text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/products" className="hover:text-foreground">Products</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="space-y-4">
            <img
              src={product.imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600'}
              alt={product.name}
              className="w-full rounded-lg"
              data-testid="img-product-main"
            />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-3xl font-bold text-foreground" data-testid="text-product-title">
                  {product.name}
                </h1>
                {user && (
                  <Button variant="ghost" size="sm" data-testid="button-add-to-wishlist">
                    <Heart className="h-5 w-5" />
                  </Button>
                )}
              </div>

              {product.averageRating && Number(product.averageRating) > 0 && (
                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex">
                    {renderStars(product.averageRating)}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    ({Number(product.averageRating).toFixed(1)} out of 5)
                  </span>
                </div>
              )}

              <div className="space-y-2">
                <div className="text-3xl font-bold text-primary" data-testid="text-product-price">
                  {formatPrice(product.price)}
                </div>
                <Badge 
                  variant={product.stock > 0 ? "default" : "destructive"}
                  data-testid="badge-product-stock"
                >
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
                </Badge>
              </div>
            </div>

            {/* Product Description */}
            {product.description && (
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground" data-testid="text-product-description">
                  {product.description}
                </p>
              </div>
            )}

            {/* Product Details */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Category:</span>
                <span className="ml-2 text-muted-foreground" data-testid="text-product-category">
                  {product.category}
                </span>
              </div>
              {product.brand && (
                <div>
                  <span className="font-medium">Brand:</span>
                  <span className="ml-2 text-muted-foreground" data-testid="text-product-brand">
                    {product.brand}
                  </span>
                </div>
              )}
            </div>

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <label className="font-medium">Quantity:</label>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    data-testid="button-decrease-quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-medium" data-testid="text-quantity">
                    {quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                    data-testid="button-increase-quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                size="lg"
                className="w-full"
                data-testid="button-add-to-cart-main"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16 space-y-8">
          <h2 className="text-2xl font-bold">Customer Reviews</h2>

          {/* Submit Review Form */}
          {user && (
            <Card>
              <CardHeader>
                <CardTitle>Write a Review</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Rating</label>
                    <Select value={reviewRating} onValueChange={setReviewRating}>
                      <SelectTrigger className="w-32" data-testid="select-review-rating">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5 Stars</SelectItem>
                        <SelectItem value="4">4 Stars</SelectItem>
                        <SelectItem value="3">3 Stars</SelectItem>
                        <SelectItem value="2">2 Stars</SelectItem>
                        <SelectItem value="1">1 Star</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Comment</label>
                    <Textarea
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Share your experience with this product..."
                      rows={4}
                      data-testid="textarea-review-comment"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    disabled={reviewMutation.isPending}
                    data-testid="button-submit-review"
                  >
                    {reviewMutation.isPending ? 'Submitting...' : 'Submit Review'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Reviews List */}
          <div className="space-y-4">
            {reviews?.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">No reviews yet. Be the first to review this product!</p>
              </Card>
            ) : (
              reviews?.map((review: any) => (
                <Card key={review.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div className="flex">
                          {renderStars(review.rating.toString())}
                        </div>
                        <span className="font-medium">{review.rating}/5</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {review.comment && (
                      <p className="text-muted-foreground">{review.comment}</p>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
