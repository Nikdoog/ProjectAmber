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
        default: {
            demographics: {
                Fenguli: 100,
                Ascended: 100,
                Cosmeys: 100
            },
            character: {
                happiness: 10,
                productivity: 10,
                culture: 10
            },
            resources: {
                pizzas: 100,
                ore: 0,
                energy: 0,
                water: 0
            }
        }
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
});

const Player = mongoose.model('Player', playerSchema, 'Players');

// Export

module.exports = {Player}
