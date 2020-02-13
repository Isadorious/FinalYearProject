const mongoose = require(`mongoose`);
const bcrypt = require(`bcrypt`);
 
const environment = process.env.NODE_ENV;
 
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
       trim: true
   },
   profilePicture : {
       type: `String`
   }
});

userSchema.pre(`save`, function(next){
    const user = this;
    const saltingRounds = parseInt(process.env.SALT_ROUNDS);
    if(!user.isModified || !user.isNew) { // Don't perform any of these operations if the user data hasn't been updated
        next();
    }
    else
    {
        bcrypt.hash(user.password, saltingRounds, function(err, hash){
            if(err){
                console.log(`Error hashing password for user`, user.username);
                next(err);
            } else {
                user.password = hash;
                next();
            }
        })
    }
 });

module.exports = mongoose.model(`User`, userSchema);