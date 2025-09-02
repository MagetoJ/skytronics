# PC Worx - Electronics E-Commerce Platform

A modern Progressive Web App (PWA) for selling electronics in Kenya, built with React, Node.js, and PostgreSQL.

## Features

- 🛒 Full e-commerce functionality with shopping cart
- 👨‍💼 Admin dashboard for product and order management
- 📱 Progressive Web App (PWA) - installable on mobile and desktop
- 🔐 JWT-based authentication with role-based access control
- 💳 Cash on delivery payment option
- 📊 Analytics and reporting for admins
- 🌐 SEO optimized for Kenya/Nairobi market
- ☁️ Cloud image storage integration

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Wouter (routing)
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **UI Components**: Radix UI, shadcn/ui
- **State Management**: React Query, Context API
- **Build Tool**: Vite
- **Deployment**: Vercel, Netlify, or local hosting

## Quick Start

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Git

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd pc-worx
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL=your_postgresql_connection_string
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=development
   ```

4. **Setup the database**
   ```bash
   npm run db:push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5000`

### Production Build

```bash
npm run build
npm start
```

## Deployment

### Vercel Deployment

1. **Push to GitHub/GitLab**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Connect your repository to Vercel
   - Add environment variables in Vercel dashboard
   - Deploy automatically on push

### Netlify Deployment

1. **Build and deploy**
   - Connect your repository to Netlify
   - Set build command: `npm run build`
   - Set publish directory: `client/dist`
   - Add environment variables in Netlify dashboard

### Local Production Hosting

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start the production server**
   ```bash
   npm start
   ```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `JWT_SECRET` | Secret key for JWT tokens | Yes |
| `NODE_ENV` | Environment (development/production) | Yes |
| `DEFAULT_OBJECT_STORAGE_BUCKET_ID` | Object storage bucket ID | No |
| `PUBLIC_OBJECT_SEARCH_PATHS` | Public object storage paths | No |
| `PRIVATE_OBJECT_DIR` | Private object storage directory | No |

## Project Structure

```
pc-today/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── contexts/       # React contexts
│   │   ├── hooks/          # Custom hooks
│   │   └── lib/            # Utility functions
│   └── public/             # Static assets
├── server/                 # Express backend
│   ├── routes.ts           # API routes
│   ├── storage.ts          # Database operations
│   └── index.ts            # Server entry point
├── shared/                 # Shared types and schemas
│   └── schema.ts           # Database schema
├── vercel.json             # Vercel configuration
├── netlify.toml            # Netlify configuration
└── package.json            # Dependencies and scripts
```

## Admin Features

- User management (create/edit/delete users and admins)
- Product management (CRUD operations)
- Order processing and status updates
- Analytics dashboard
- Activity logging

## PWA Features

- Offline functionality with service worker
- Installable on mobile and desktop
- Push notifications support
- Background sync for offline orders
- App shortcuts for quick access

## SEO Optimization

- Dynamic meta tags for products and categories
- Sitemap generation
- Robots.txt configuration
- Kenya/Nairobi market keywords
- Semantic HTML structure

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support or questions, please open an issue on the repository.