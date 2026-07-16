import 'dotenv/config';
import dns from 'dns';

// Force Node to use Google and Cloudflare DNS to bypass local/ISP resolver bugs (ESERVFAIL)
dns.setServers(['8.8.8.8', '1.1.1.1']);

// Patched dns.lookup: Forces TCP connections (via net.connect) targeting MongoDB Atlas
// to utilize Node's configured DNS servers rather than OS-level getaddrinfo threads (which throw EAI_AGAIN)
const originalLookup = dns.lookup;
dns.lookup = function(hostname, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }
  if (hostname.includes('mongodb.net')) {
    dns.resolve4(hostname, (err, addresses) => {
      if (!err && addresses && addresses.length > 0) {
        return callback(null, addresses[0], 4);
      }
      originalLookup(hostname, options, callback);
    });
  } else {
    originalLookup(hostname, options, callback);
  }
};

import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import announcementRoutes from './routes/announcementRoutes.js';
import resourceRoutes from './routes/resourceRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import facultyRoutes from './routes/facultyRoutes.js';


// Connect to Database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to guarantee database connection in Serverless environments (like Vercel)
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    next();
  }
});

// Global Middleware Matrix
app.use(cors());
app.use(express.json()); // Allows the server to parse JSON payloads in request bodies

// API Route Registration
app.use('/api/auth', authRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/faculties', facultyRoutes);

// Base Test Route
app.get('/', (req, res) => {
  res.status(200).json({ message: 'UniHub OGB API Operational' });
});

// Fire up Server Instance
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server executing seamlessly on port ${PORT}`);
  });
}

export default app;
