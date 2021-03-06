const { pool } = require("../../config/key");
const boardDAO = require("../DAO/boardDAO");
exports.getBoard = async function (req, res) {
  try {
    const data = await boardDAO.selectBoard();

    if (data) {
      return res.status(200).json({
        message: "게시물 조회 완료",
        data: data,
        isSuccess: true,
      });
    }

    return res.status(300).json({
      isSuccess: false,
      message: "게시물 없음",
    });
  } catch (err) {
    return res.status(500).send(`Error: ${err.message}`);
  }
};
