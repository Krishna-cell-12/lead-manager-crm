const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load environment configurations
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Body parser middleware
app.use(express.json());

// Enable Cross-Origin Resource Sharing (Crucial for Day 2 Frontend connection)
app.use(cors());

// Mount API routes
app.use('/api/leads', require('./routes/leadRoutes'));

// Basic entry route to confirm server is running
app.get('/', (req, res) => {
  res.send('CRM API is running cleanly...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server executing in production mode on port ${PORT}`);
});