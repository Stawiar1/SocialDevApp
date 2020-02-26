const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check , validationResult  } = require('express-validator/check');

const User = require('../../models/User.js')



router.post('/' ,[
    check('name', 'Imię jest wymagane!').not().isEmpty(),
    check('email' , 'Wpisz prawidłowy e-maiL!').isEmail(),
    check('password', 'Wpisz poprawne hasło (minimum 6 znaków!').isLength({min: 6})
],  async (req , res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    
    const {name , email , password} = req.body;

    try {

        let user = await User.findOne({ email });
        if(user){
            return res.status(400).json({ errors: [{msg: 'Użytkownik już istnieje!'}] })
        }



    const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm'
    })

    user = new User ({
        name,
        email,
        avatar,
        password
    })
    // Encrypting password
    const salt = await bcrypt.genSalt(10);
    //salt generator (cryptographic)
    user.password = await bcrypt.hash(password, salt);

    await user.save();

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
    // Get users gravatar (based on email)
    //Encrypt password
    //Return jsonwebtoken

    }catch(err){

    console.error(err.message);
    res.status(500).send('Server error');
    }

});


module.exports = router;