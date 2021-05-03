const mongoose = require('mongoose');
const {ObjectID} = require('mongodb');

//           //
// COUNTRIES //
//           //


const characteristicsSchema = new mongoose.Schema({
    happiness: {
        type: Number,
        default: 0
    },
    productivity: {
        type: Number,
        default: 0
    },
    culture: {
        type: Number,
        default: 0
    }
});

const stockpileSchema = new mongoose.Schema({
    pizzas: {
        type: Number,
        default: 0
    },
    ore: {
        type: Number,
        default: 0
    },
    energy: {
        type: Number,
        default: 0
    },
    water: {
        type: Number,
        default: 0
    },
});

const populationSchema = new mongoose.Schema({
    Fenguli: {
        type: Number,
        default: 0
    },
    Ascended: {
        type: Number,
        default: 0
    },
    Cosmeys: {
        type: Number,
        default: 0
    }
});

const countrySchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
    },
    demographics: {
        type: populationSchema,
    },
    resources: {
        type: stockpileSchema,
        default: {
            pizzas: 0
        }
    },
    character: {
        type: characteristicsSchema
    },
    description: {
        type: String
    }
});



//
// OUT-OF-GAME
//


const playerSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    country: {
        type: countrySchema,
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
});

const Player = mongoose.model('Player', playerSchema, 'Players');

// Export

module.exports = {Player}
