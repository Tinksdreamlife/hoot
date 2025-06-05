const Hoot = require('../models/hoot');
const express = require("express");
const checkToken = require('../middleware/checkToken.js');
const router = express.Router();

module.exports = router;

async function index(req, res) {
  try {
    const hoots = await Hoot.find({});
    // Below would return all Hoots for just the logged in user
    // const hoots = await Hoot.find({author: req.user._id});
    res.json(hoots);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Failed to fetch Hoots' });
  }
}

async function create(req, res) {
  console.log("Inside of sign-up create")
  try {
    req.body.author = req.user._id;
    const hoot = await Hoot.create(req.body);
    res.json(hoot);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: 'Failed to create Hoot' });
  }
}

router.post('/', checkToken, async (req, res) => {
  try {
    req.body.author = req.user._id;
    const hoot = await Hoot.create(req.body);
    hoot._doc.author = req.user;
    res.json(hoot);
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: err.message })
  }
});

router.get('/', checkToken, async (req, res) => {
  try {
    const hoots = await Hoot.find({})
      .populate("author")
      .sort({ createdAt: "desc" });
    res.status(200).json(hoots);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

