const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reportSchema = new mongoose.Schema({
    user: { 
        type: Schema.Types.ObjectId, ref: 'Users'
    },
    style: { 
        type: String, required: true 
    },
    reason: { 
        type: String, required: true 
    },
    createdAt: { 
        type: Date, default: Date.now 
    }
});

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;