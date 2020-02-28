const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const {check , validationResult} = require('express-validator/check')
const request = require('request');
const config = require('config');

const User = require('../../models/User');
const Profile = require('../../models/Profile');


//Me Route //GET api/profile/me
router.get('/me' , auth, async (req , res) => {
    try{
        const profile = await Profile.findOne({ user: req.user.id }).populate('user' , ['name' , 'avatar']);

        if(!profile){
            return res.status(400).json({ msg: 'Profil użytkownika nie istnieje'})
        }
        res.json(profile);
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server Error')
    }
});

// POST api/profile
// Create or update user profile
// access Private

router.post('/' ,[auth , [
    check('status' , 'Status jest wymagany!').not().isEmpty(),
    check('skills', 'Umiejętności są wymagane!').not().isEmpty()
]], async (req,res)=> {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() })
    }
    const {
        company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills,
        youtube,
        facebook,
        twitter,
        instagram,
        linkedin,
    } = req.body;
    
    //Build profile object
    const profileFields = {};
    profileFields.user = req.user.id;

    if(company) profileFields.company = company;
    if(website) profileFields.website = website;
    if(location) profileFields.location = location;
    if(bio) profileFields.bio = bio;
    if(status)  profileFields.status = status;
    if(githubusername) profileFields.githubusername = githubusername;

    if(skills) {
        profileFields.skills = skills.split(',').map(skill => skill.trim());

    }

    //Build social object 
    profileFields.social = {}
    if(youtube) profileFields.social.youtube = youtube;
    if(twitter) profileFields.social.twitter = twitter;
    if(facebook) profileFields.social.facebook = facebook;
    if(linkedin) profileFields.social.linkedin = linkedin;
    if(instagram) profileFields.social.instagram = instagram;


    try{
        let profile = await Profile.findOne({ user: req.user.id })

        if(profile){
            //Update
            profile = await Profile.findOneAndUpdate(
                { user: req.user.id }, 
                {$set: profileFields}, 
                { new: true}
                );

                return res.json(profile);
            }

            //Create 
            profile = new Profile(profileFields);
            await profile.save();
            res.json(profile);

    }catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }

})

// GET api/profile
// get all profiles
// public 

router.get('/' , async (req,res) => {

    try {
        const profiles = await Profile.find().populate('user', ['name' , 'avatar']);
        res.json(profiles)
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error")
    }

})

// GET api/profile/user/:user_id
// get profile by user ID
// public 

router.get('/user/:user_id' , async (req,res) => {

    try {
        const profile = await Profile.findOne({user: req.params.user_id}).populate('user', ['name' , 'avatar']);

        if(!profile) return res.status(400).json({msg: 'Nie znaleziono profilu!'})

        res.json(profile)

    } catch (err) {
        console.error(err.message);
        if(err.kind == 'ObjectId'){
            return res.status(400).json({msg: 'Nie znaleziono profilu!'})
        }
        res.status(500).send("Server Error")
    }

})


// Delete api/profile
// Delete profile , user & post
// Private

router.delete('/user/:user_id' ,auth, async (req,res) => {

    try {
        //Remove Profile
       await Profile.findOneAndRemove({user: req.user.id});
       //Remove user
       await User.findOneAndRemove({_id: req.user.id});
        res.json({msg: 'Użytkownik skasowany'})

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error")
    }

})


// PUT api/profile/experience
// Add profile experience
// Private

router.put('/experience' , [auth, [
    check('title' , 'Pole wymagane!').not().isEmpty(),
    check('company' , 'Pole wymagane').not().isEmpty(),
    check('from' , 'Pole wymagane').not().isEmpty()
]] , async (req , res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){

        return res.status(400).json({errors: errors.array()});

    }

    const {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    } = req.body;

    const newExp = {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    }
    try {
        const profile = await Profile.findOne({ user: req.user.id});

        profile.experience.unshift(newExp);

        await profile.save();

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(400).send('Server Errror')
    }
})

// DELETE api/profile/experience/:exp_id
// Delete experience from profile
// Private

router.delete('/experience/:exp_id' , auth , async (req,res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id })

        //Get remove index
        const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);

        profile.experience.splice(removeIndex, 1);

        await profile.save();
        res.json(profile)

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Errror');
    }
})

// PUT api/profile/education
// Add profile education
// Private

router.put('/education' , [auth, [
    check('school' , 'Pole wymagane!').not().isEmpty(),
    check('degree' , 'Pole wymagane').not().isEmpty(),
    check('fieldofstudy' , 'Pole wymagane').not().isEmpty(),
    check('from' , 'Pole wymagane').not().isEmpty()
]] , async (req , res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){

        return res.status(400).json({errors: errors.array()});

    }

    const {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    } = req.body;

    const newEdu = {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    }
    try {
        const profile = await Profile.findOne({ user: req.user.id});

        profile.education.unshift(newEdu);

        await profile.save();

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(400).send('Server Errror')
    }
})

// DELETE api/profile/education/:edu_id
// Delete education from profile
// Private

router.delete('/education/:edu_id' , auth , async (req,res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id })

        //Get remove index
        const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id);

        profile.education.splice(removeIndex, 1);

        await profile.save();
        res.json(profile)
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Errror');
    }
})

// GET api/profile/github/:username
// Get user repos from Github
// Public

router.get('/github/:username' , (req,res)=> {
    try {
        const options = {
            uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&
            sort=created:asc&client_id=${config.get('githubClientId')}&client_secret=${config.get('githubSecret')}`,
            method: 'GET',
            headers: {'user-agent': 'node.js'}
        }

        request(options , (error , response , body) => {
            if(error) console.error(error);

            if(response.statusCode !== 200){
                return res.status(404).json({msg: 'Brak repozytorium Github'});
            }
            res.json(JSON.parse(body))
        })
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
})




module.exports = router;