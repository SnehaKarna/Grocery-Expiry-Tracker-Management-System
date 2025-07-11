const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const generalRoutes = require('./routes/generalRoutes');

app.use(cors());
app.use(express.json()); // Parse JSON body

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', generalRoutes); // General routes accessible to all users

// Root routez
app.get('/', (req, res) => {
  res.send('Welcome to Expiry Tracker API 🚀');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
