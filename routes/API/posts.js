const express = require('express');
const router = express.Router();
const {check , validationResult} = require('express-validator/check');
const auth = require('../../middleware/auth');

const Post = require('../../models/Post');
const Profile = require('../../models/Profile');
const User = require('../../models/User');

//POST api/posts
//Create a post
//Private 

router.post('/' ,[ auth , [
    check('text' , 'Wpisz coś!').not().isEmpty()

] ],async (req , res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() })
    }

    try {
    const user = await User.findById(req.user.id).select('-password');

    const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
    })        

    const post = await newPost.save();
    res.json(post);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }

});

//GET api/posts
//GET all posts
//Private 

router.get('/' , auth , async (req , res) => {
    try {
        const posts = await Post.find().sort({ date: -1});
        res.json(posts)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error')
    }
} );

//GET api/posts/:id
//GET post by ID
//Private 

router.get('/:id' , auth , async (req , res) => {
    try {
        const post = await Post.findById(req.params.id);

        if(!post){
            return res.status(404).json({msg: 'Brak postu!'})
        }

        res.json(post)
    } catch (err) {
        console.error(err.message);
        if(err.king === 'ObjectId'){
            return res.status(404).json({msg: 'Brak postu!'})
        }
        res.status(500).send('Server error')
    }
} );

//DELETE api/posts/:id
//DELETE a post
//Private 

router.delete('/:id' , auth , async (req , res) => {
    try {
        const post = await Post.findById(req.params.id);

        if(!post){
            return res.status(404).json({msg: 'Brak postu!'})
        }

        //Check if user is owner a post 
        if (post.user.toString() != req.user.id){
            return res.status(401).json({ msg: 'Nie masz takich uprawnień!'})
        }

        await post.remove();


        res.json({msg: 'Post removed'})
    } catch (err) {
        console.error(err.message);
        if(err.king === 'ObjectId'){
            return res.status(404).json({msg: 'Brak postu!'})
        }
        res.status(500).send('Server error')
    }
} );



module.exports = router;