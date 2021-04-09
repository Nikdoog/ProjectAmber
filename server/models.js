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
        required: true,
        unique: true,
        default: 'Marsville'
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

const Country = mongoose.model('Country', countrySchema, 'Countries');


//
// DECISIONS
//

const choiceSchema = new mongoose.Schema({
    // A description of the choice.  Should give some hint as to likely outcomes.
    description: {
        type: String,
        required: true
    },
    //  How the result is described in text
    result: {
        type: String,
        required: true
    },
    //  Resource cost to make this decision.  Some decisions may not be available if you have insufficient resources.
    cost: {
        type: stockpileSchema,
    },
    outcomes: {}
});

const decisionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    choices: {
        type:[choiceSchema]
    },

})


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
        type: ObjectID,
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
});

const Player = mongoose.model('Player', playerSchema, 'Players');

// Export

module.exports = {Player, Country}