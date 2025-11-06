const express = require('express');
const router = express.Router();
const User = require("../models/User.js");
const bcrypt = require('bcryptjs');

// ✅ Register new user
router.post("/register", async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // Basic validation
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ success: false, error: "All fields are required" });
    }

    // Check if user already exists by email or phone
    const existingByEmail = await User.findOne({ email });
    if (existingByEmail) {
      return res.status(400).json({ success: false, error: "Email already registered" });
    }
    const existingByPhone = await User.findOne({ phone });
    if (existingByPhone) {
      return res.status(400).json({ success: false, error: "Phone number already registered" });
    }

    // Hash password before storing
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      name,
      email,
      phone,
      password: hashed,
      status: "active",
      reservations: 0
    });

    await newUser.save();

    const out = newUser.toObject();
    delete out.password; // do not send password back

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: out
    });
  } catch (err) {
    console.error("Error registering user:", err);
    // handle duplicate key
    if (err && err.code === 11000) {
      const dupField = Object.keys(err.keyValue || {}).join(', ');
      return res.status(400).json({ success: false, error: `Duplicate value for field(s): ${dupField}` });
    }
    res.status(500).json({ success: false, error: "Registration failed" });
  }
});

// ✅ Login with block check
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ success: false, error: 'Invalid credentials' });

    // compare password (support legacy plain-text passwords by upgrading them)
    let match = false;
    try {
      match = await bcrypt.compare(password, user.password);
    } catch (e) {
      match = false;
    }

    // Backwards compatibility: if stored password is plain-text (pre-hash), accept and re-hash it
    if (!match && user.password === password) {
      // re-hash and save
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();
      match = true;
    }

    if (!match) return res.status(400).json({ success: false, error: 'Invalid credentials' });

    if (user.status === 'blocked') return res.status(403).json({ success: false, error: 'You are blocked' });

    const out = user.toObject();
    delete out.password;
    res.json({ success: true, data: out });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ success: false, error: 'Login failed' });
  }
});

// ✅ Get all users (for admin)
router.get('/', async (req, res) => {
  try {
    const users = await User.find().sort({ name: 1 });
    res.json({ success: true, data: users });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: 'Failed to fetch users' });
  }
});

// ✅ Update user details (name/email/phone)
router.put('/:id', async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const update = {};
    if (name) update.name = name;
    if (email) update.email = email;
    if (phone) update.phone = phone;

    const updated = await User.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!updated)
      return res.status(404).json({ success: false, error: 'User not found' });

    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Update failed' });
  }
});

// ✅ Block / Unblock user
router.post('/:id/block', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user)
      return res.status(404).json({ success: false, error: 'User not found' });

    user.status = user.status === 'blocked' ? 'active' : 'blocked';
    await user.save();

    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to update status' });
  }
});

// ✅ Increment reservation count
router.post("/:id/increment-reservations", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user)
      return res.status(404).json({ error: "User not found" });

    user.reservations = (user.reservations || 0) + 1;
    await user.save();

    res.status(200).json({
      message: "Reservation count incremented",
      count: user.reservations
    });
  } catch (err) {
    console.error("Error incrementing reservations:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
