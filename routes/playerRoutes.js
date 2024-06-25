const express = require('express');
const router = express.Router();
const Player = require('../models/player');
const Club = require('../models/club');

// POST request to create a new player
router.post('/players', async (req, res, next) => {
try {
        const { name, position, dateOfBirth, nationality, jerseyNumber, contractUntil, isCaptain, clubId } = req.body;
if (!clubId) {
        return res.status(400).json({ message: 'clubId is required' });
}

        const club = await Club.findById(clubId);
        if (!club) {
                return res.status(404).json({ message: 'Club not found' });
        }

const newPlayer = new Player({
        name,
        position,
        dateOfBirth,
        nationality, 
        jerseyNumber,
        contractUntil,
        isCaptain,
        club: clubId
});

        const savedPlayer = await newPlayer.save();

if (!club.players.includes(savedPlayer._id)) {
        club.players.push(savedPlayer._id);
        await club.save();
}

        res.status(201).json(savedPlayer);
} catch (err) {
        next(err);
}
});

// GET request to fetch all players
router.get('/players', async (req, res, next) => {
try {
        const players = await Player.find();
        res.json(players);
} catch (err) {
        next(err);
}
});

router.put('/players/:id', async (req, res) => {
        const { name, position, dateOfBirth, nationality, jerseyNumber, contractUntil, isCaptain } = req.body;
try {
        const updatedPlayer = await Player.findByIdAndUpdate(
                req.params.id,
                { name, position, dateOfBirth, nationality, jerseyNumber, contractUntil, isCaptain },
                { new: true }
);

if (!updatedPlayer) {
                return res.status(404).json({ message: 'Player not found' });
}
        res.json(updatedPlayer);
} catch (err) {
        console.error(err);
        res.status(400).json({ message: err.message });
}
});

module.exports = router;
