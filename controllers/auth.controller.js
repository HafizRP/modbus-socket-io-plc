const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const { user } = require("../models");

exports.Register = (req, res) => {
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
  })
    .then((user) => {
      if (req.body.roles) {
        Role.findAll({
          where: {
            name: {
              [Op.or]: req.body.roles,
            },
          },
        })
          .then((roles) => {
            user
              .setRoles(roles)
              .then(() => {
                res
                  .status(200)
                  .send({ message: "User registered Successfully" });
              })
              .catch((err) => {});
          })
          .catch((err) => {});
      } else {
        user
          .setRoles([1])
          .then(() => {
            res.status(200).send({ message: "User registered succesfully" });
          })
          .catch((err) => {});
      }
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.Login = (req, res) => {
  User.findOne({
    where: {
      username: req.body.username,
    },
  })
    .then((username) => {
      if (!username) {
        return res.status(400).send({ message: "User not found" });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        username.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password",
        });
      }

      var token = jwt.sign({ id: username.id }, config.secret, {
        expiresIn: 86400,
      });

      var authorities = [];
      username.getRoles().then((roles) => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push("ROLE_" + roles[i].name.toUpperCase());
        }
        res.status(200).send({
          id: username.id,
          username: username.username,
          email: username.email,
          roles: authorities,
          accessToken: token,
        });
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};
