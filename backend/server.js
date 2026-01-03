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

module.exports = app;

// Only listen if not running on Vercel
if (require.main === module) {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}