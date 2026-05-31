
const express = require('express');
const router = express.Router();
const Resume = require('../models/Resume');

router.post('/', async (req, res) => {
  const newResume = new Resume(req.body);
  const saved = await newResume.save();
  res.json(saved);
});

router.get('/:id', async (req, res) => {
  const resume = await Resume.findById(req.params.id);
  res.json(resume);
});

module.exports = router;
