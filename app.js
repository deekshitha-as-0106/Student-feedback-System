const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();

// Direct MongoDB URI and Session Secret
const MONGODB_URI = 'mongodb://localhost:27017/student_feedback';
const SESSION_SECRET = 'mySecret123';

// DB Connection
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

// Static files and View engine
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Routes
const authRoutes = require('./routes/auth');
const feedbackRoutes = require('./routes/feedback');
app.use('/', authRoutes);
app.use('/feedback', feedbackRoutes);

// Start Server
app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
