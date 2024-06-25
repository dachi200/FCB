const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Club = require('../models/club');
const Player = require('../models/player');

// POST request to create a new club
router.post('/', async (req, res, next) => {
    try {
        const { clubName, coach, president, createDate, players } = req.body;

        const newClub = new Club({
            clubName,
            coach,
            president,
            createDate,
            players
        });

        const savedClub = await newClub.save();
        res.status(201).json(savedClub);
    } catch (err) {
        next(err);
    }
});

// PUT request to update a club by ID and add a player to it
router.put('/clubs/:clubId/add-player/:playerId', async (req, res) => {
    try {
        const { clubId, playerId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(clubId) || !mongoose.Types.ObjectId.isValid(playerId)) {
            return res.status(400).json({ message: 'Invalid clubId or playerId' });
        }

        const club = await Club.findById(clubId);
        if (!club) {
            return res.status(404).json({ message: 'Club not found' });
        }

        const player = await Player.findById(playerId);
        if (!player) {
            return res.status(404).json({ message: 'Player not found' });
        }

        // Check if the player already exists in the club
        if (!club.players.some(p => p._id.equals(player._id))) {
            club.players.push(player);
            await club.save();
        }

        res.json(club);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.get('/clubs', async (req, res) => {
    try {
        const clubs = await Club.find().populate({
            path: 'players',
            select: '-_id name position dateOfBirth nationality jerseyNumber contractUntil isCaptain'
        });
        res.json(clubs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.delete('/clubs/:clubId/remove-player/:playerId', async (req, res) => {
    try {
        const { clubId, playerId } = req.params; 


        // Check if clubId and playerId are valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(clubId) || !mongoose.Types.ObjectId.isValid(playerId)) {
            return res.status(400).json({ message: 'Invalid clubId or playerId' });
        }

        // Find the club by ID
        const club = await Club.findById(clubId);
        if (!club) {
            return res.status(404).json({ message: 'Club not found' });
        }

        // Convert all player IDs in the club's players array to strings
        const playerIndex = club.players.map(id => id.toString()).indexOf(playerId);
        if (playerIndex > -1) {
            club.players.splice(playerIndex, 1);
            await club.save(); // Save the updated club document
            return res.json({ message: 'Player removed from club', club });
        } else {
            return res.status(404).json({ message: 'Player not found in club' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
