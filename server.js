const express = require('express');
const path = require('path');
const app = express();
const PORT = 9999;

// Import storage
const notificationStorage = require('./src/storage/notificationStorage');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Example route
app.get('/notifications', (req, res) => {
  res.sendFile(path.join(__dirname, 'notifications.html'));
});

// Convenience route for stored user notifications
app.get('/notifications/:userId', (req, res) => {
  const { userId } = req.params;
  res.redirect(`/notifications?apiurl=http://localhost:${PORT}/api/notifications/${userId}`);
});

app.get('/favicon.png', (req, res) => {
  res.sendFile(__dirname + '/favicon.png');
});

app.use(express.static(path.join(__dirname, 'public')));

// ============ API ENDPOINTS FOR STORAGE ============

// Get notifications for a specific user (compatible with frontend)
app.get('/api/notifications/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const userData = notificationStorage.getNotificationsByUserId(userId);
    
    if (!userData) {
      return res.status(404).json({
        success: false,
        message: 'User notifications not found'
      });
    }
    
    // Return in format compatible with frontend: { "data": [...] }
    res.json({
      data: userData.notifications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Initialize/Set notifications for a specific user
app.post('/api/notifications/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const { notifications } = req.body;
    
    if (!notifications || !Array.isArray(notifications)) {
      return res.status(400).json({
        success: false,
        message: 'Notifications array is required'
      });
    }
    
    const userData = notificationStorage.setNotificationsByUserId(userId, notifications);
    
    res.json({
      success: true,
      message: 'Notifications saved successfully',
      data: userData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Initialize default data from BPJS API for a specific user
app.post('/api/notifications/:userId/seed', async (req, res) => {
  try {
    const { userId } = req.params;
    const BPJS_API = 'http://13.239.117.240:10077/api/bpjs/notification/list';
    
    // Fetch data from BPJS API
    const response = await fetch(BPJS_API);
    const result = await response.json();
    
    if (!result || !result.data) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch data from BPJS API'
      });
    }
    
    // Store the notifications for this user
    const userData = notificationStorage.setNotificationsByUserId(userId, result.data);
    
    res.json({
      success: true,
      message: 'Default notifications initialized successfully',
      data: userData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Mark notification as seen
app.patch('/api/notifications/:userId/:notificationId/seen', (req, res) => {
  try {
    const { userId, notificationId } = req.params;
    
    const notification = notificationStorage.markNotificationAsSeen(userId, notificationId);
    
    res.json({
      success: true,
      message: 'Notification marked as seen',
      data: notification
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get all users
app.get('/api/users', (req, res) => {
  try {
    const users = notificationStorage.getAllUsers();
    
    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// ============ END API ENDPOINTS ============

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log('');
  console.log('By default you can run it at:');
  console.log(`  http://localhost:${PORT}/notifications`);
  console.log('Or if you want to use your own API:');
  console.log(`  http://localhost:${PORT}/notifications?apiurl={INSERT_YOUR_API_HERE}`);
  console.log('');
  console.log('View stored user notifications:');
  console.log(`  http://localhost:${PORT}/notifications/:userId`);
  console.log(`  Example: http://localhost:${PORT}/notifications/user123`);
  console.log('');
  console.log('API Endpoints:');
  console.log(`  GET    http://localhost:${PORT}/api/notifications/:userId`);
  console.log(`  POST   http://localhost:${PORT}/api/notifications/:userId`);
  console.log(`  POST   http://localhost:${PORT}/api/notifications/:userId/seed`);
  console.log(`  PATCH  http://localhost:${PORT}/api/notifications/:userId/:notificationId/seen`);
  console.log(`  GET    http://localhost:${PORT}/api/users`);
  console.log('');
});
