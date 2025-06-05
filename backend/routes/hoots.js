const express = require('express');
const router = express.Router();
const hootsCtrl = require('../controllers/hoots');
const ensureLoggedIn = require('../middleware/ensureLoggedIn');

// All paths start with '/api/hoots'

// Protect all defined routes
router.use(ensureLoggedIn);
console.log("Inside of routes")

// GET /api/hoots (INDEX action)
router.get('/', hootsCtrl.index);

// POST /api/hoots (CREATE action)
router.post('/', hootsCtrl.create);

// GET /api/hoots/:hootId
router.get('/:hootId', hootsCtrl.index)


// PUT /hoots/:hootId
router.put('/:hootId', hootsCtrl.index)

//DELETE /hoots/:hootId
router.delete('/:hootId', hootsCtrl.delete);

module.exports = router;