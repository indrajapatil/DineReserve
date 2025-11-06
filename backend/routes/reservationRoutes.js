const express = require('express');
const router = express.Router();
const Reservation = require("../models/Reservation.js");
const adminAuth = require('../middleware/adminAuth.js');

// ✅ POST /api/reservation/register - create reservation
router.post("/register", async (req, res) => {
    const { name, email, phone, date: dateInput, time, seats } = req.body;
    console.log(name, email, phone, dateInput, time, seats);

    // Basic validation
    if (!name || !email || !phone || !dateInput || !time || !seats) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    // Parse date: accept ISO (YYYY-MM-DD) or DD-MM-YYYY
    let parsedDate = new Date(dateInput);
    if (isNaN(parsedDate.getTime())) {
        const parts = String(dateInput).split('-');
        if (parts.length === 3) {
            const [d, m, y] = parts;
            parsedDate = new Date(`${y}-${m}-${d}`);
        }
    }
    if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD or DD-MM-YYYY' });
    }

    // Validate time
    const allowedTimes = [
        "9:00 AM","10:00 AM","11:00 AM","12:00 PM",
        "1:00 PM","2:00 PM","3:00 PM","4:00 PM",
        "5:00 PM","6:00 PM","7:00 PM","8:00 PM"
    ];
    if (!allowedTimes.includes(time)) {
        return res.status(400).json({ error: 'Invalid time. Allowed times: ' + allowedTimes.join(', ') });
    }

    // Validate seats
    const seatsNum = Number(seats);
    if (!Number.isInteger(seatsNum) || seatsNum < 1 || seatsNum > 10) {
        return res.status(400).json({ error: 'Invalid seats. Must be integer between 1 and 10' });
    }

    // ✅ Create new reservation with default "Pending" status
    const newReservation = new Reservation({
        name,
        email,
        phone,
        date: parsedDate,
        time,
        seats: seatsNum,
        status: "Pending"
    });

    try {
        const saved = await newReservation.save();
        const out = saved.toObject();
        if (out.date) out.date = out.date.toISOString();

        res.json({ success: true, message: 'Reservation created successfully', data: out });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

// ✅ GET /api/reservation/user/:email - get reservations by user email
router.get('/user/:email', async (req, res) => {
  try {
    const { email } = req.params;
    if (!email) return res.status(400).json({ success: false, error: 'Email required' });

    const reservations = await Reservation.find({ email }).sort({ date: -1 });
    res.json({ success: true, data: reservations });
  } catch (error) {
    console.error('User reservation fetch error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch reservations' });
  }
});

// ✅ GET /api/reservation/:id - get a reservation by ID (admin)
router.get('/:id', adminAuth, async (req, res) => {
    try {
        const r = await Reservation.findById(req.params.id);
        if (!r) return res.status(404).json({ success: false, error: 'Reservation not found' });
        const out = r.toObject(); 
        if (out.date) out.date = out.date.toISOString();
        res.json({ success: true, data: out });
    } catch (error) {
        console.error('Fetch reservation error', error);
        res.status(500).json({ success: false, error: 'Failed to fetch reservation' });
    }
});

// ✅ GET /api/reservation - list all reservations (admin)
router.get('/', adminAuth, async (req, res) => {
    try {
        const reservations = await Reservation.find().sort({ date: -1, createdAt: -1 });
        const out = reservations.map(r => {
            const o = r.toObject(); 
            if (o.date) o.date = o.date.toISOString(); 
            return o;
        });
        res.json({ success: true, data: out });
    } catch (error) {
        console.error('List reservations error', error);
        res.status(500).json({ success: false, error: 'Failed to fetch reservations' });
    }
});

// ✅ DELETE /api/reservation/:id - delete reservation (admin)
router.delete('/:id', adminAuth, async (req, res) => {
    try {
        const deleted = await Reservation.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ success: false, error: 'Reservation not found' });
        }
        res.json({ success: true, message: 'Reservation deleted' });
    } catch (error) {
        console.error('Delete reservation error', error);
        res.status(500).json({ success: false, error: 'Failed to delete reservation' });
    }
});

// ✅ PUT /api/reservation/:id - update reservation (admin)
router.put('/:id', adminAuth, async (req, res) => {
    const { status, name, email, phone, time, seats, date } = req.body;
    const update = {};

    if (status) update.status = status;
    if (name) update.name = name;
    if (email) update.email = email;
    if (phone) update.phone = phone;
    if (time) update.time = time;
    if (typeof seats !== 'undefined') update.seats = seats;
    if (date) {
        const d = new Date(date);
        if (!isNaN(d.getTime())) update.date = d;
    }

    try {
        const updated = await Reservation.findByIdAndUpdate(req.params.id, update, { new: true });
        if (!updated) return res.status(404).json({ success: false, error: 'Reservation not found' });

        const out = updated.toObject(); 
        if (out.date) out.date = out.date.toISOString();
        res.json({ success: true, data: out });
    } catch (error) {
        console.error('Update reservation error', error);
        res.status(500).json({ success: false, error: 'Failed to update reservation' });
    }
});

module.exports = router;
