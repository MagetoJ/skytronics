import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { insertUserSchema, insertProductSchema, insertOrderSchema, insertReviewSchema } from "@shared/schema";

const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key";

// Middleware to verify JWT token
const authenticateToken = async (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const user = await storage.getUser(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

// Middleware to verify admin role
const requireAdmin = (req: any, res: any, next: any) => {
  if (!req.user || (req.user.adminRole !== 'standard_admin' && req.user.adminRole !== 'main_admin')) {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

// Middleware to verify main admin role
const requireMainAdmin = (req: any, res: any, next: any) => {
  if (!req.user || req.user.adminRole !== 'main_admin') {
    return res.status(403).json({ message: 'Main admin access required' });
  }
  next();
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post("/api/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash password
      const passwordHash = await bcrypt.hash(userData.passwordHash, 10);
      
      const user = await storage.createUser({
        ...userData,
        passwordHash,
        adminRole: "none"
      });

      res.status(201).json({ message: "User created successfully", userId: user.id });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(400).json({ message: "Invalid registration data" });
    }
  });

  app.post("/api/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const validPassword = await bcrypt.compare(password, user.passwordHash);
      if (!validPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
      
      res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          adminRole: user.adminRole
        }
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post("/api/admin/login", async (req, res) => {
    try {
      const { email, password, securityKey } = req.body;
      
      const user = await storage.getUserByEmail(email);
      if (!user || (user.adminRole !== 'standard_admin' && user.adminRole !== 'main_admin')) {
        return res.status(401).json({ message: "Invalid admin credentials" });
      }

      const validPassword = await bcrypt.compare(password, user.passwordHash);
      if (!validPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // For main admin, check if this is first login (no security key set)
      if (user.adminRole === 'main_admin' && !user.securityKey) {
        // Set the security key for future logins
        await storage.updateUser(user.id, { securityKey });
      } else if (user.securityKey && user.securityKey !== securityKey) {
        return res.status(401).json({ message: "Invalid security key" });
      }

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
      
      res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          adminRole: user.adminRole
        }
      });
    } catch (error) {
      console.error("Admin login error:", error);
      res.status(500).json({ message: "Admin login failed" });
    }
  });

  // Product routes
  app.get("/api/products", async (req, res) => {
    try {
      const { search, category, sort } = req.query;
      let products;

      if (search) {
        products = await storage.searchProducts(search as string);
      } else if (category) {
        products = await storage.getProductsByCategory(category as string);
      } else {
        products = await storage.getAllProducts();
      }

      // Sort products if requested
      if (sort) {
        switch (sort) {
          case 'price_asc':
            products.sort((a, b) => Number(a.price) - Number(b.price));
            break;
          case 'price_desc':
            products.sort((a, b) => Number(b.price) - Number(a.price));
            break;
          case 'name':
            products.sort((a, b) => a.name.localeCompare(b.name));
            break;
          case 'rating':
            products.sort((a, b) => Number(b.averageRating) - Number(a.averageRating));
            break;
        }
      }

      res.json(products);
    } catch (error) {
      console.error("Products fetch error:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/products/featured", async (req, res) => {
    try {
      const products = await storage.getFeaturedProducts();
      res.json(products);
    } catch (error) {
      console.error("Featured products fetch error:", error);
      res.status(500).json({ message: "Failed to fetch featured products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error("Product fetch error:", error);
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  app.post("/api/products", authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(productData);
      
      // Log admin activity
      await storage.logAdminActivity({
        adminId: req.user.id,
        actionType: "Product Added",
        actionDetails: { productName: product.name, productId: product.id }
      });

      res.status(201).json(product);
    } catch (error) {
      console.error("Product creation error:", error);
      res.status(400).json({ message: "Invalid product data" });
    }
  });

  app.put("/api/products/:id", authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      const productData = insertProductSchema.partial().parse(req.body);
      const product = await storage.updateProduct(req.params.id, productData);
      
      // Log admin activity
      await storage.logAdminActivity({
        adminId: req.user.id,
        actionType: "Product Updated",
        actionDetails: { productName: product.name, productId: product.id }
      });

      res.json(product);
    } catch (error) {
      console.error("Product update error:", error);
      res.status(400).json({ message: "Failed to update product" });
    }
  });

  app.delete("/api/products/:id", authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      await storage.deleteProduct(req.params.id);
      
      // Log admin activity
      await storage.logAdminActivity({
        adminId: req.user.id,
        actionType: "Product Deleted",
        actionDetails: { productName: product.name, productId: product.id }
      });

      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      console.error("Product deletion error:", error);
      res.status(500).json({ message: "Failed to delete product" });
    }
  });

  // Order routes
  app.post("/api/orders", authenticateToken, async (req: any, res) => {
    try {
      const { items, customerName, deliveryAddress, contactNumber } = req.body;
      
      // Calculate total
      let total = 0;
      for (const item of items) {
        const product = await storage.getProduct(item.productId);
        if (!product) {
          return res.status(400).json({ message: `Product ${item.productId} not found` });
        }
        if (product.stock < item.quantity) {
          return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
        }
        total += Number(product.price) * item.quantity;
      }

      // Create order
      const order = await storage.createOrder({
        userId: req.user.id,
        customerName,
        deliveryAddress,
        contactNumber,
        total: total.toString(),
        status: "pending"
      });

      // Create order items and update stock
      for (const item of items) {
        const product = await storage.getProduct(item.productId);
        await storage.createOrderItem({
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          priceAtTimeOfOrder: product!.price
        });

        // Update stock
        await storage.updateProduct(item.productId, {
          stock: product!.stock - item.quantity
        });
      }

      res.status(201).json(order);
    } catch (error) {
      console.error("Order creation error:", error);
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  app.get("/api/users/:id/orders", authenticateToken, async (req: any, res) => {
    try {
      if (req.user.id !== req.params.id && req.user.adminRole === 'none') {
        return res.status(403).json({ message: "Access denied" });
      }

      const orders = await storage.getUserOrders(req.params.id);
      res.json(orders);
    } catch (error) {
      console.error("User orders fetch error:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.get("/api/orders/all", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const orders = await storage.getAllOrders();
      res.json(orders);
    } catch (error) {
      console.error("All orders fetch error:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.put("/api/orders/:id/status", authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      const { status } = req.body;
      const order = await storage.updateOrderStatus(req.params.id, status);
      
      // Log admin activity
      await storage.logAdminActivity({
        adminId: req.user.id,
        actionType: "Order Status Changed",
        actionDetails: { orderId: order.id, newStatus: status }
      });

      res.json(order);
    } catch (error) {
      console.error("Order status update error:", error);
      res.status(500).json({ message: "Failed to update order status" });
    }
  });

  // Review routes
  app.get("/api/products/:id/reviews", async (req, res) => {
    try {
      const reviews = await storage.getProductReviews(req.params.id);
      res.json(reviews);
    } catch (error) {
      console.error("Reviews fetch error:", error);
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  app.post("/api/products/:id/reviews", authenticateToken, async (req: any, res) => {
    try {
      const { rating, comment } = req.body;
      const review = await storage.createReview({
        productId: req.params.id,
        userId: req.user.id,
        rating,
        comment
      });
      res.status(201).json(review);
    } catch (error) {
      console.error("Review creation error:", error);
      res.status(500).json({ message: "Failed to create review" });
    }
  });

  // Wishlist routes
  app.get("/api/users/:id/wishlist", authenticateToken, async (req: any, res) => {
    try {
      if (req.user.id !== req.params.id && req.user.adminRole === 'none') {
        return res.status(403).json({ message: "Access denied" });
      }

      const wishlist = await storage.getUserWishlist(req.params.id);
      res.json(wishlist);
    } catch (error) {
      console.error("Wishlist fetch error:", error);
      res.status(500).json({ message: "Failed to fetch wishlist" });
    }
  });

  app.post("/api/wishlist", authenticateToken, async (req: any, res) => {
    try {
      const { productId } = req.body;
      const wishlist = await storage.addToWishlist({
        userId: req.user.id,
        productId
      });
      res.status(201).json(wishlist);
    } catch (error) {
      console.error("Wishlist add error:", error);
      res.status(500).json({ message: "Failed to add to wishlist" });
    }
  });

  app.delete("/api/wishlist/:productId", authenticateToken, async (req: any, res) => {
    try {
      await storage.removeFromWishlist(req.user.id, req.params.productId);
      res.json({ message: "Removed from wishlist" });
    } catch (error) {
      console.error("Wishlist remove error:", error);
      res.status(500).json({ message: "Failed to remove from wishlist" });
    }
  });

  // Admin-only routes
  app.post("/api/admin/create-standard-admin", authenticateToken, requireMainAdmin, async (req: any, res) => {
    try {
      const { email, password, securityKey } = req.body;
      
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      
      const admin = await storage.createUser({
        email,
        passwordHash,
        adminRole: "standard_admin",
        securityKey
      });

      // Log admin activity
      await storage.logAdminActivity({
        adminId: req.user.id,
        actionType: "Admin Created",
        actionDetails: { adminEmail: admin.email, adminId: admin.id }
      });

      res.status(201).json({ message: "Standard admin created successfully" });
    } catch (error) {
      console.error("Admin creation error:", error);
      res.status(500).json({ message: "Failed to create admin" });
    }
  });

  app.get("/api/users/all", authenticateToken, requireMainAdmin, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error("Users fetch error:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.delete("/api/users/:id", authenticateToken, requireMainAdmin, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      await storage.deleteUser(req.params.id);
      
      // Log admin activity
      await storage.logAdminActivity({
        adminId: req.user.id,
        actionType: "User Deleted",
        actionDetails: { userEmail: user.email, userId: user.id }
      });

      res.json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("User deletion error:", error);
      res.status(500).json({ message: "Failed to delete user" });
    }
  });

  app.put("/api/users/:id/role", authenticateToken, requireMainAdmin, async (req: any, res) => {
    try {
      const { adminRole } = req.body;
      const user = await storage.updateUser(req.params.id, { adminRole });
      
      // Log admin activity
      await storage.logAdminActivity({
        adminId: req.user.id,
        actionType: "User Role Changed",
        actionDetails: { userEmail: user.email, newRole: adminRole }
      });

      res.json(user);
    } catch (error) {
      console.error("User role update error:", error);
      res.status(500).json({ message: "Failed to update user role" });
    }
  });

  app.get("/api/reports/revenue", authenticateToken, requireMainAdmin, async (req, res) => {
    try {
      const stats = await storage.getRevenueStats();
      res.json(stats);
    } catch (error) {
      console.error("Revenue stats error:", error);
      res.status(500).json({ message: "Failed to fetch revenue stats" });
    }
  });

  app.get("/api/reports/products/download", authenticateToken, requireMainAdmin, async (req, res) => {
    try {
      const products = await storage.getAllProducts();
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename=products.json');
      res.json(products);
    } catch (error) {
      console.error("Products download error:", error);
      res.status(500).json({ message: "Failed to download products" });
    }
  });

  app.get("/api/admin/activity-log", authenticateToken, requireMainAdmin, async (req, res) => {
    try {
      const logs = await storage.getAdminActivityLog();
      res.json(logs);
    } catch (error) {
      console.error("Activity log fetch error:", error);
      res.status(500).json({ message: "Failed to fetch activity log" });
    }
  });

  app.get("/api/reports/top-products", authenticateToken, requireMainAdmin, async (req, res) => {
    try {
      const topProducts = await storage.getTopProducts();
      res.json(topProducts);
    } catch (error) {
      console.error("Top products fetch error:", error);
      res.status(500).json({ message: "Failed to fetch top products" });
    }
  });

  // SEO routes
  app.get("/sitemap.xml", async (req, res) => {
    try {
      const products = await storage.getAllProducts();
      const baseUrl = `https://${req.get('host')}`;
      
      let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/products</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <priority>0.8</priority>
  </url>`;

      for (const product of products) {
        sitemap += `
  <url>
    <loc>${baseUrl}/products/${product.id}</loc>
    <lastmod>${product.updatedAt?.toISOString() || new Date().toISOString()}</lastmod>
    <priority>0.6</priority>
  </url>`;
      }

      sitemap += `
</urlset>`;

      res.setHeader('Content-Type', 'application/xml');
      res.send(sitemap);
    } catch (error) {
      console.error("Sitemap generation error:", error);
      res.status(500).json({ message: "Failed to generate sitemap" });
    }
  });

  app.get("/robots.txt", (req, res) => {
    const robotsTxt = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /dashboard/
Disallow: /api/

Sitemap: https://${req.get('host')}/sitemap.xml`;

    res.setHeader('Content-Type', 'text/plain');
    res.send(robotsTxt);
  });

  // Create main admin if it doesn't exist
  const createMainAdmin = async () => {
    try {
      const existingAdmin = await storage.getUserByEmail("jabezmageto78@gmail.com");
      if (!existingAdmin) {
        const passwordHash = await bcrypt.hash("lokeshen@58", 10);
        await storage.createUser({
          email: "jabezmageto78@gmail.com",
          passwordHash,
          adminRole: "main_admin",
          firstName: "Main",
          lastName: "Admin"
        });
        console.log("Main admin account created");
      }
    } catch (error) {
      console.error("Failed to create main admin:", error);
    }
  };

  // Initialize main admin
  await createMainAdmin();

  const httpServer = createServer(app);
  return httpServer;
}
