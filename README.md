# Job Management System

A comprehensive, full-stack job management application built with Next.js, React, TypeScript, and MongoDB. This modern web application allows users to create, manage, and search for job postings with an intuitive and responsive interface.

## 🚀 Features

### Core Functionality
- **Job Creation**: Create detailed job postings with company information, salary ranges, and descriptions
- **Advanced Search**: Search jobs by title, company name, location, job type, and salary range
- **Real-time Filtering**: Dynamic filtering with instant results
- **Responsive Design**: Optimized for mobile, tablet, and desktop devices
- **Company Branding**: Real company logos integration via Clearbit API

### User Interface
- **Modern Design**: Clean, professional interface with gradient themes
- **Mobile Navigation**: Hamburger menu with slide-out navigation for mobile devices
- **Interactive Components**: Custom range sliders, dropdowns, and form controls
- **Loading States**: Smooth loading animations and feedback
- **Toast Notifications**: Real-time success and error notifications

### Technical Features
- **Full-stack Architecture**: Next.js with API routes and MongoDB integration
- **Type Safety**: Full TypeScript implementation
- **Form Validation**: Comprehensive form validation with Zod schemas
- **Error Handling**: Robust error handling with fallback mechanisms
- **SEO Optimized**: Proper meta tags and semantic HTML structure

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **React 18** - UI library with hooks and modern patterns
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icon library
- **React Hook Form** - Performant form library
- **Zod** - Schema validation

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **MongoDB** - NoSQL database
- **MongoDB Driver** - Official MongoDB Node.js driver

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (version 18 or higher)
- **npm** or **yarn** package manager
- **MongoDB** database (local or cloud instance)

## 🚀 Installation

### 1. Clone the Repository
\`\`\`bash
git clone <repository-url>
cd job-management-system
\`\`\`

### 2. Install Dependencies
\`\`\`bash
npm install
# or
yarn install
\`\`\`

### 3. Environment Setup
Create a \`.env.local\` file in the root directory and add your environment variables:

\`\`\`env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/jobmanagement?retryWrites=true&w=majority

# Next.js Configuration (optional)
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
\`\`\`

**Important**: If your MongoDB password contains special characters (like \`@\`, \`#\`, etc.), make sure to URL-encode them:
- \`@\` becomes \`%40\`
- \`#\` becomes \`%23\`
- \`$\` becomes \`%24\`

### 4. Database Setup
The application will automatically:
- Create the \`jobmanagement\` database
- Set up the \`jobs\` collection
- Create necessary indexes for optimal performance

### 5. Run the Development Server
\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📁 Project Structure

\`\`\`
job-management-system/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── jobs/                 # Job-related endpoints
│   │   │   ├── route.ts          # GET, POST /api/jobs
│   │   │   └── [id]/route.ts     # GET, PUT, DELETE /api/jobs/[id]
│   │   └── test-db/route.ts      # Database connection test
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout component
│   ├── loading.tsx               # Loading component
│   └── page.tsx                  # Main page component
├── components/                   # Reusable components
│   ├── ui/                       # UI components (shadcn/ui)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── form.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── sheet.tsx
│   │   ├── slider.tsx
│   │   └── toast.tsx
│   ├── enhanced-range-slider.tsx # Custom salary range slider
│   └── job-creation-form.tsx     # Job creation form
├── hooks/                        # Custom React hooks
│   └── use-toast.ts              # Toast notification hook
├── lib/                          # Utility libraries
│   ├── mongodb.ts                # MongoDB connection
│   └── utils.ts                  # Utility functions
├── public/                       # Static assets
├── .env.local                    # Environment variables (create this)
├── package.json                  # Dependencies and scripts
├── tailwind.config.ts            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
└── README.md                     # Project documentation
\`\`\`

## 🔧 Configuration

### MongoDB Connection
The application uses MongoDB for data storage. Configure your connection in \`.env.local\`:

\`\`\`env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/jobmanagement
\`\`\`

### Tailwind CSS
The project uses a custom Tailwind configuration with:
- Custom color schemes
- Animation utilities
- Responsive breakpoints
- Component-specific styles

### TypeScript
Strict TypeScript configuration ensures type safety across the application with:
- Strict mode enabled
- Path mapping for clean imports
- Type checking for all files

## 📚 API Documentation

### Jobs API

#### GET /api/jobs
Retrieve all published jobs.

**Response:**
\`\`\`json
[
  {
    "id": "string",
    "title": "string",
    "companyName": "string",
    "location": "string",
    "jobType": "string",
    "salaryRange": "string",
    "description": "string",
    "applicationDeadline": "string",
    "status": "published",
    "createdAt": "string"
  }
]
\`\`\`

#### POST /api/jobs
Create a new job posting.

**Request Body:**
\`\`\`json
{
  "title": "Full Stack Developer",
  "companyName": "Tech Corp",
  "location": "Bangalore",
  "jobType": "Full-time",
  "salaryRange": "₹70L - ₹90L",
  "description": "Job description here...",
  "applicationDeadline": "2024-12-31T23:59:59.000Z",
  "status": "published"
}
\`\`\`

#### GET /api/jobs/[id]
Retrieve a specific job by ID.

#### PUT /api/jobs/[id]
Update a specific job by ID.

#### DELETE /api/jobs/[id]
Delete a specific job by ID.

### Database Test API

#### GET /api/test-db
Test database connectivity and return connection status.

## 🎨 Customization

### Styling
- Modify \`tailwind.config.ts\` for custom themes
- Update \`app/globals.css\` for global styles
- Customize component styles in individual component files

### Branding
- Update logo in the header component
- Modify color schemes in Tailwind configuration
- Add custom company logos in the \`getCompanyLogo\` function

### Features
- Add new job fields by updating the schema and forms
- Implement user authentication with NextAuth.js
- Add email notifications for job applications
- Create admin dashboard for job management

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms
The application can be deployed on any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🧪 Testing

### Database Connection Test
Visit \`/api/test-db\` to verify your MongoDB connection.

### Manual Testing
1. Create a new job posting
2. Search and filter jobs
3. Test responsive design on different devices
4. Verify form validation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit your changes (\`git commit -m 'Add amazing feature'\`)
4. Push to the branch (\`git push origin feature/amazing-feature\`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use meaningful commit messages
- Add proper error handling
- Test on multiple devices
- Update documentation for new features

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Troubleshooting

### Common Issues

**MongoDB Connection Failed**
- Verify your MongoDB URI is correct
- Check if your IP is whitelisted in MongoDB Atlas
- Ensure special characters in password are URL-encoded

**Build Errors**
- Clear \`.next\` folder and rebuild
- Verify all dependencies are installed
- Check TypeScript errors

**Styling Issues**
- Clear browser cache
- Verify Tailwind CSS is properly configured
- Check for conflicting CSS classes

### Getting Help
- Check the GitHub issues for similar problems
- Create a new issue with detailed error information
- Join our community discussions

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Radix UI](https://www.radix-ui.com/) for accessible component primitives
- [MongoDB](https://www.mongodb.com/) for the flexible database solution
- [Vercel](https://vercel.com/) for seamless deployment platform

---

**Happy Coding! 🚀**
\`\`\`
