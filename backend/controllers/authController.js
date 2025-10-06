const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// @desc    Register a new user
const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        // Basic input validation
        if (!name || !email || !password) {
            return res.status(400).json({ msg: 'Name, email and password are required' });
        }
        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET is not set in environment');
            // Do not crash; return server error to client
            return res.status(500).json({ msg: 'Server configuration error' });
        }
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }
        user = new User({ name, email, password, role });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();
        const payload = { user: { id: user.id, role: user.role } };
        // Use callback but handle errors without throwing
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 360000 }, (err, token) => {
            if (err) {
                console.error('JWT sign error:', err);
                return res.status(500).json({ msg: 'Failed to generate token' });
            }
            return res.json({ token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Authenticate user & get token
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ msg: 'Email and password are required' });
        }
        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET is not set in environment');
            return res.status(500).json({ msg: 'Server configuration error' });
        }
        let user = await User.findOne({ email });
        if (!user) {
            // If debugging is enabled, return more specific message (don't enable in production)
            if (process.env.DEBUG_AUTH === 'true') {
                return res.status(400).json({ msg: 'User not found' });
            }
            return res.status(400).json({ msg: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            // Fallback migration: if the stored password is plaintext (legacy),
            // detect it and upgrade to a hashed password automatically.
            try {
                if (user.password === password) {
                    // Re-hash the plaintext password and save
                    const salt = await bcrypt.genSalt(10);
                    user.password = await bcrypt.hash(password, salt);
                    await user.save();
                    // Now password is effectively matched
                } else {
                    if (process.env.DEBUG_AUTH === 'true') {
                        return res.status(400).json({ msg: 'Password does not match' });
                    }
                    return res.status(400).json({ msg: 'Invalid credentials' });
                }
            } catch (migrateErr) {
                console.error('Password migration error:', migrateErr);
                return res.status(500).json({ msg: 'Server error during authentication' });
            }
        }
        const payload = { user: { id: user.id, role: user.role } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 360000 }, (err, token) => {
            if (err) {
                console.error('JWT sign error:', err);
                return res.status(500).json({ msg: 'Failed to generate token' });
            }
            return res.json({ token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

module.exports = {
    registerUser,
    loginUser,
};

