const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
        min:2,
        max:20,
    },
    last_name: {
        type: String,
        required: true,
        min:2,
        max:20,
    },
    user_name: {
        type: String,
        required: true,
        min:2,
        max:20,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    role: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
   
    active: {
        type: Boolean,
        required: true,
        
    },
    last_login: {
        type: Date,
        default: null
    }

},
{
    timestamps: true,
  }
);

const Users = mongoose.model('Users', usersSchema);

module.exports = Users;