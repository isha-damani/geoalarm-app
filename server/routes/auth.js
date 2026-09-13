const express = require('express');
const User = require('../models/User');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post('/signup',async (req,res) => {
    try{
        const {email,password} = req.body;
        const salt = await bcryptjs.genSalt(10);
        const passwordHash = await bcryptjs.hash(password,salt);
        const newUser = await User.create({
            email,
            passwordHash
        })
        res.status(201).json({
            _id: newUser._id,
            email: newUser.email
        });
    }
    catch(err){
        res.status(400).json({
            error: err.message
        });
    }
});

router.post('/login', async (req, res) => {
    try{
        const {email,password} = req.body;
        const user = await User.findOne({email});
        if(user===null){
            return res.status(401).json({
                error: "Invalid credentials"
            });
        }
        const storedHash = user.passwordHash;
        const isMatch = await bcryptjs.compare(password,storedHash);
        if(!isMatch){
            return res.status(401).json({
                error: "Invalid credentials"
            });
        }
        const payload = {
            _id: user._id,
        };
        const token = jwt.sign(payload,process.env.JWT_SECRET, {expiresIn: '7d'});
        res.status(200).json({
            token
        });
    }catch(err){
        res.status(400).json({
            error: err.message
        });
    }
});

module.exports = router;



