const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth')
const User = require('../../models/User')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check , validationResult  } = require('express-validator/check');



router.get('/' , auth , async (req , res) => {
    try{
        const user = await (await User.findById(req.user.id)).isSelected('-password');
        res.json(user);
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server Error')
    }
});
router.post('/' ,[
    check('email' , 'Wpisz prawidłowy e-maiL!').isEmail(),
    check('password', 'Hasło jest wymagane!').exists()
],  async (req , res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    
    const {email , password} = req.body;

    try {

        let user = await User.findOne({ email });
        if(!user){
            return res.status(400).json({ errors: [{msg: 'Nieprawidłowe dane!'}] })
        }

        const isMatch = await bcrypt.compare(password , user.password)

        if(!isMatch){
            return res.status(400).json({ errors: [{msg: 'Nieprawidłowe dane!'}] })
        }

    const payload = {
        user: {
            id: user.id
        }
    }
        jwt.sign(
        payload, 
        config.get('jwtSecret'),
        {expiresIn: 36000},
        (err , token) =>{
            if(err) throw err;
            res.json({token});
        });

    }catch(err){

    console.error(err.message);
    res.status(500).send('Server error');
    }

});



module.exports = router;