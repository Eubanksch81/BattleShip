// server.js
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const port = 3000;
const cors = require("cors");

// Middleware to parse JSON and URL-encoded data
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// SQLite Database Connection
const db = new sqlite3.Database('./DataBase/UserLoginBattleShip.db', (err) => {
    if (err) {
        console.error('Error connecting to SQLite database:', err.message);
    }
    console.log('Connected to the SQLite database.');
});

// Route to handle login
app.post('/BattleShip/public/login', (req, res) => {
    const { username, password } = req.body;

    // Query the database to find the user with matching credentials
    db.get(
        'SELECT * FROM user_login WHERE username = ? AND password = ?',
        [username, password],
        (err, row) => {
            if (err) {
                res.json({ success: false, message: 'An error occurred. Please try again.' });
            } else if (row) {
                // If user is found, login is successful
                res.json({ success: true, message: 'Login successful!' });
            } else {
                // If user is not found or password is incorrect
                res.json({ success: false, message: 'Invalid username or password.' });
            }
        }
    );
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
