const express = require('express');
const AlarmLog = require('../models/AlarmLog');
const {verifyToken} = require('../middleware/auth');
const Location = require('../models/Location');

const router = express.Router();

router.post('/',verifyToken, async (req,res) => {
    try{
        const {location} = req.body;
        const owner = req.user._id;
        const existingLocation = await Location.findOne({_id : location, owner : owner});
        if(!existingLocation){
            return res.status(400).json({
                error : "Invalid location"
            });
        }
        const newalarmLog = await AlarmLog.create({location,owner});
        res.status(201).json(newalarmLog);
    }catch(err){
        res.status(400).json({
            error : err.message
        });
    }
});

router.get('/', verifyToken, async (req,res) => {
    try{
        const owner = req.user._id;
        const alarmLogs = await AlarmLog.find({owner});
        res.status(200).json(alarmLogs);
    }catch(err){
        res.status(400).json({
            error : err.message
        });
    }
});

router.patch('/:id',verifyToken, async (req,res) => {
    try{
        const alarmLog = await AlarmLog.findOneAndUpdate({_id : req.params.id, owner: req.user._id}, {acknowledged:true}, {new : true});
        if(alarmLog===null){
            return res.status(404).json({
                error : "Invalid alarm log"
            });
        }
        res.status(200).json(alarmLog);
    }
    catch(err){
        res.status(400).json({
            error: err.message
        })
    }
});

module.exports = router;