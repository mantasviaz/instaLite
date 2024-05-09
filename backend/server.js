const app = require('./app');

// Allow requests from all origins
//app.use(cors({ origin: '*' }));

// Other middleware and route handlers...

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
