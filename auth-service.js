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
      let newUser = new User(userData);
      newUser
        .save()
        .then(() => {
          resolve();
        })
        .catch((err) => {
          if (err.code === 11000) {
            reject("User Name already taken");
          } else if (err.code !== 11000) {
            reject("There was an error creating the user: " + err);
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
        } else if (user.password !== userData.password) {
          reject("Incorrect Password for user: " + userData.userName);
        } else {
          user.loginHistory.push({
            dateTime: new Date().toString(),
            userAgent: userData.userAgent,
          });

          User.updateOne(
            { userName: user.userName },
            { $set: { loginHistory: user.loginHistory } }
          )
            .exec()
            .then(() => {
              resolve(user);
            })
            .catch((err) => {
              reject("There was an error verifying the user: " + err);
            });
        }
      })
      .catch(() => {
        reject("Unable to find user: " + userData.userName);
      });
  });
};
