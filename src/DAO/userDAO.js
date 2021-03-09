const { pool } = require("../../config/key");
const {
  registerUserQuery,
  emailCheckQuery,
  phoneCheckQuery,
} = require("../Queries/userQuery");

//1. 유저 회원가입
exports.registerUser = async (registerUserParams) => {
  const connection = await pool.getConnection(async (conn) => conn);

  //params: userEmail, userName, userPhone, userPassword

  const registerUserData = await connection.query(
    registerUserQuery,
    registerUserParams
  );
  connection.release();
  return registerUserData;
};

//2. 중복 체크
exports.emailCheckUser = async (emailParam) => {
  const connection = await pool.getConnection(async (conn) => conn);

  const [emailUserData] = await connection.query(emailCheckQuery, emailParam);
  connection.release();

  return emailUserData;
};

exports.phoneCheckUser = async (phoneParam) => {
  const connection = await pool.getConnection(async (conn) => conn);

  const [phoneUserData] = await connection.query(phoneCheckQuery, phoneParam);
  connection.release();

  return phoneUserData;
};
