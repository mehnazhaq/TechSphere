# TechSphere - IT Services & SaaS Management Platform

## Project Overview

TechSphere is a comprehensive SaaS management platform designed for IT service providers and their clients. This frontend application provides an intuitive dashboard for managing clients, services, subscriptions, support tickets, and analytics.

## Tech Stack

- **Frontend Framework:** React 18 with TypeScript
- **Build Tool:** Vite 4
- **Styling:** Tailwind CSS
- **Routing:** React Router DOM
- **Development Tools:** ESLint, PostCSS, Autoprefixer

## Features

### User Interface
- **Responsive Design:** Mobile-first approach with Tailwind CSS breakpoints
- **Modern SaaS Dashboard:** Clean, professional interface inspired by leading SaaS platforms
- **Navigation:** Sidebar navigation with collapsible menu for mobile devices

### Pages
- **Login Page:** Secure authentication with branding and form validation
- **Dashboard Overview:** Key metrics cards, performance charts, and quick actions
- **Clients Management:** Table view of clients with status indicators
- **Services Management:** Card-based layout for IT and SaaS services
- **Subscriptions:** Placeholder for subscription management
- **Support Tickets:** Placeholder for ticket management
- **Analytics:** Placeholder for detailed analytics
- **Settings:** Placeholder for application settings

## Setup Instructions

### Prerequisites
- Node.js 14.18+ (preferably 16+ for better performance)
- npm or yarn package manager

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd techsphere-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://127.0.0.1:5173/`

### Build for Production

```bash
npm run build
```

### Linting

```bash
npm run lint
```

## Project Structure

```
src/
├── components/
│   └── DashboardLayout.tsx    # Main layout component with sidebar and header
├── pages/
│   ├── LoginPage.tsx          # Login page with form
│   ├── Dashboard.tsx          # Overview dashboard
│   ├── Clients.tsx            # Clients management
│   ├── Services.tsx           # Services management
│   ├── Subscriptions.tsx      # Subscriptions placeholder
│   ├── Tickets.tsx            # Support tickets placeholder
│   ├── Analytics.tsx          # Analytics placeholder
│   └── Settings.tsx           # Settings placeholder
├── App.tsx                    # Main app component with routing
├── main.tsx                   # Application entry point
└── index.css                  # Global styles with Tailwind imports
```

## API Integration

This frontend is designed to integrate with a backend API. The following endpoints are expected:

- `POST /api/auth/login` - User authentication
- `GET /api/dashboard/metrics` - Dashboard metrics
- `GET /api/clients` - Client list
- `GET /api/services` - Services list
- `GET /api/subscriptions` - Subscription data
- `GET /api/tickets` - Support tickets
- `GET /api/analytics` - Analytics data

## Responsive Design

The application is fully responsive with:
- Mobile-first design approach
- Collapsible sidebar navigation on mobile
- Flexible grid layouts using Tailwind CSS utilities
- Touch-friendly interface elements

## Deployment Guides

### Option 1: Deploy to Vercel (Recommended)

**Benefits**: Zero-config deployment, automatic HTTPS, global CDN, environment variables management, automatic previews for PRs.

#### Steps:
1. **Push to GitHub** (Already done ✓)
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Select `TechSphere` repository
   - Vercel automatically detects Vite configuration

3. **Configure Environment Variables** (if needed):
   - In Vercel Dashboard → Project Settings → Environment Variables
   - Add `VITE_API_URL` pointing to your backend API
   - Example: `https://api.techsphere.com`

4. **Deploy**:
   - Click "Deploy"
   - Your site will be live at `https://<project-name>.vercel.app`

5. **Connect Custom Domain** (Optional):
   - In Vercel Dashboard → Domains
   - Add your custom domain (e.g., `techsphere.com`)
   - Update DNS records as instructed

#### Auto-Deployment:
- Any push to `main` branch automatically triggers deployment
- Preview deployments created for pull requests

### Option 2: Deploy to Netlify

**Benefits**: Simple setup, great free tier, built-in functions, form handling, split testing.

#### Steps:
1. **Connect Netlify to GitHub**:
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Select GitHub and authorize
   - Choose `TechSphere` repository

2. **Configure Build Settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: `18.x`

3. **Add Redirects** (for React Router):
   - Create `public/_redirects` file:
     ```
     /* /index.html 200
     ```
   - Or add to `netlify.toml`:
     ```toml
     [[redirects]]
       from = "/*"
       to = "/index.html"
       status = 200
     ```

4. **Deploy**:
   - Click "Deploy site"
   - Your site will be live at `https://<site-name>.netlify.app`

### Option 3: Deploy to GitHub Pages

**Benefits**: Free hosting directly from GitHub, no external services needed.

#### Steps:
1. **Update `package.json`**:
   ```json
   "homepage": "https://yourusername.github.io/TechSphere"
   ```

2. **Install gh-pages**:
   ```bash
   npm install --save-dev gh-pages
   ```

3. **Add deploy scripts** to `package.json`:
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```

4. **Deploy**:
   ```bash
   npm run deploy
   ```

### Option 4: Manual Deployment (AWS S3 + CloudFront)

**Benefits**: Maximum control, scalable, cost-effective for high traffic.

#### Steps:
1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Create S3 bucket** and enable static website hosting

3. **Upload `dist` folder** to S3

4. **Create CloudFront distribution** pointing to S3

5. **Configure custom domain** via Route53

### Environment Variables for API Integration

Create `.env.local` file in project root:
```env
VITE_API_URL=https://your-api-domain.com
VITE_APP_ENV=production
```

Access in your code:
```typescript
const apiUrl = import.meta.env.VITE_API_URL;
```

### Pre-Deployment Checklist

- [ ] Run `npm run build` successfully
- [ ] Run `npm run lint` with no errors
- [ ] Test on multiple devices using DevTools
- [ ] Check Core Web Vitals using PageSpeed Insights
- [ ] Verify all routes work correctly
- [ ] Set up environment variables on hosting platform
- [ ] Configure CORS if backend is on different domain
- [ ] Test form submissions and API calls
- [ ] Verify SSL certificate is active
- [ ] Set up monitoring and error tracking (e.g., Sentry)

### Monitoring & Analytics

After deployment, set up:
- **Google Analytics**: Track user behavior
- **Sentry**: Monitor errors and performance
- **Datadog or New Relic**: Application performance monitoring

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Team Members

- [Your Name] - Frontend Developer

## Future Enhancements

- Backend API integration
- Real-time notifications
- Advanced analytics with charts
- User role management
- Multi-tenant support
- API documentation with Swagger