const express = require('express');
const path = require('path');
const app = express();
const PORT = 9999;

// Example route
app.get('/notifications', (req, res) => {
  res.sendFile(path.join(__dirname, 'notifications.html'));
});


// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log('');
  console.log('By default you can run it at:');
  console.log(`  http://localhost:${PORT}/notifications`);
  console.log('Or if you want to use your own API:');
  console.log(`  http://localhost:${PORT}/notifications?apiurl={INSERT_YOUR_API_HERE}`);
  console.log('');
});