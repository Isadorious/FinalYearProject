const mongoose = require(`mongoose`);
const bcrypt = require(`bcrypt`);
 
const environment = process.env.NODE_ENV;
const stage = require(`../config`)[environment];
 
const Schema = mongoose.Schema;
 
const userSchema = new Schema({
   username: {
       type: `String`,
       required: true,
       trim: true,
       unique: true
   },
   email: {
       type:`String`,
       required: true,
       trim: true,
       unique: true
   },
   password: {
       type:`String`,
       required: true,
       trim: true
   },
   nickname: {
       type: `String`,
       required: true,
       trim: true
   },
   description: {
       type: `String`,
       required: true,
       trim: true
   },
   profilePicture : {
       type: `String`
   }
});

module.exports = mongoose.model(`User`, userSchema);