const mongoose = require('mongoose');

const speakerSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        unique: true
    },
    conferences: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conferences'
    }]
});

module.exports = mongoose.model('Speakers', speakerSchema);
