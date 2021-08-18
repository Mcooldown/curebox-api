const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Article = new Schema({
     title: {type: String, required: true },
     content: { type: String, required: true},
     articlePhoto: {type: String, required: true},
     user: {type: Schema.Types.ObjectId, required: true, ref: 'User'},
},{
     timestamps: true,
});

module.exports = mongoose.model('Article', Article);