const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    position: {
        type: String,
        enum: ['Goalkeeper', 'Defender', 'Midfielder', 'Forward'],
        required: true
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    nationality: {
        type: String,
        required: true
    },
    jerseyNumber: {
        type: Number,
        required: true,
        min: 1,
        max: 99
    },
    contractUntil: {
        type: Date,
        required: true
    },
    isCaptain: {
        type: Boolean,
        default: false
    },
    club: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Club'
    }
},{ timestamps: true });

const Player = mongoose.model('Player', playerSchema);
module.exports = Player;
