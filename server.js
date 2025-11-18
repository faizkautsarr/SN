const express = require('express');
const app = express();
const path = require('path');

app.use(express.static(__dirname)); // serve all files inside SN

// Route: /notification → notifications.html
app.get('/notification', (req, res) => {
  res.sendFile(path.join(__dirname, 'notifications.html'));
});

app.listen(9999, () => {
  console.log('Server running on port 9999');
});
