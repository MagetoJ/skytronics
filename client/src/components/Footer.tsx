export default function Footer() {
  return (
    <footer className="bg-foreground text-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <i className="fas fa-desktop text-primary-foreground text-lg"></i>
              </div>
              <div>
                <h3 className="text-lg font-bold">PC Worx</h3>
                <p className="text-sm text-muted">Electronics Kenya</p>
              </div>
            </div>
            <p className="text-sm text-muted">
              Leading electronics shop in Nairobi. Trusted since 2020 for quality electronics, cash on delivery, and excellent customer service across Kenya.
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-muted hover:text-background">About Us</a></li>
              <li><a href="#" className="text-muted hover:text-background">Contact</a></li>
              <li><a href="#" className="text-muted hover:text-background">Shipping Info</a></li>
              <li><a href="#" className="text-muted hover:text-background">Returns</a></li>
              <li><a href="#" className="text-muted hover:text-background">Warranty</a></li>
            </ul>
          </div>
          
          {/* Categories */}
          <div>
            <h4 className="font-semibold mb-4">Categories</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/products?category=smartphones" className="text-muted hover:text-background">Smartphones</a></li>
              <li><a href="/products?category=laptops" className="text-muted hover:text-background">Laptops</a></li>
              <li><a href="/products?category=tvs" className="text-muted hover:text-background">Smart TVs</a></li>
              <li><a href="/products?category=gaming" className="text-muted hover:text-background">Gaming</a></li>
              <li><a href="/products?category=appliances" className="text-muted hover:text-background">Home Appliances</a></li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-3">
                <i className="fas fa-map-marker-alt text-primary"></i>
                <span className="text-muted">Krishna Center, Westlands, Nairobi</span>
              </div>
              <div className="flex items-center space-x-3">
                <i className="fas fa-phone text-primary"></i>
                <span className="text-muted">0717 888 333</span>
              </div>
              <div className="flex items-center space-x-3">
                <i className="fas fa-envelope text-primary"></i>
                <span className="text-muted">info@pcworx.ke</span>
              </div>
            </div>
            
            {/* Social Links */}
            <div className="flex space-x-4 mt-4">
              <a href="#" className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                <i className="fab fa-facebook-f text-primary"></i>
              </a>
              <a href="#" className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                <i className="fab fa-twitter text-primary"></i>
              </a>
              <a href="#" className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                <i className="fab fa-instagram text-primary"></i>
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-muted/20 mt-8 pt-8 text-center">
          <p className="text-sm text-muted">
            © 2024 PC Worx Kenya. All rights reserved. | 
            <a href="#" className="text-primary hover:underline">Privacy Policy</a> | 
            <a href="#" className="text-primary hover:underline">Terms of Service</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
