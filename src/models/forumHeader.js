const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ForumHeader = new Schema ({
     user: {type: Schema.Types.ObjectId, required: true, ref: 'User'},
     title: {type: String, required: true},
     content: {type: String, required: true},
     forumPhoto: {type: String, required: false},
},{
     timestamps: true,
});

module.exports = mongoose.model('ForumHeader', ForumHeader);