const express = require('express');
const router = express.Router();
const Feedback = require('../models/feedback');

// Middleware to protect routes
function isAuthenticated(req, res, next) {
  if (req.session.studentId) return next();
  res.redirect('/login');
}

// Show feedback form
router.get('/', isAuthenticated, async (req, res) => {
  const feedbacks = await Feedback.find({ studentId: req.session.studentId });
  res.render(__dirname + '/../views/feedback', { feedbacks });
});

// Add feedback
router.post('/add', isAuthenticated, async (req, res) => {
  await new Feedback({
    studentId: req.session.studentId,
    feedbackText: req.body.feedbackText
  }).save();
  res.redirect('/feedback');
});

// Edit feedback page
router.get('/edit/:id', isAuthenticated, async (req, res) => {
  const feedback = await Feedback.findById(req.params.id);
  if (feedback.studentId.toString() !== req.session.studentId.toString()) {
    return res.send("Unauthorized");
  }
  res.render(__dirname + '/../views/edit_feedback', { feedback });
});

// Update feedback
router.post('/edit/:id', isAuthenticated, async (req, res) => {
  await Feedback.updateOne({ _id: req.params.id, studentId: req.session.studentId }, {
    feedbackText: req.body.feedbackText
  });
  res.redirect('/feedback');
});

// Delete feedback
router.get('/delete/:id', isAuthenticated, async (req, res) => {
  await Feedback.deleteOne({ _id: req.params.id, studentId: req.session.studentId });
  res.redirect('/feedback');
});

module.exports = router;
