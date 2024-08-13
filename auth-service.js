const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
let Schema = mongoose.Schema;

let userSchema = new Schema({
  userName: {
    type: String,
    unique: true,
  },
  password: String,
  email: String,
  loginHistory: [{ dateTime: Date, userAgent: String }],
});

let User;

module.exports.initialize = function () {
  return new Promise(function (resolve, reject) {
    let db = mongoose.createConnection(
      "mongodb+srv://atkhaleeq:FSFSlm9FiawHsKPq@cluster0.ldek0bz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    );

    db.on("error", (err) => {
      reject(err); // reject the promise with the provided error
    });
    db.once("open", () => {
      User = db.model("users", userSchema);
      resolve();
    });
  });
};

module.exports.registerUser = function (userData) {
  return new Promise(function (resolve, reject) {
    if (userData.password !== userData.password2) {
      reject("Password do not match");
    } else {
      bcrypt
        .hash(userData.password, 10)
        .then((hash) => {
          userData.password = hash;

          let newUser = new User(userData);
          return newUser.save();
        })
        .then(() => {
          resolve();
        })
        .catch((err) => {
          if (err.code === 11000) {
            reject("User Name already taken");
          } else if (err.code !== 11000) {
            reject("There was an error encrypting the password" + err);
          }
        });
    }
  });
};

module.exports.checkUser = function (userData) {
  return new Promise(function (resolve, reject) {
    User.findOne({ userName: userData.userName })
      .exec()
      .then((user) => {
        if (!user) {
          reject("Unable to find user: " + userData.userName);
        } else {
          return bcrypt
            .compare(userData.password, user.password)
            .then((result) => {
              if (!result) {
                reject("Incorrect Password for " + userData.userName);
              } else {
                user.loginHistory.push({
                  dateTime: new Date().toString(),
                  userAgent: userData.userAgent,
                });
              }
            });

          return User.updateOne(
            { userName: user.userName },
            { $set: { loginHistory: user.loginHistory } }
          ).catch((err) => {
            reject("There was an error verifying the user: " + err);
          });
        }
      })
      .then((user) => {
        resolve(user);
      })
      .catch(() => {
        reject("Unable to find user: " + userData.userName);
      });
  });
};
