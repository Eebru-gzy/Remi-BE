const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { Company } = require("../models");
const { Employee } = require("../models");
const errorResponse = require("../utils/errorResponse");
const successResponse = require("../utils/successResponse");
const sendMail = require("../utils/mailer");

// @desc    Register a company
// @route   POST /api/auth/company/signup
// @access  Public
exports.companyRegister = async (req, res, next) => {
  const { name, email, password } = req.body;
  try {
    if (!name || !email || !password) {
      return errorResponse(400, "Please fill all fields", res);
    }
    const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!emailRegexp.test(email)) {
      return errorResponse(400, "Please enter a valid email", res);
    }
    if (password.length < 8) {
      return errorResponse(400, "Password must be at least 8 characters", res);
    }
    if (password.search(/\d/) == -1) {
      return errorResponse(
        400,
        "Password must contain at least one number",
        res
      );
    }
    if (password.search(/[a-zA-Z]/) == -1) {
      return errorResponse(
        400,
        "Password must contain at least one letter",
        res
      );
    }
    if (password.search(/[^a-zA-Z0-9\@\#\$\&\_\+\.\,\;\:]/) != -1) {
      return errorResponse(
        400,
        "Password may only contain '@', '#', '$', '&', '_', '+' special characters.",
        res
      );
    }
    const companyLogoName = name.split(" ").join("+");
    const logo = `https://ui-avatars.com/api/?name=${companyLogoName}&rounded=true&background=fff&color=4AA934&bold=true`;
    const foundCompany = await Company.findOne({
      where: {
        email,
      },
    });
    if (foundCompany) {
      return errorResponse(
        400,
        "An account with that email already exists. Please login",
        res
      );
    }
    // generate confirm token
    const confirmToken = crypto.randomBytes(10).toString("hex");
    // Create signup confirmation url
    const signupConfirmUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/auth/confirm_signup/${confirmToken}`;
    const message = `Hello ${name},<br><br>To verify your email address (${email}), Please
        <a href="${signupConfirmUrl}"> Click here</a> OR <br><br> Copy and paste the link below in your browser <br>
        <a href="${signupConfirmUrl}">${signupConfirmUrl}</a>
        <br><br>Thank you, <br>REMI EIM`;
    const subject = "Email Confirmation";

    const newCompany = await Company.create({
      name,
      email,
      password,
      logo,
      confirm_token: confirmToken,
      email_verified: false,
    });
    if (newCompany) {
      // send mail and return a response
      await sendMail(message, subject, email);
      return successResponse(
        201,
        "Account created successfully. Please check your email for confirmation link.",
        res
      );
    }
    return errorResponse(500, "An error occured!", res);
  } catch (error) {
    console.log("err", error);
  }
};

// @desc    Register an Employee
// @route   POST /api/auth/employee/signup
// @access  Public
exports.employeeRegister = async (req, res, next) => {
  try {
    const newEmployee = await Employee.create({
      name: "John Simons",
      email: "johnsimons@test.com",
    });
    return res.json(newEmployee);
  } catch (error) {
    console.log(error);
  }
};

// @desc    Login a company/employee
// @route   POST /api/auth/login
// @access  Public
exports.userLogin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return errorResponse(400, "Please fill all fields.", res);
    }
    const company = await Company.findOne({ where: { email } });
    if (company === null) {
      // email does not exist in companies table, check employees table
      const employee = await Employee.findOne({ where: { email } });
      // if no record found, then email does not exist anywhere
      if (employee === null) {
        return errorResponse(400, "Invalid credentials.", res);
      } else {
        // authenticate against employees table
        const isMatch = await Employee.matchPassword(
          password,
          employee.password
        );
        if (isMatch) {
          return sendTokenResponse(200, employee, Employee, res);
        }
        return errorResponse(400, "Invalid credentials.", res);
      }
    } else {
      if (!company.email_verified) {
        return errorResponse(
          400,
          "Please verify your email. Check your email for verification link.",
          res
        );
      }
      // authenticate against companies table
      const isMatch = await Company.matchPassword(password, company.password);
      if (isMatch) {
        return sendTokenResponse(200, company, Company, res);
      }
      return errorResponse(400, "Invalid credentials.", res);
    }
  } catch (error) {
    console.log(error);
  }
};

// @desc    Email confirmation
// @route   GET /api/auth/confirm_signup/:confirmToken
// @access  Public
exports.confirmEmail = async (req, res) => {
  const { confirmToken } = req.params;
  const company = await Company.findOne({
    where: {
      confirm_token: confirmToken,
    },
  });
  if (company === null) {
    return errorResponse(400, "Invalid confirmation token", res);
  }
  if (company.email_verified) {
    res.redirect("http://127.0.0.1:5500/alreadyverified.html");
  }

  company.email_verified = true;
  company.save();

  res.redirect("http://127.0.0.1:5500/verified.html");
};

// Get token from model, create cookie and send response
const sendTokenResponse = (statusCode, user, model, res) => {
  // Create token
  const token = model.getSignedJwtToken(user.id);

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }
  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
    user: user,
  });
};



exports.employeeResetPass = async (req, res) => {
  const {newPass} = req.body;
  const userId = req.user.id;
  const salt = await bcrypt.genSalt(10);

  if (newPass.length < 8) {
    return errorResponse(400, "Password must be at least 8 characters", res);
  }
  if (newPass.search(/\d/) == -1) {
    return errorResponse(
      400,
      "Password must contain at least one number",
      res
    );
  }
  if (newPass.search(/[a-zA-Z]/) == -1) {
    return errorResponse(
      400,
      "Password must contain at least one letter",
      res
    );
  }
  if (newPass.search(/[^a-zA-Z0-9\@\#\$\&\_\+\.\,\;\:]/) != -1) {
    return errorResponse(
      400,
      "Password may only contain '@', '#', '$', '&', '_', '+' special characters.",
      res
    );
  }
  const hashPass = await bcrypt.hash(newPass, salt);
  try {
    const reset = await Employee.update({ password: hashPass }, {
      where: {
        id: userId
      }
    });
    if (!reset) {
      return errorResponse(400, "Unable to reset password.", res);
    }
    return successResponse(201, "Password reset successfully.", res);
  } catch (error) {
    return errorResponse(400, "Unable to reset password.", res)
  }
}