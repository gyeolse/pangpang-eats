const { pool } = require("../../config/key");
const BoardQuery = require("../Queries/boardQuery");

// selectBoard
exports.selectBoard = async (email) => {
  const connection = await pool.getConnection(async (conn) => conn);
  const [data] = await connection.query(BoardQuery.getBoardQuery);
  connection.release();

  return data;
};
