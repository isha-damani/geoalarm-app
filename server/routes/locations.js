const express = require('express');
const Location = require('../models/Location');
const {verifyToken} = require('../middleware/auth');

const router = express.Router();

router.post('/',verifyToken,async (req,res) => {
    try{
        const {name,radius,coordinates} = req.body;
        const user = req.user;
        const newLocation = await Location.create({name,radius,coordinates,owner:user._id});
        res.status(201).json(newLocation);
    }catch(err){
       res.status(400).json({
           error: err.message
       });
    }
});

module.exports = router;
