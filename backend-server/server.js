const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 5000;
const JWT_SECRET = "super_secret_temporary_key_123";

// Middleware configuration
app.use(cors()); // Allows frontend interaction
app.use(express.json()); // Allows server to read incoming JSON data

// A mock Database (Array) to hold users
const usersDatabase = [];

// ==========================================
// 1. REGISTRATION ROUTE (Sign Up)
// ==========================================
app.post('/api/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Basic backend safety check
        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if user already exists
        const userExists = usersDatabase.find(u => u.email === email || u.username === username);
        if (userExists) {
            return res.status(400).json({ message: "Username or Email already registered" });
        }

        // CRITICAL SECURITY: Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save the user data to our "database"
        const newUser = { id: Date.now(), username, email, password: hashedPassword };
        usersDatabase.push(newUser);

        res.status(201).json({ message: "User registered successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Server error during registration" });
    }
});

// ==========================================
// 2. LOGIN ROUTE
// ==========================================
app.post('/api/login', async (req, res) => {
    try {
        const { usernameOrEmail, password } = req.body;

        // Find the user by checking username OR email match
        const user = usersDatabase.find(u => u.email === usernameOrEmail || u.username === usernameOrEmail);
        
        if (!user) {
            return res.status(400).json({ message: "Invalid username/password combination" });
        }

        // Compare the submitted password with the encrypted database password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid username/password combination" });
        }

        // Generate a secure logged-in token session
        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ 
            message: "Login successful", 
            token: token,
            user: { username: user.username, email: user.email }
        });
    } catch (error) {
        res.status(500).json({ message: "Server error during login" });
    }
});

// Start listening for network traffic
app.listen(PORT, () => {
    console.log(`Backend server successfully running at http://localhost:${PORT}`);
});
