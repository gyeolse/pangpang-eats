//1. 회원가입
exports.registerUserQuery = `INSERT INTO User(userEmail, userName, userPhone, userPassword) VALUES (?,?,?,?);`;

//1-1. 중복 확인
exports.emailCheckQuery = "SELECT userEmail FROM User WHERE userEmail = ?";
exports.phoneCheckQuery = `SELECT userphone, userEmail FROM User WHERE userPhone=?`;
