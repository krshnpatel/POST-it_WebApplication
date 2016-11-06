// app/models/msg.js

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MsgSchema = new Schema({
    key: String
});

module.exports = mongoose.model('Msg', MsgSchema);