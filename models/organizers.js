const mongoose = require('mongoose');

const organizerSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        unique: true
    },
    organizer_info:{
        email: {
            type: String,
            required: true
        },
        avatar: {
            type: String,
        },
        fullName: {
            type: String,
            required: true
        },
        walletAddress: {
            type: String,
            required: true
        }
    },
    numConferences: {
        type: Number,
        default: 0
    }
});

const Organizers = mongoose.model('Organizer', organizerSchema);

module.exports = Organizers;
