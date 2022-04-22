const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;

checkDuplicateUsernameOrEmail = (req, res, next) => {
  User.findOne({
    where: {
      username: req.body.username,
    },
  })
    .then((user) => {
      if (user) {
        res.status(400).send({
          message: "Username already used!",
        });
        return;
      }

      User.findOne({
        where: {
          email: req.body.email,
        },
      })
        .then((email) => {
          if (email) {
            res.status(400).send({ message: "E-Mail already used!" });
            return;
          }

          next();
        })
        .catch((err) => {});
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};

checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        res.status(400).send({
          message: "Role does not existed!",
        });
        return;
      }
    }
  }
  next();
};

const verifyLogin = {
  checkDuplicateUsernameOrEmail,
  checkRolesExisted,
};

module.exports = verifyLogin;
