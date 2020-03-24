/* eslint-disable no-undef */
/* eslint-disable new-cap */
const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../model/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');

// @route GET api/auth
//@desc test route
//@access Public
router.get('/', auth, async(req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        return res.json(user);
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// @route POST api/auth
router.post(
    '/',
    [
        
        check('email', 'Please include a valid email').isEmail(),
        check(
            'password',
            'password is required'
        ).exists()
    ],
    async(req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { email, password } = req.body;

        try {
            let user = await User.findOne({ email });
            if(!user) {
                return res
                    .status(400)
                    .json({ errors: [{ msg: 'invalid email/password' }] });
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if(!isMatch) {
                return res
                    .status(400)
                    .json({ errors: [{ msg: 'invalid email/password' }] });
            }
            const payload = {
                user: {
                    id: user.id
                }
            };
            jwt.sign(payload, process.env.APP_SECRET,
                { expiresIn: 36000 },
                (err, token) => {
                    if(err) throw err;
                    res.json({ token });
                });
        } catch(err) {
            console.error(err.message);
            res.status(500).send('server error');
        }
        console.log(req.body);
    }
);

module.exports = router;
