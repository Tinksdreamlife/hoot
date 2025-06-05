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
  console.log("Inside of signup create")
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

// GET /api/hoots/:hootId

router.get('/:hootId', checkToken, async (req, res) => {
  try {
    // populate author of hoot and comments
    const hoot = await Hoot.findById(req.params.hootId).populate([
      'author',
      'comments.author',
    ]);
    res.status(200).json(hoot);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});


router.put("/:hootId", checkToken, async (req, res) => {
  try {
    // Find the hoot:
    const hoot = await Hoot.findById(req.params.hootId);

    // Check permissions:
    if (!hoot.author.equals(req.user._id)) {
      return res.status(403).send("You're not allowed to do that!");
    }

    // Update hoot:
    const updatedHoot = await Hoot.findByIdAndUpdate(
      req.params.hootId,
      req.body,
      { new: true }
    );

    // Append req.user to the author property:
    updatedHoot._doc.author = req.user;

    // Issue JSON response:
    res.status(200).json(updatedHoot);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});


router.delete("/:hootId", checkToken, async (req, res) => {
  try {
    const hoot = await Hoot.findById(req.params.hootId);

    if (!hoot.author.equals(req.user._id)) {
      return res.status(403).send("You're not allowed to do that!");
    }

    const deletedHoot = await Hoot.findByIdAndDelete(req.params.hootId);
    res.status(200).json(deletedHoot);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});


router.post("/:hootId/comments", checkToken, async (req, res) => {
  try {
    req.body.author = req.user._id;
    const hoot = await Hoot.findById(req.params.hootId);
    hoot.comments.push(req.body);
    await hoot.save();

    // Find the newly created comment:
    const newComment = hoot.comments[hoot.comments.length - 1];

    newComment._doc.author = req.user;

    // Respond with the newComment:
    res.status(201).json(newComment);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});


