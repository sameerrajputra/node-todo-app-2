const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

mongoose.plugin(schema => { schema.options.usePushEach = true });
const Schema = mongoose.Schema;

var UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    require: true,
    minlength: 6
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
});

////Generating a hash value for password and saving password = hashed value

UserSchema.pre('save', function(next){
  var user = this;

  if(user.isModified('password')){
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        console.log(hash);
        user.password = hash;
        next();
      });
    });

  }else{
    next();
  }
})


UserSchema.methods.toJSON = function(){
  var user = this;
  // console.log(`user: ${user}`);
  //THis is optional
  var userObj = user.toObject();     //convert mongoose variable to Object
  // console.log(`userObj : ${userObj}`);
  // console.log(`userObj : ${JSON.stringify(userObj)}`);


  return _.pick(userObj, ['_id', 'email']);


};

UserSchema.methods.generateAuthToken = function () {
  var user = this;
  var access = 'auth';
  var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();

  user.tokens.push({access, token});

  return user.save().then(() => {
    return token;
  });
};

UserSchema.statics.findByToken = function(token){
  var User = this;
  var decoded;

  try{
    decoded = jwt.verify(token, 'abc123');
  }catch(e){
    return Promise.reject();
  }

  return User.findOne({
    _id: decoded._id,
    'tokens.token':token,
    'tokens.access': 'auth'
  });
};


var User = mongoose.model('User', UserSchema);

module.exports = {User}
