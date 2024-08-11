require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require("mongoose");
const cloudinary = require("./config/cloudinaryConfig");
const userRoutes = require('./routes/UserRoutes');
const cors = require('cors');
const expressLayout = require('express-ejs-layouts');
// const authMiddleware = require('./middleware/authMiddleware'); // Importing authMiddleware

const app = express();
const PORT = 5000 || process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error('Could not connect to MongoDB..', err));

app.use(express.static('public'));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
    origin: 'https://movie-web-peach-seven.vercel.app/',
    credentials: true, // Allow credentials (cookies) to be sent
};
app.use(cors(corsOptions));

// Use authMiddleware after setting up required middlewares
// app.use(authMiddleware);
console.log("Hello");
app.use(express.json());
app.use(expressLayout);
app.set('layout', './layout/main');
app.set('view engine', 'ejs');
app.use('/api', userRoutes);

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
  
    
});
