import { useState, useEffect } from 'react';
import { useLocation, Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Search } from 'lucide-react';
import { api } from '@/lib/api';

export default function Products() {
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('');

  // Parse URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(location.split('?')[1] || '');
    setSearchQuery(urlParams.get('search') || '');
    setSelectedCategory(urlParams.get('category') || '');
    setSortBy(urlParams.get('sort') || '');

    // Set SEO meta tags
    const categoryTitle = urlParams.get('category') 
      ? `${urlParams.get('category')} - ` 
      : '';
    document.title = `${categoryTitle}Electronics Shop Nairobi | PC Today Kenya`;
  }, [location]);

  const { data: products, isLoading, refetch } = useQuery({
    queryKey: ['/api/products', searchQuery, selectedCategory, sortBy],
    queryFn: async () => {
      const response = await api.getProducts({
        search: searchQuery || undefined,
        category: selectedCategory === 'all' ? undefined : selectedCategory || undefined,
        sort: sortBy === 'default' ? undefined : sortBy || undefined
      });
      return await response.json();
    }
  });

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'smartphones', label: 'Smartphones' },
    { value: 'laptops', label: 'Laptops' },
    { value: 'tvs', label: 'Smart TVs' },
    { value: 'gaming', label: 'Gaming' },
    { value: 'appliances', label: 'Home Appliances' }
  ];

  const priceRanges = [
    { value: 'all', label: 'All Prices' },
    { value: 'under-20000', label: 'Under KSh 20,000' },
    { value: '20000-50000', label: 'KSh 20,000 - 50,000' },
    { value: 'above-50000', label: 'Above KSh 50,000' }
  ];

  const sortOptions = [
    { value: 'default', label: 'Default' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'name', label: 'Name A-Z' },
    { value: 'rating', label: 'Highest Rated' }
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    refetch();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Electronics Store</h1>
          <p className="text-muted-foreground">
            Browse our complete collection of electronics available in Nairobi
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="p-6 mb-8">
          <div className="space-y-4">
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search electronics in Nairobi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4"
                  data-testid="input-product-search"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </form>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger data-testid="select-category">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger data-testid="select-price-range">
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent>
                  {priceRanges.map((range) => (
                    <SelectItem key={range.value} value={range.value}>
                      {range.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger data-testid="select-sort">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button onClick={() => refetch()} data-testid="button-apply-filters">
                Apply Filters
              </Button>
            </div>
          </div>
        </Card>

        {/* Products Grid */}
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              {searchQuery ? `Search results for "${searchQuery}"` : 'All Products'}
            </h2>
            <span className="text-muted-foreground" data-testid="text-product-count">
              {products?.length || 0} products found
            </span>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="p-4 space-y-4">
                <div className="w-full h-48 bg-muted rounded-lg animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded animate-pulse"></div>
                  <div className="h-4 bg-muted rounded w-2/3 animate-pulse"></div>
                </div>
              </Card>
            ))}
          </div>
        ) : products?.length === 0 ? (
          <Card className="p-12 text-center">
            <h3 className="text-lg font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search criteria or browse all categories
            </p>
            <Link href="/products">
              <Button data-testid="button-browse-all">Browse All Products</Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products?.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
