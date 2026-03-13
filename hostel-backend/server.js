const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth',        require('./src/routes/auth.routes'));
app.use('/api/rooms',       require('./src/routes/room.routes'));
app.use('/api/requests',    require('./src/routes/request.routes'));
app.use('/api/allocations', require('./src/routes/allocation.routes'));
app.use('/api/admin',       require('./src/routes/admin.routes'));

// Health check
app.get('/', (req, res) => res.json({ message: 'Hostel API is running' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
