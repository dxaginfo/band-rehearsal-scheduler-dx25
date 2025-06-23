# Band Rehearsal Scheduler

A comprehensive web application designed to help bands and musical groups efficiently organize and manage their rehearsal sessions. The app provides features for scheduling, attendance tracking, communication, and resource management.

## Features

- **User Management**
  - Create user accounts with different roles (band member, band leader)
  - Join and manage multiple bands
  - Personal profile with instrument preferences

- **Rehearsal Scheduling**
  - Create one-time and recurring rehearsals
  - Propose multiple time slots with voting
  - Calendar view of all upcoming rehearsals
  - RSVP system for attendance tracking

- **Communication**
  - Email notifications for new rehearsals
  - Automated reminders before rehearsal
  - In-app messaging for band members
  - Comments on specific rehearsals

- **Resource Management**
  - Venue management
  - Attach setlists and music sheets to rehearsals
  - File sharing for rehearsal materials

- **Analytics**
  - Attendance history tracking
  - Optimal rehearsal time recommendations
  - Personal attendance statistics

## Technology Stack

### Frontend
- React.js
- React Native Web (for mobile responsiveness)
- Redux Toolkit
- Material-UI
- FullCalendar.js

### Backend
- Node.js with Express
- REST API with JWT Authentication
- Socket.io for real-time updates

### Database
- PostgreSQL
- Sequelize ORM

### Cloud Services
- AWS Elastic Beanstalk
- AWS S3 for file storage
- SendGrid for email
- Firebase Cloud Messaging for push notifications

## Project Structure

```
band-rehearsal-scheduler/
├── client/                 # Frontend React application
│   ├── public/             # Static files
│   └── src/                # React source code
│       ├── components/     # UI components
│       ├── pages/          # Application pages
│       ├── redux/          # Redux state management
│       ├── services/       # API services
│       └── utils/          # Utility functions
├── server/                 # Backend Node.js application
│   ├── config/             # Configuration files
│   ├── controllers/        # API controllers
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── services/           # Business logic
│   └── utils/              # Utility functions
├── database/               # Database migration scripts
└── deployment/             # Deployment configuration files
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- PostgreSQL database
- AWS account (for production deployment)

### Local Development

1. Clone the repository
   ```
   git clone https://github.com/dxaginfo/band-rehearsal-scheduler-dx25.git
   cd band-rehearsal-scheduler-dx25
   ```

2. Install server dependencies
   ```
   cd server
   npm install
   ```

3. Configure environment variables
   ```
   cp .env.example .env
   # Edit .env file with your database credentials and other settings
   ```

4. Run database migrations
   ```
   npm run migrate
   ```

5. Start the server
   ```
   npm run dev
   ```

6. Install client dependencies
   ```
   cd ../client
   npm install
   ```

7. Start the client
   ```
   npm start
   ```

8. Access the application at `http://localhost:3000`

### Testing

```
# Run server tests
cd server
npm test

# Run client tests
cd client
npm test
```

## Deployment

### Production Build

```
# Build the client
cd client
npm run build

# Prepare for deployment
cd ../
npm run build
```

### AWS Deployment

1. Configure AWS credentials
2. Set up environment variables in AWS Elastic Beanstalk
3. Deploy using the provided scripts
   ```
   npm run deploy
   ```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- FullCalendar.js for the calendar functionality
- Material-UI for the component library
- All the bands who provided feedback during the development process