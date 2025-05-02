const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const calendarService = require('../calendars/calendar.service');

// Add Event (Admins only)
router.post('/', async (req, res) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
      return res.status(403).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(403).json({ message: "Invalid token" });
    }

    // Ensure the request body contains the necessary fields
    const { title, eventColor, startDate, endDate, description, category, reminder } = req.body;

    // Validate the necessary fields
    if (!title || !startDate || !endDate) {
      return res.status(400).json({ message: "Title, Start Date, and End Date are required" });
    }

    // Create event with all data
    const eventData = { 
      title, 
      eventColor, 
      startDate, 
      endDate,
      description,
      category,
      reminder
    };

    const newEvent = await calendarService.createEvent(eventData);
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).json({ message: "Error adding calendar event", error: error.message });
  }
});

// Route to get all events (accessible by any authenticated user)
router.get('/', async (req, res) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1];
    
    if (!token) {
      return res.status(403).json({ message: "No token provided" });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (!decoded) {
      return res.status(403).json({ message: "Invalid token" });
    }
    
    const events = await calendarService.getAllEvents();
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Error fetching events", error });
  }
});

// Update Event
router.put('/:id', async (req, res) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1];
    
    if (!token) {
      return res.status(403).json({ message: "No token provided" });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (!decoded) {
      return res.status(403).json({ message: "Invalid token" });
    }

    const { id } = req.params;
    const eventData = req.body;

    const updatedEvent = await calendarService.updateEvent(id, eventData);
    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: "Error updating event", error: error.message });
  }
});

// Delete Event
router.delete('/:id', async (req, res) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1];
    
    if (!token) {
      return res.status(403).json({ message: "No token provided" });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (!decoded) {
      return res.status(403).json({ message: "Invalid token" });
    }

    const { id } = req.params;
    await calendarService.deleteEvent(id);
    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting event", error: error.message });
  }
});

module.exports = router;  