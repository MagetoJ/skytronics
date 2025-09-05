import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import AdminLayout from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { 
  BarChart3, 
  Package, 
  ShoppingBag, 
  Users, 
  FileText, 
  Activity,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

export default function AdminDashboard() {
  const { user, token } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [isAdminDialogOpen, setIsAdminDialogOpen] = useState(false);

  // Product form state
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: '',
    stock: '',
    category: '',
    brand: '',
    featured: false
  });

  // Admin form state
  const [adminForm, setAdminForm] = useState({
    email: '',
    password: ''
  });

  useEffect(() => {
    document.title = 'Admin Dashboard - SKYTRONIQX Kenya';
  }, []);

  // Queries
  const { data: stats } = useQuery({
    queryKey: ['/api/reports/revenue'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/reports/revenue');
      return await response.json();
    },
    enabled: !!token && user?.adminRole === 'main_admin'
  });

  const { data: products } = useQuery({
    queryKey: ['/api/products'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/products');
      return await response.json();
    }
  });

  const { data: orders } = useQuery({
    queryKey: ['/api/orders/all'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/orders/all');
      return await response.json();
    },
    enabled: !!token
  });

  const { data: allUsers } = useQuery({
    queryKey: ['/api/users/all'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/users/all');
      return await response.json();
    },
    enabled: !!token && user?.adminRole === 'main_admin'
  });

  const { data: topProducts } = useQuery({
    queryKey: ['/api/reports/top-products'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/reports/top-products');
      return await response.json();
    },
    enabled: !!token && user?.adminRole === 'main_admin'
  });

  const { data: activityLog } = useQuery({
    queryKey: ['/api/admin/activity-log'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/admin/activity-log');
      return await response.json();
    },
    enabled: !!token && user?.adminRole === 'main_admin'
  });

  // Mutations
  const createProductMutation = useMutation({
    mutationFn: async (productData: any) => {
      await apiRequest('POST', '/api/products', productData);
    },
    onSuccess: () => {
      toast({ title: "Product created successfully" });
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      setIsProductDialogOpen(false);
      resetProductForm();
    },
    onError: () => {
      toast({ title: "Failed to create product", variant: "destructive" });
    }
  });

  const updateProductMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      await apiRequest('PUT', `/api/products/${id}`, data);
    },
    onSuccess: () => {
      toast({ title: "Product updated successfully" });
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      setIsProductDialogOpen(false);
      resetProductForm();
    },
    onError: () => {
      toast({ title: "Failed to update product", variant: "destructive" });
    }
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest('DELETE', `/api/products/${id}`);
    },
    onSuccess: () => {
      toast({ title: "Product deleted successfully" });
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
    },
    onError: () => {
      toast({ title: "Failed to delete product", variant: "destructive" });
    }
  });

  const updateOrderStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: string }) => {
      await apiRequest('PUT', `/api/orders/${orderId}/status`, { status });
    },
    onSuccess: () => {
      toast({ title: "Order status updated" });
      queryClient.invalidateQueries({ queryKey: ['/api/orders/all'] });
    },
    onError: () => {
      toast({ title: "Failed to update order status", variant: "destructive" });
    }
  });

  const createAdminMutation = useMutation({
    mutationFn: async (adminData: any) => {
      await apiRequest('POST', '/api/admin/create-standard-admin', { email: adminData.email, password: adminData.password });
    },
    onSuccess: () => {
      toast({ title: "Admin created successfully" });
      queryClient.invalidateQueries({ queryKey: ['/api/users/all'] });
      setIsAdminDialogOpen(false);
      setAdminForm({ email: '', password: '' });
    },
    onError: () => {
      toast({ title: "Failed to create admin", variant: "destructive" });
    }
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      await apiRequest('DELETE', `/api/users/${userId}`);
    },
    onSuccess: () => {
      toast({ title: "User deleted successfully" });
      queryClient.invalidateQueries({ queryKey: ['/api/users/all'] });
    },
    onError: () => {
      toast({ title: "Failed to delete user", variant: "destructive" });
    }
  });

  // Helper functions
  const resetProductForm = () => {
    setProductForm({
      name: '',
      description: '',
      price: '',
      imageUrl: '',
      stock: '',
      category: '',
      brand: '',
      featured: false
    });
    setEditingProduct(null);
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name || '',
      description: product.description || '',
      price: product.price || '',
      imageUrl: product.imageUrl || '',
      stock: product.stock?.toString() || '',
      category: product.category || '',
      brand: product.brand || '',
      featured: product.featured || false
    });
    setIsProductDialogOpen(true);
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const productData = {
      ...productForm,
      price: productForm.price,
      stock: parseInt(productForm.stock) || 0
    };

    if (editingProduct) {
      updateProductMutation.mutate({ id: editingProduct.id, data: productData });
    } else {
      createProductMutation.mutate(productData);
    }
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createAdminMutation.mutate(adminForm);
  };

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

  const downloadProducts = async () => {
    try {
      const response = await apiRequest('GET', '/api/products');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'products.json';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      toast({ title: "Products downloaded successfully" });
    } catch (error) {
      toast({ title: "Failed to download products", variant: "destructive" });
    }
  };

  return (
    <AdminLayout>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="dashboard" className="flex items-center space-x-2" data-testid="tab-admin-dashboard">
            <BarChart3 className="h-4 w-4" />
            <span>Dashboard</span>
          </TabsTrigger>
          <TabsTrigger value="products" className="flex items-center space-x-2" data-testid="tab-admin-products">
            <Package className="h-4 w-4" />
            <span>Products</span>
          </TabsTrigger>
          <TabsTrigger value="orders" className="flex items-center space-x-2" data-testid="tab-admin-orders">
            <ShoppingBag className="h-4 w-4" />
            <span>Orders</span>
          </TabsTrigger>
          {user?.adminRole === 'main_admin' && (
            <>
              <TabsTrigger value="users" className="flex items-center space-x-2" data-testid="tab-admin-users">
                <Users className="h-4 w-4" />
                <span>Users</span>
              </TabsTrigger>
              <TabsTrigger value="reports" className="flex items-center space-x-2" data-testid="tab-admin-reports">
                <FileText className="h-4 w-4" />
                <span>Reports</span>
              </TabsTrigger>
              <TabsTrigger value="activity" className="flex items-center space-x-2" data-testid="tab-admin-activity">
                <Activity className="h-4 w-4" />
                <span>Activity</span>
              </TabsTrigger>
            </>
          )}
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Revenue</p>
                    <p className="text-2xl font-bold text-primary" data-testid="text-total-revenue">
                      {stats ? formatPrice(stats.totalRevenue.toString()) : 'Loading...'}
                    </p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Orders</p>
                    <p className="text-2xl font-bold text-accent" data-testid="text-total-orders">
                      {stats?.totalOrders || orders?.length || 0}
                    </p>
                  </div>
                  <ShoppingBag className="h-8 w-8 text-accent" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Products</p>
                    <p className="text-2xl font-bold text-secondary" data-testid="text-total-products">
                      {products?.length || 0}
                    </p>
                  </div>
                  <Package className="h-8 w-8 text-secondary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Users</p>
                    <p className="text-2xl font-bold text-destructive" data-testid="text-total-users">
                      {allUsers?.length || 0}
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-destructive" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders?.slice(0, 5).map((order: any) => (
                    <div key={order.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium">#{order.id.slice(-8).toUpperCase()}</p>
                        <p className="text-sm text-muted-foreground">{order.customerName}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatPrice(order.total)}</p>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Low Stock Alert</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {products?.filter((product: any) => product.stock < 10).slice(0, 5).map((product: any) => (
                    <div key={product.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">{product.category}</p>
                      </div>
                      <Badge variant="destructive">
                        {product.stock} left
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Products Tab */}
        <TabsContent value="products" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Product Management</h2>
            
            <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetProductForm} data-testid="button-add-product">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleProductSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Product Name</Label>
                      <Input
                        id="name"
                        value={productForm.name}
                        onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                        required
                        data-testid="input-product-name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="brand">Brand</Label>
                      <Input
                        id="brand"
                        value={productForm.brand}
                        onChange={(e) => setProductForm({...productForm, brand: e.target.value})}
                        data-testid="input-product-brand"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={productForm.description}
                      onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                      rows={3}
                      data-testid="textarea-product-description"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="price">Price (KSh)</Label>
                      <Input
                        id="price"
                        type="number"
                        value={productForm.price}
                        onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                        required
                        data-testid="input-product-price"
                      />
                    </div>
                    <div>
                      <Label htmlFor="stock">Stock</Label>
                      <Input
                        id="stock"
                        type="number"
                        value={productForm.stock}
                        onChange={(e) => setProductForm({...productForm, stock: e.target.value})}
                        required
                        data-testid="input-product-stock"
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select value={productForm.category} onValueChange={(value) => setProductForm({...productForm, category: value})}>
                        <SelectTrigger data-testid="select-product-category">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="smartphones">Smartphones</SelectItem>
                          <SelectItem value="laptops">Laptops</SelectItem>
                          <SelectItem value="tvs">Smart TVs</SelectItem>
                          <SelectItem value="gaming">Gaming</SelectItem>
                          <SelectItem value="appliances">Home Appliances</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>Product Image</Label>
                    <div className="border border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;

                          if (file.size > 5242880) { // 5MB limit
                            toast({ title: "File too large", description: "Please select an image under 5MB", variant: "destructive" });
                            return;
                          }

                          // Convert file to base64
                          const reader = new FileReader();
                          reader.onload = async (event) => {
                            try {
                              const response = await apiRequest('POST', '/api/images/upload', {
                                filename: file.name,
                                mimeType: file.type,
                                data: event.target?.result as string,
                              });
                              const data = await response.json();
                              setProductForm({...productForm, imageUrl: data.url});
                              toast({ title: "Image uploaded successfully", description: "Your product image has been saved to database." });
                            } catch (error) {
                              toast({ title: "Failed to upload image", variant: "destructive" });
                            }
                          };
                          reader.readAsDataURL(file);
                        }}
                        className="w-full cursor-pointer"
                        data-testid="input-product-image-upload"
                      />
                      <p className="text-sm text-muted-foreground mt-2">
                        📁 Click to upload product image (max 5MB)
                      </p>
                      {productForm.imageUrl && (
                        <div className="mt-3">
                          <img 
                            src={productForm.imageUrl.startsWith('/') ? `${window.location.origin}${productForm.imageUrl}` : productForm.imageUrl}
                            alt="Product preview" 
                            className="max-w-32 max-h-32 object-cover rounded border mx-auto"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={productForm.featured}
                      onChange={(e) => setProductForm({...productForm, featured: e.target.checked})}
                      data-testid="checkbox-product-featured"
                    />
                    <Label htmlFor="featured">Featured Product</Label>
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button type="button" variant="outline" onClick={() => setIsProductDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={createProductMutation.isPending || updateProductMutation.isPending}>
                      {editingProduct ? 'Update Product' : 'Add Product'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-4 font-medium">Product</th>
                      <th className="text-left p-4 font-medium">Category</th>
                      <th className="text-left p-4 font-medium">Price</th>
                      <th className="text-left p-4 font-medium">Stock</th>
                      <th className="text-left p-4 font-medium">Status</th>
                      <th className="text-left p-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products?.map((product: any) => (
                      <tr key={product.id} className="border-t border-border">
                        <td className="p-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                              <Package className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="font-medium">{product.name}</p>
                              <p className="text-sm text-muted-foreground">{product.brand}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">{product.category}</td>
                        <td className="p-4">{formatPrice(product.price)}</td>
                        <td className="p-4">{product.stock}</td>
                        <td className="p-4">
                          <Badge variant={product.stock > 0 ? "default" : "destructive"}>
                            {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleEditProduct(product)}
                              data-testid={`button-edit-product-${product.id}`}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm" data-testid={`button-delete-product-${product.id}`}>
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Product</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete "{product.name}"? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => deleteProductMutation.mutate(product.id)}>
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Order Management</h2>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-4 font-medium">Order ID</th>
                      <th className="text-left p-4 font-medium">Customer Info</th>
                      <th className="text-left p-4 font-medium">Delivery Address</th>
                      <th className="text-left p-4 font-medium">Total</th>
                      <th className="text-left p-4 font-medium">Status</th>
                      <th className="text-left p-4 font-medium">Date</th>
                      <th className="text-left p-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders?.map((order: any) => (
                      <tr key={order.id} className="border-t border-border">
                        <td className="p-4 font-mono">#{order.id.slice(-8).toUpperCase()}</td>
                        <td className="p-4">
                          <div>
                            <p className="font-medium">{order.customerName}</p>
                            <p className="text-sm text-muted-foreground">{order.contactNumber}</p>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="text-sm">
                            <p className="text-muted-foreground">{order.deliveryAddress}</p>
                          </div>
                        </td>
                        <td className="p-4">{formatPrice(order.total)}</td>
                        <td className="p-4">
                          <Select 
                            value={order.status} 
                            onValueChange={(status) => updateOrderStatusMutation.mutate({ orderId: order.id, status })}
                          >
                            <SelectTrigger className="w-32" data-testid={`select-order-status-${order.id}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="processing">Processing</SelectItem>
                              <SelectItem value="shipped">Shipped</SelectItem>
                              <SelectItem value="delivered">Delivered</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="p-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td className="p-4">
                          <Button variant="ghost" size="sm" data-testid={`button-view-order-${order.id}`}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users Tab (Main Admin Only) */}
        {user?.adminRole === 'main_admin' && (
          <TabsContent value="users" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">User Management</h2>
              
              <Dialog open={isAdminDialogOpen} onOpenChange={setIsAdminDialogOpen}>
                <DialogTrigger asChild>
                  <Button data-testid="button-create-admin">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Admin
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Standard Admin</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAdminSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="adminEmail">Email</Label>
                      <Input
                        id="adminEmail"
                        type="email"
                        value={adminForm.email}
                        onChange={(e) => setAdminForm({...adminForm, email: e.target.value})}
                        required
                        data-testid="input-admin-form-email"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="adminPassword">Password</Label>
                      <Input
                        id="adminPassword"
                        type="password"
                        value={adminForm.password}
                        onChange={(e) => setAdminForm({...adminForm, password: e.target.value})}
                        required
                        data-testid="input-admin-form-password"
                      />
                    </div>
                    
                    <div className="flex justify-end space-x-2 pt-4">
                      <Button type="button" variant="outline" onClick={() => setIsAdminDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={createAdminMutation.isPending}>
                        Create Admin
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left p-4 font-medium">User</th>
                        <th className="text-left p-4 font-medium">Role</th>
                        <th className="text-left p-4 font-medium">Status</th>
                        <th className="text-left p-4 font-medium">Joined</th>
                        <th className="text-left p-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allUsers?.map((userData: any) => (
                        <tr key={userData.id} className="border-t border-border">
                          <td className="p-4">
                            <div>
                              <p className="font-medium">{userData.firstName} {userData.lastName}</p>
                              <p className="text-sm text-muted-foreground">{userData.email}</p>
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge variant={
                              userData.adminRole === 'main_admin' ? 'destructive' : 
                              userData.adminRole === 'standard_admin' ? 'secondary' : 'default'
                            }>
                              {userData.adminRole === 'main_admin' ? 'Main Admin' :
                               userData.adminRole === 'standard_admin' ? 'Standard Admin' : 'Customer'}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <Badge variant="default">Active</Badge>
                          </td>
                          <td className="p-4">{new Date(userData.createdAt).toLocaleDateString()}</td>
                          <td className="p-4">
                            {(userData.adminRole === 'none' || userData.adminRole === 'standard_admin') && (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="sm" data-testid={`button-delete-user-${userData.id}`}>
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete {userData.adminRole === 'standard_admin' ? 'Admin' : 'User'}</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete this {userData.adminRole === 'standard_admin' ? 'admin' : 'user'}? This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => deleteUserMutation.mutate(userData.id)}>
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* Reports Tab (Main Admin Only) */}
        {user?.adminRole === 'main_admin' && (
          <TabsContent value="reports" className="space-y-6">
            <h2 className="text-2xl font-bold">Reports & Analytics</h2>

            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Report</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total Revenue:</span>
                    <span className="font-bold text-primary" data-testid="text-revenue-total">
                      {stats ? formatPrice(stats.totalRevenue.toString()) : 'Loading...'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Orders:</span>
                    <span className="font-bold" data-testid="text-orders-total">
                      {stats?.totalOrders || 0}
                    </span>
                  </div>
                  <div className="pt-4 border-t border-border">
                    <Button onClick={downloadProducts} className="w-full" data-testid="button-download-products">
                      <Download className="h-4 w-4 mr-2" />
                      Download Products (JSON)
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {topProducts?.map((product: any, index: number) => (
                      <div key={index} className="flex justify-between">
                        <span className="text-sm">{product.productName}</span>
                        <span className="font-bold text-sm">{product.totalSold} sold</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        )}

        {/* Activity Tab (Main Admin Only) */}
        {user?.adminRole === 'main_admin' && (
          <TabsContent value="activity" className="space-y-6">
            <h2 className="text-2xl font-bold">Admin Activity Log</h2>

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left p-4 font-medium">Admin</th>
                        <th className="text-left p-4 font-medium">Action</th>
                        <th className="text-left p-4 font-medium">Details</th>
                        <th className="text-left p-4 font-medium">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activityLog?.map((log: any) => (
                        <tr key={log.id} className="border-t border-border">
                          <td className="p-4">Admin</td>
                          <td className="p-4">
                            <Badge variant="outline">{log.actionType}</Badge>
                          </td>
                          <td className="p-4 text-sm text-muted-foreground">
                            {JSON.stringify(log.actionDetails)}
                          </td>
                          <td className="p-4">{new Date(log.timestamp).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </AdminLayout>
  );
}
