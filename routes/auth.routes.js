const controller = require("../controllers/auth.controller");
const {
  checkDuplicateUsernameOrEmail,
  checkRolesExisted,
} = require("../middlewares/verifyRegister");

module.exports = (app) => {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/auth/register",
    [checkDuplicateUsernameOrEmail, checkRolesExisted],
    controller.Register
  );

  app.post("/api/auth/login", controller.Login);
};
