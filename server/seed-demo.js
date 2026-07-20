import 'dotenv/config';
import dns from 'dns';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User.js';

// Force Node to use Google and Cloudflare DNS to bypass local/ISP resolver bugs (ESERVFAIL)
dns.setServers(['8.8.8.8', '1.1.1.1']);

// Patched dns.lookup
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

async function seed() {
  console.log("Connecting to Database cluster...");
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
      family: 4,
    });
    console.log("Connected successfully to DB.");

    const email = 'demo.student@student.lautech.edu.ng';
    const existing = await User.findOne({ email });

    if (existing) {
      console.log(`Demo account already exists!`);
      console.log(`Email: ${existing.email}`);
      console.log(`Role: ${existing.role}`);
      console.log(`Verified Status: ${existing.isVerified}`);
    } else {
      console.log("Creating new pre-verified demo student...");
      
      const demoUser = new User({
        name: 'Demo Student',
        email,
        password: 'Password123!',
        matricNumber: '180293',
        faculty: 'Engineering and Technology',
        department: 'Computer Science',
        level: '500',
        isVerified: true // Pre-verified so it bypasses registration email activation!
      });

      await demoUser.save();
      console.log("==================================================");
      console.log("🚀 Pre-verified demo student successfully created!");
      console.log(`Email:    ${email}`);
      console.log("Password: Password123!");
      console.log("==================================================");
    }
  } catch (err) {
    console.error("❌ Seeding failed:", err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();
