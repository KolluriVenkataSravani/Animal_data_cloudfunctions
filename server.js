// server.js
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Handle GET request for index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle POST request for store.js
app.post('/store', (req, res) => {
  // Handle store form submission data here
  console.log(req.body);
  res.send('Store form submission successful!');
});

// Handle POST request for update.js
app.post('/update', (req, res) => {
  // Handle update form submission data here
  console.log(req.body);
  res.send('Update form submission successful!');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
