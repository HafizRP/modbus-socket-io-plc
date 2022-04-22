const db = require("../models");
const User = db.user;
const roles = db.ROLES;

exports.allData = (req, res) => {
  User.findAll()
    .then((result) => {
      res.status(200).send({ message: "All Users", data: result });
    })
    .catch((err) => {});
};
