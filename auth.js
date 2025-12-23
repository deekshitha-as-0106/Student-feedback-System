const express = require('express');
const router = express.Router();
const Student = require('../models/student');

// Registration Page
router.get('/', (req, res) => {
  res.sendFile(__dirname + '/../views/index.html');
});

// Register
router.post('/register', async (req, res) => {
  const { name, email, password, course } = req.body;
  const student = new Student({ name, email, password, course });
  await student.save();
  req.session.studentId = student._id;
  res.redirect('/feedback');
});

// Login Page
router.get('/login', (req, res) => {
  res.sendFile(__dirname + '/../views/login.html');
});

// Login Logic
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const student = await Student.findOne({ email, password });
  if (student) {
    req.session.studentId = student._id;
    res.redirect('/feedback');
  } else {
    res.send("Invalid credentials");
  }
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
