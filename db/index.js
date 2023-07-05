const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI;

// Create a variable to track whether the error has been logged
let errorLogged = false;

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    connectTimeoutMS: 5000,
  })
  .then(() => {
    console.log('DB is connected!');
  })
  .catch((ex) => {
    if (!errorLogged) {
      console.log('DB connection failed:', ex);
      errorLogged = true;
    }
  });
