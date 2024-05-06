const app = require('./app');
const express = require('express');
const cors = require('cors');

// Allow requests from all origins
// app.use(cors({ origin: '*' }));

// Other middleware and route handlers...

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
