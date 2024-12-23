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

app.post('/BattleShip/public/createLogin', (req, res) => {
    const { username, password } = req.body;

    // Query the database to find the user with matching credentials
    db.get(
        'SELECT * FROM user_login WHERE username = ? COLLATE NOCASE',
        [username],
        (err, row) => {
            if (err) {
                console.error('Database error:', err.message);
                return res.status(500).json({ success: false, message: 'An error occurred. Please try again.' });
            }

            console.log('Query result:', row);  // Debugging line

            if (row) {
                // Username already exists
                return res.json({ success: false, message: 'Username already taken.' });
            }

            // Insert the new user if username doesn't exist
            const sql = 'INSERT INTO user_login (username, password) VALUES (?, ?)';
            db.run(sql, [username, password], function(err) {
                if (err) {
                    console.error('Error inserting data:', err.message);
                    return res.status(500).json({ success: false, message: 'Failed to create account.' });
                }

                return res.json({ success: true, message: 'Account created successfully!' });
            });
        }
    );
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

app.post('/BattleShip/public/BattleShipGame', (req, res) => {
    const {wins, losses, username} = req.body;
    db.get(
        'UPDATE player_stats SET wins = ?, losses = ? WHERE username = ?',
        [wins, losses, username],
        (err, row) => {
            if (err) {
                console.error('Database error:', err.message);
                return res.status(500).json({ success: false, message: 'An error occurred. Please try again.' });
            }

            if (row) {
                // Username already exists
                return res.json({ success: false, message: 'Updated successfully' });
            }
        }
    );

});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
