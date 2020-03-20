/* eslint-disable no-undef */
/* eslint-disable new-cap */
const express = require('express');
const router = express.Router();

// @route GET api/profile
//@desc test route
//@access Public
router.get('/', (req, res) => res.send('Profile route'));

module.exports = router;
