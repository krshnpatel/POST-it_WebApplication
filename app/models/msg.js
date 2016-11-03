// app/models/msg.js

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MsgSchema = new Schema({
    name: String
});

module.exports = mongoose.model('Msg', MsgSchema);