const mongoose = require('mongoose');

const articleschema = new mongoose.Schema({
title:{
  type:String,
 required :true,
},
category:{
  type:String,
  required:true,
},
 description:{
  type:String,
 },
 createdAt:{
  type: Date,
  default: Date.now
 }
});

module.exports = mongoose.model('Article',articleschema)
