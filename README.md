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