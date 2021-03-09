module.exports = function (app) {
  const user = require("../Controllers/userController");

  app.route("/v1/register").post(user.register);
};
