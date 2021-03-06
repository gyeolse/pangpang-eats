module.exports = function (app) {
  const board = require("../controllers/boardController");
  app.get("/app/board", board.getBoard);
};
