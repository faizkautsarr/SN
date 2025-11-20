const fs = require('fs');
const path = require('path');

// Storage directory
const STORAGE_DIR = path.join(__dirname, '../../data');
const STORAGE_FILE = path.join(STORAGE_DIR, 'notifications.json');

// Ensure storage directory and file exist
function ensureStorage() {
  if (!fs.existsSync(STORAGE_DIR)) {
    fs.mkdirSync(STORAGE_DIR, { recursive: true });
  }
  if (!fs.existsSync(STORAGE_FILE)) {
    fs.writeFileSync(STORAGE_FILE, JSON.stringify({}));
  }
}

// Read all data from storage
function readStorage() {
  ensureStorage();
  const data = fs.readFileSync(STORAGE_FILE, 'utf8');
  return JSON.parse(data);
}

// Write all data to storage
function writeStorage(data) {
  ensureStorage();
  fs.writeFileSync(STORAGE_FILE, JSON.stringify(data, null, 2));
}

// Get notifications for a specific user
function getNotificationsByUserId(userId) {
  const storage = readStorage();
  return storage[userId] || null;
}

// Set notifications for a specific user
function setNotificationsByUserId(userId, notifications) {
  const storage = readStorage();
  storage[userId] = {
    userId,
    notifications,
    lastUpdated: new Date().toISOString()
  };
  writeStorage(storage);
  return storage[userId];
}

// Update a specific notification's seenAt status
function markNotificationAsSeen(userId, notificationId) {
  const userData = getNotificationsByUserId(userId);
  if (!userData) {
    throw new Error('User data not found');
  }

  const notification = userData.notifications.find(n => n.id === notificationId);
  if (!notification) {
    throw new Error('Notification not found');
  }

  if (!notification.seenAt) {
    notification.seenAt = new Date().toISOString();
    setNotificationsByUserId(userId, userData.notifications);
  }

  return notification;
}

// Get all users
function getAllUsers() {
  const storage = readStorage();
  return Object.keys(storage);
}

module.exports = {
  getNotificationsByUserId,
  setNotificationsByUserId,
  markNotificationAsSeen,
  getAllUsers
};
