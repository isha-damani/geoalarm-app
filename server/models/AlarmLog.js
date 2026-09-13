const mongoose = require('mongoose');

const alarmLogSchema = new mongoose.Schema({
    location: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location',
        required: true
    },
    owner : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    acknowledged: {
        type: Boolean,
        default: false
    }
},
{
    timestamps: true
});

module.exports = mongoose.model('AlarmLog', alarmLogSchema);