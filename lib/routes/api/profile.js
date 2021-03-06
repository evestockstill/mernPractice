/* eslint-disable no-undef */
/* eslint-disable new-cap */
const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const Profile = require('../../model/Profile');
const User = require('../../model/User');

// @route GET api/profile/me
//@desc current users profile
//@access Private
router.get('/me', auth, async(req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar']);
        if(!profile) {
            return res.status(400).json({ msg: 'There is no profile for this user' });
        }
        res.json(profile);
    } catch(err) {
        console.error(err.message);
        res.status(500).send('server error');
    }

});

// @route post api/profile
//@desc create or update users profile
//@access Private
router.post('/', [
    auth, 
    [
        check('status', 'status is required')
            .not()
            .isEmpty(),
        check('skills', 'skills is required')
            .not()
            .isEmpty(),
    ]],
async(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const {
        company, website, location, bio, status, gitHubUserName, skills, youTube, faceBook, twitter, instagram, linkedIn
    } = req.body;
    // build profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    if(company) profileFields.location = company;
    if(location) profileFields.location = location;
    if(website) profileFields.website = website;
    if(bio) profileFields.bio = bio;
    if(status) profileFields.status = status;
    if(gitHubUserName) profileFields.gitHubUserName = gitHubUserName;
    if(skills) profileFields.skills = skills.split(',').map(skill => skill.trim()) ;

    // build social object
    profileFields.social = {};
    if(twitter) profileFields.social.twitter = twitter;
    if(youTube) profileFields.social.youTube = youTube;
    if(faceBook) profileFields.social.faceBook = faceBook;
    if(linkedIn) profileFields.social.linkedIn = linkedIn;
    if(instagram) profileFields.social.instagram = instagram;

    try {
        let profile = await Profile.findOne({ user: req.user.id });
        if(profile) {
            profile = await Profile.findOneAndUpdate(
                { user: req.user.id }, 
                { $set: profileFields }, 
                { new: true }
            );
            return res.json(profile);
        }
        // create
        profile = new Profile(profileFields);
        await profile.save();
        res.json(profile);
    } catch(err) {
        console.error(err.message);
        res.status(500).send('server error');
    }
}
);

module.exports = router;



