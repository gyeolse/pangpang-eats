const { pool, transporter, NODEMAILER_USER } = require("../../config/key");
const crypto = require("crypto");

const userDAO = require("../DAO/userDAO");
const validator = require("validator");

//비밀번호 초기화
exports.findEmail = async (req, res) => {
  //1. 사용자의 이름과 아이디를 request로 받아온다.
  const { email, name } = req.body;

  //2. 사용자의 비밀번호를 임시로 만든 random 문자열로 세팅한다.
  const tempPassword = Math.random().toString(36).slice(2);

  //3. 사용자를 찾는다.
  try {
    const emailData = await userDAO.emailCheckUser(email);

    if (emailData.length == 0) {
      return res.json({
        message: "찾으시는 이메일이 존재하지 않습니다.",
        statusCode: 301,
        isSuccess: false,
      });
    }
    //4. 임시로 만든 비밀번호로 변경시킨다.
    const changeUserPasswordParams = [tempPassword, email];
    await userDAO.chageUserPassword(changeUserPasswordParams);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "DB 오류",
      statusCode: 501,
      isSuccess: false,
    });
  }

  //4. 만든 random 문자열을 그대로 사용자의 이메일로 전송한다.
  try {
    let info = await transporter.sendMail({
      from: `PANGPANG-EATS ${NODEMAILER_USER}`,
      to: email,
      subject: "[팡팡이츠] 임시 비밀번호 안내",
      html: `<b>임시 비밀번호는 ${tempPassword} 입니다.</b>`,
    });
    console.log(tempPassword);

    return res.status(200).json({
      isSuccess: true,
      statusCode: 200,
      message: "등록된 이메일로 새로 발급된 패스워드가 전송되었습니다.",
    });
  } catch (err) {
    return res.status(500).json({
      message: "메일 전송 오류",
      statusCode: 501,
      isSuccess: false,
    });
  }
};

//회원가입 로직 userEmail, userName, userPhone, userPassword
exports.register = async (req, res) => {
  const { userEmail, userName, userPhone, userPassword } = req.body;

  //정규식
  const phoneRegExp = /^01([0|1|6|7|8|9]?)-?([0-9]{3,4})-?([0-9]{4})$/;
  //1. 유효성 검사
  if (!userEmail) {
    return res.json({
      message: "이메일을 입력하세요",
      statusCode: 301,
      isSuccess: false,
    });
  }
  if (!validator.isEmail(userEmail)) {
    return res.json({
      message: "이메일을 올바르게 입력하세요",
      statusCode: 302,
      isSuccess: false,
    });
  }
  if (!userName) {
    return res.json({
      message: "이름을 정확히 입력하세요",
      statusCode: 303,
      isSuccess: false,
    });
  }
  if (!userPhone) {
    return res.json({
      message: "휴대폰 번호를 올바르게 입력해주세요.",
      statusCode: 304,
      isSuccess: false,
    });
  }
  if (!phoneRegExp.test(userPhone)) {
    return res.json({
      message: "휴대폰 번호를 올바르게 입력해주세요.",
      statusCode: 305,
      isSuccess: false,
    });
  }
  if (!userPassword) {
    return res.json({
      message: "비밀번호는 6~15자 이내로 입력하셔야 합니다.",
      statusCode: 306,
      isSuccess: false,
    });
  }
  if (userPassword.length < 6 || userPassword.length > 15) {
    return res.json({
      message: "비밀번호는 6~15자 이내로 입력하셔야 합니다.",
      statusCode: 307,
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
          statusCode: 308,
          isSuccess: false,
        });
      }

      const phoneData = await userDAO.phoneCheckUser(userPhone);

      if (phoneData.length > 0) {
        return res.json({
          message: `${phoneData[0].userEmail}로 가입된 휴대폰번호입니다.`,
          statusCode: 309,
          isSuccess: false,
        });
      }

      const hash = await crypto
        .createHash("sha512")
        .update(userPassword)
        .digest("hex");

      const registerUserParams = [userEmail, userName, userPhone, hash];

      const registerUserData = await userDAO.registerUser(registerUserParams);

      return res.json({
        isSuccess: true,
        statusCode: 200,
        message: "성공",
      });
    } catch (err) {
      return res.json({
        isSuccess: false,
        statusCode: 500,
        message: "내부 오류",
      });
    }
  } catch (err) {
    return res.json({
      isSuccess: false,
      statusCode: 500,
      message: "내부 오류",
    });
  }
};
