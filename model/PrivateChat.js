
const mongoose = require('mongoose');

const privateChatSchema = new mongoose.Schema({
    admin: {
        type: String,
        required: true,
    },
    guest: {
        type: String,
        required: true
    },
    history: {
        type: Array,
        required: true,
    }
});

module.exports = mongoose.model('PrivateChat', privateChatSchema);