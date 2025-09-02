import { useEffect } from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { api } from '@/lib/api';
import type { Product } from '@shared/schema';
import { Smartphone, Laptop, Tv, Home as HomeIcon, Truck, CreditCard, Shield } from 'lucide-react';

export default function Home() {
  useEffect(() => {
    document.title = 'PC Worx - Electronics Shop Nairobi | Best Electronics Store Kenya';
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'PC Worx - Leading electronics shop in Nairobi. Best prices on smartphones, laptops, TVs & home appliances in Kenya. Cash on delivery available. Shop online electronics store Kenya.');
    }
  }, []);

  const { data: featuredProducts, isLoading: isFeaturedLoading } = useQuery({
    queryKey: ['/api/products/featured'],
    queryFn: async () => {
      const response = await api.getFeaturedProducts();
      return await response.json();
    }
  });

  const categories = [
    {
      name: 'Smartphones',
      icon: Smartphone,
      description: 'iPhone, Samsung, Infinix',
      link: '/products?category=smartphones'
    },
    {
      name: 'Laptops',
      icon: Laptop,
      description: 'HP, Dell, Lenovo',
      link: '/products?category=laptops'
    },
    {
      name: 'Smart TVs',
      icon: Tv,
      description: 'LG, Samsung, Hisense',
      link: '/products?category=tvs'
    },
    {
      name: 'Home Appliances',
      icon: HomeIcon,
      description: 'Microwaves, Blenders',
      link: '/products?category=appliances'
    }
  ];

  const trustIndicators = [
    {
      icon: Truck,
      title: 'Free Delivery Nairobi',
      description: 'Free delivery within Nairobi for orders above KSh 10,000'
    },
    {
      icon: CreditCard,
      title: 'Cash on Delivery',
      description: 'Pay when you receive your order. No upfront payment required.'
    },
    {
      icon: Shield,
      title: '1 Year Warranty',
      description: 'All electronics come with manufacturer warranty and our support.'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-accent text-primary-foreground py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
                Best Electronics Shop in Nairobi
              </h2>
              <p className="text-xl text-primary-foreground/90">
                Latest smartphones, laptops, TVs & home appliances. 
                Cash on delivery across Kenya. Trusted since 2020.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/products">
                  <Button 
                    size="lg" 
                    className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
                    data-testid="button-shop-electronics"
                  >
                    Shop Electronics
                  </Button>
                </Link>
                <Link href="/products?featured=true">
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="border-primary-foreground text-primary-foreground hover:bg-white/10"
                    data-testid="button-view-deals"
                  >
                    View Deals
                  </Button>
                </Link>
              </div>
              
              {/* Trust Indicators */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 pt-4 space-y-2 sm:space-y-0">
                {trustIndicators.map((indicator, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <indicator.icon className="h-5 w-5 text-secondary" />
                    <span className="text-sm">{indicator.title}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="lg:text-right">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400" 
                  alt="Latest smartphones and electronics available in Nairobi" 
                  className="rounded-xl shadow-2xl w-full h-auto max-w-md ml-auto"
                  data-testid="img-hero"
                />
                <div className="absolute -bottom-4 -left-4 bg-white text-foreground p-4 rounded-lg shadow-lg">
                  <div className="text-sm font-medium">Starting from</div>
                  <div className="text-2xl font-bold text-primary">KSh 15,000</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section className="py-16 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">Shop by Category</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Browse our wide selection of electronics from trusted brands. All products with warranty and cash on delivery in Kenya.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Link key={index} href={category.link}>
                <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" data-testid={`card-category-${category.name.toLowerCase()}`}>
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                      <category.icon className="h-8 w-8 text-primary" />
                    </div>
                    <h4 className="font-semibold text-card-foreground">{category.name}</h4>
                    <p className="text-sm text-muted-foreground">{category.description}</p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-3xl font-bold text-foreground mb-2">Featured Electronics</h3>
              <p className="text-muted-foreground">Best selling products in Nairobi</p>
            </div>
            <Link href="/products">
              <Button variant="ghost" data-testid="button-view-all-products">
                View All Products
              </Button>
            </Link>
          </div>
          
          {isFeaturedLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="p-4 space-y-4">
                  <div className="w-full h-48 bg-muted rounded-lg animate-pulse"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded animate-pulse"></div>
                    <div className="h-4 bg-muted rounded w-2/3 animate-pulse"></div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts?.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
