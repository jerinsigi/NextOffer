require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors({
    origin: ["http://localhost:3000", "https://nextoffer.vercel.app"],
    credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Custom middleware to serve files with proper headers for inline viewing
app.use('/uploads', (req, res, next) => {
    // Set Content-Disposition to inline for PDFs and documents
    const filePath = req.path.toLowerCase();
    if (filePath.endsWith('.pdf') || filePath.endsWith('.doc') || filePath.endsWith('.docx')) {
        res.setHeader('Content-Disposition', 'inline');
        res.setHeader('Content-Type', filePath.endsWith('.pdf') ? 'application/pdf' : 'application/octet-stream');
    }
    next();
}, express.static('upload'));

// Connect to MongoDB
// NOTE: You must set MONGODB_URI in your Vercel Environment Variables
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/nextoffer';

mongoose.connect(MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error(err));

app.get('/', (req, res) => {
    res.send('Hello! The server is running.');
});

// Vercel serverless requires exporting the app
const companiesRouter = require('./routes/companies');
app.use('/api/companies', companiesRouter);

const authRouter = require('./routes/auth');
app.use('/api/auth', authRouter);

const jobCategoriesRouter = require('./routes/jobCategories');
app.use('/api/job-categories', jobCategoriesRouter);

const jobDescriptionsRouter = require('./routes/jobDescriptions');
app.use('/api/job-descriptions', jobDescriptionsRouter);


const usersRouter = require('./routes/users');
app.use('/api/users', usersRouter);

const applicationsRouter = require('./routes/applications');
app.use('/api/applications', applicationsRouter);

const skillsRouter = require('./routes/skills');
app.use('/api/skills', skillsRouter);

const interviewRouter = require('./routes/interviewRoutes');
app.use('/api/interviews', interviewRouter);

const responseRouter = require('./routes/responseRoutes');
app.use('/api/responses', responseRouter);

const contactRouter = require('./routes/contactRoutes');
app.use('/api/contact', contactRouter);


const reportsRouter = require('./routes/reports');
app.use('/api/reports', reportsRouter);

const adminDashboardRouter = require('./routes/adminDashboard');
app.use('/api/admin/dashboard', adminDashboardRouter);

const dashboardRouter = require('./routes/dashboardRoutes');
app.use('/api/dashboard', dashboardRouter);

const practiceRouter = require('./routes/practiceRoutes');
app.use('/api/practice', practiceRouter);

const resumeRouter = require('./routes/resumeRoutes');
app.use('/api/resumes', resumeRouter);


module.exports = app;

// Only listen if not running on Vercel
if (require.main === module) {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}