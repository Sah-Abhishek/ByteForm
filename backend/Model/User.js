const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minLength: 3,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,

    },
    password: {
        type: String,
        required: true,
        minLength: 6,
    },
    role: {
        type: String,
        enum: ['creator', 'filler'],
        default: 'creator'
    }
    ,
    // forms: [{
    //     type: mongoose.Schema.Types.objectId,
    //     ref: 'Form',

    // }],

},
    {
        timestamps: true
    }
)

const User = mongoose.model('User', userSchema);

module.exports = User;