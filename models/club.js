const mongoose = require('mongoose');

const clubSchema = new mongoose.Schema({
    clubName: {
        type: String,
        required: true,
        unique: true
    },
    coach: {
        type: String,
        required: true
    },
    president: {
        type: String,
        required: true
    },
    createDate: {
        type: Date,
        required: true
    },
    players: [{
        name: String,
        position: String,
        dateOfBirth: Date,
        nationality: String,
        jerseyNumber: Number,
        contractUntil: Date,
        isCaptain: Boolean
    }]
},{ timestamps: true });

const Club = mongoose.model('Club', clubSchema);
module.exports = Club;
