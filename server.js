const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json()); // Middleware to parse JSON bodies

// POST route for entering a room
app.post('/api/enter-room', (req, res) => {
  const { name, roomCode } = req.body;

  if (!name || !roomCode) {
    return res.status(400).json({ success: false, message: 'Name and room code are required' });
  }

  // Simulating room validation (in a real app, you'd check the database)
  const rooms = ['room1', 'room2', 'room3']; // Example valid rooms
  if (rooms.includes(roomCode)) {
    return res.status(200).json({ success: true, message: 'Room found' });
  } else {
    return res.status(404).json({ success: false, message: 'Room not found' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
