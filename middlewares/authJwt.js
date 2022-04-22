const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({ message: "No Token Provided" });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized!" });
    }
    req.userId = decoded.id;
    next();
  });
};

isAdmin = (req, res, next) => {
  User.findByPk(req.userId)
    .then((user) => {
      user
        .getRoles()
        .then((roles) => {
          for (let i = 0; i < roles.length; i++) {
            if (roles[i].name === "admin") {
              next();
              return;
            }
          }
        })
        .catch((err) => {});
    })
    .catch((err) => {
      res.status(403).send({
        message: "Require Admin role!",
      });
    });
};

isModerator = (req, res, next) => {
  User.findByPk(req.userId)
    .then((roles) => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "moderator") {
          next();
          return;
        }
      }
    })
    .catch((err) => {
      res.status(403).send({ message: "Require Moderator Role" });
    });
};

isModeratorOrAdmin = (req, res, next) => {
  User.findByPk(req.userId).then((user) => {
    user
      .getRoles()
      .then((roles) => {
        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "moderator") {
            next();
            return;
          }

          if (roles[i].name === "admin") {
            next();
            return;
          }
        }
      })
      .catch(() => {
        res.status(403).send({
          message: "Require Moderator or Admin Role!",
        });
      });
  });
};

isSuperAdmin = (req, res, next) => {
  User.findByPk(req.userId)
    .then((roles) => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "super admin") {
          next();
          return;
        }
      }
    })
    .catch((err) => {
      res.status(403).send({ message: "Require Super Admin Role!" });
    });
};

const authJwt = {
  verifyToken,
  isAdmin,
  isModerator,
  isModeratorOrAdmin,
  isSuperAdmin,
};

module.exports = authJwt;
