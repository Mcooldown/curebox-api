const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ForumDetail = new Schema({
     forumHeader: {type: Schema.Types.ObjectId, required: true, ref:'ForumHeader'},
     user: {type: Schema.Types.ObjectId, required: true, ref: 'User'},
     content: {type: String, required: true},
     forumPhoto: {type: String, required: false},
});

module.exports = mongoose.model('ForumDetail', ForumDetail);