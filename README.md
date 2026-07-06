# Smart Waste Management System

A modern, responsive React application for reporting and managing waste issues in cities.

## Features

- **User Authentication**: Login and registration system
- **Report Waste**: Submit waste complaints with images and location
- **My Reports**: Track submitted reports and their status
- **Admin Dashboard**: Overview of system statistics
- **Analytics**: Visual charts showing waste data insights
- **Reports Management**: Admin interface to update report status

## Technologies Used

- React 18
- React Router DOM v6
- Tailwind CSS
- Recharts (for analytics)
- Axios (for API calls)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
src/
├── components/
│   ├── Navbar.js          # Navigation bar
│   ├── Footer.js          # Footer component
│   ├── ReportCard.js      # Report display card
│   └── DashboardCard.js   # Dashboard statistics card
├── pages/
│   ├── Home.js            # Landing page
│   ├── Login.js           # Login page
│   ├── Register.js        # Registration page
│   ├── ReportWaste.js     # Report submission form
│   ├── MyReports.js       # User's reports list
│   ├── Dashboard.js       # Admin dashboard
│   ├── Analytics.js       # Analytics charts
│   └── AdminReports.js    # Reports management
├── services/
│   └── api.js             # API service layer
├── App.js                 # Main app component
└── index.js               # Entry point
```

## Usage

### User Login
- Regular user: Use any email (e.g., user@example.com)
- Admin user: Use email containing "admin" (e.g., admin@example.com)

### Routes
- `/` - Home page
- `/login` - Login page
- `/register` - Registration page
- `/report` - Report waste (protected)
- `/my-reports` - View user reports (protected)
- `/dashboard` - Admin dashboard (admin only)
- `/analytics` - Analytics page (admin only)
- `/admin/reports` - Manage reports (admin only)

## Mock Data

The application currently uses mock data for demonstration. To connect to a real backend:

1. Update the `API_BASE_URL` in `src/services/api.js`
2. Implement actual API endpoints
3. Remove mock data from components

## Future Enhancements

- Google Maps integration for location selection
- Real-time notifications
- Image upload to cloud storage
- Mobile app version
- Email notifications
- Advanced filtering and search

## License

MIT
