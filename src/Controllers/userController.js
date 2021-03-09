const { pool } = require("../../config/key");
const crypto = require("crypto");

const userDAO = require("../DAO/userDAO");
const validator = require("validator");
const emailRegex = require("email-regex");

//회원가입 로직 userEmail, userName, userPhone, userPassword
exports.register = async (req, res) => {
  const { userEmail, userName, userPhone, userPassword } = req.body;

  //정규식
  const phoneRegExp = /^01([0|1|6|7|8|9]?)-?([0-9]{3,4})-?([0-9]{4})$/;
  //1. 유효성 검사
  if (!userEmail) {
    return res.json({
      message: "이메일을 입력하세요",
      code: 301,
      isSuccess: false,
    });
  }
  if (!validator.isEmail(userEmail)) {
    return res.json({
      message: "이메일을 올바르게 입력하세요",
      code: 302,
      isSuccess: false,
    });
  }
  if (!userName) {
    return res.json({
      message: "이름을 정확히 입력하세요",
      code: 303,
      isSuccess: false,
    });
  }
  if (!userPhone) {
    return res.json({
      message: "휴대폰 번호를 올바르게 입력해주세요.",
      code: 304,
      isSuccess: false,
    });
  }
  if (!phoneRegExp.test(userPhone)) {
    return res.json({
      message: "휴대폰 번호를 올바르게 입력해주세요.",
      code: 305,
      isSuccess: false,
    });
  }
  if (!userPassword) {
    return res.json({
      message: "비밀번호는 6~15자 이내로 입력하셔야 합니다.",
      code: 306,
      isSuccess: false,
    });
  }
  if (userPassword.length < 6 || userPassword.length > 15) {
    return res.json({
      message: "비밀번호는 6~15자 이내로 입력하셔야 합니다.",
      code: 307,
      isSuccess: false,
    });
  }

  //2. 중복 확인
  try {
    try {
      const emailData = await userDAO.emailCheckUser(userEmail);

      //email 중복 체크
      //phone 중복 체크
      if (emailData.length > 0) {
        console.log(emailData);
        return res.json({
          message:
            "이미 가입된 이메일 주소입니다. 다른 이메일을 입력하여 주세요.",
          code: 308,
          isSuccess: false,
        });
      }

      const phoneData = await userDAO.phoneCheckUser(userPhone);

      if (phoneData.length > 0) {
        return res.json({
          message: `${phoneData[0].userEmail}로 가입된 휴대폰번호입니다.`,
          code: 309,
          isSuccess: false,
        });
      }

      /////////////////////////////////////////////////////////////
      const hash = await crypto
        .createHash("sha512")
        .update(userPassword)
        .digest("hex");

      const registerUserParams = [userEmail, userName, userPhone, hash];

      const registerUserData = await userDAO.registerUser(registerUserParams);

      return res.json({
        isSuccess: true,
        code: 200,
        message: "성공",
      });
    } catch (err) {
      console.log(err);
      return res.json({
        isSuccess: false,
        code: 500,
        message: "내부 오류",
      });
    }
  } catch (err) {
    console.log(err);
    return res.json({
      isSuccess: false,
      code: 500,
      message: "내부 오류",
    });
  }
};
