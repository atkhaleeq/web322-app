const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let userSchema = new Schema({
    userName:{
        type: String, unique: true
    },
    password: String,
    email: String,
    loginHistory: [{dateTime: Date, userAgent: String,}]
   
  });

  let User;

  module.exports.initialize = function () {
    return new Promise(function (resolve, reject) {
        let db = mongoose.createConnection("connectionString");

        db.on('error', (err)=>{
            reject(err); // reject the promise with the provided error
        });
        db.once('open', ()=>{
           User = db.model("users", userSchema);
           resolve();
        });
    });
};
