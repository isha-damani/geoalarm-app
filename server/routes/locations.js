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

router.get('/', verifyToken, async (req,res) => {
    try{
        const user = req.user._id;
        const locations = await Location.find({owner:user});
        res.status(200).json(locations);
    }catch(err){
        res.status(400).json({
            error: err.message
        });
    }
});

router.delete('/:id', verifyToken, async (req,res) => {
    try{
        const deletedLocation = await Location.findOneAndDelete({_id:req.params.id, owner:req.user._id});
        if(deletedLocation===null){
            return res.status(404).json({
                error: "Location not found"
            });
        }
        res.status(200).json({
            message: "Location deleted",
            id: deletedLocation._id
        });
    }catch(err){
        res.status(400).json({
            error: err.message
        });
    }
});

module.exports = router;
