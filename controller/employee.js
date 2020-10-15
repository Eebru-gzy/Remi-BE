const bcrypt = require("bcryptjs");
const { Employee } = require("../models");
const errorResponse = require("../utils/errorResponse");
const successResponse = require("../utils/successResponse");
const sendMail = require("../utils/mailer");
const e = require("express");

// @desc    Company add Employee
// @route   POST /api/add_employee
// @access  Private
exports.addEmployee = async (req, res, next) => {
  const companyId = req.user.id;
  const companyName = req.user.name;
  const {
    name,
    email,
    job_title,
    department,
    branch,
    line_manager_name,
    line_manager_position,
    line_manager_phone,
  } = req.body;
  try {
    if (!name || !email) {
      return errorResponse(400, "Employee name and email are required", res);
    }
    // check if employee has already been added
    const employee = await Employee.findOne({
      where: {
        email,
      },
    });

    if (employee) {
      return errorResponse(400, "Employee already added!", res);
    }
    // create employee record and send mail
    const subject = `${companyName} New Employee Account.`;
    const message = `Hello ${name},<br><br>An employee account has been created for you at (www.remi.com). <br/> Please
        <a href="http://127.0.0.1:5500/login.html"> Click here</a> to login with default password <b>"000000"</b>
        <br><br>Thank you, <br>${companyName}`;

    const newEmployee = await Employee.create({
      name,
      email,
      job_title,
      department,
      branch,
      line_manager_name,
      line_manager_position,
      line_manager_phone,
      CompanyId: companyId,
    });

    if (newEmployee) {
      //send mail
      await sendMail(message, subject, email);
      return successResponse(
        201,
        "Employee account created! Employee will receive an email link to login and change password.",
        res
      );
    }
    return errorResponse(500, "Internal server error", res);
  } catch (error) {
    console.log(error);
  }
};

// @desc    Employee Reset Password
// @route   POST /api/employee/reset_password
// @access  Private
exports.employeeResetPass = async (req, res) => {
  const { newPass } = req.body;
  const userId = req.user.id;
  const salt = await bcrypt.genSalt(10);

  if (newPass.length < 8) {
    return errorResponse(400, "Password must be at least 8 characters", res);
  }
  if (newPass.search(/\d/) == -1) {
    return errorResponse(400, "Password must contain at least one number", res);
  }
  if (newPass.search(/[a-zA-Z]/) == -1) {
    return errorResponse(400, "Password must contain at least one letter", res);
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
    const reset = await Employee.update(
      { password: hashPass },
      {
        where: {
          id: userId,
        },
      }
    );
    if (!reset) {
      return errorResponse(400, "Unable to reset password.", res);
    }
    return successResponse(201, "Password reset successfully.", res);
  } catch (error) {
    return errorResponse(400, "Unable to reset password.", res);
  }
};

// @desc    Employee Complete Profile
// @route   PATCH /api/employee/update
// @access  Private
exports.updateProfile = async (req, res) => {
  const employee = req.user;
  const { personal, physical } = req.body;

  const { phone, street, city, state, date_of_birth, nationality } = personal;
  const { gender, weight, height, genotype, blood_group } = physical;
  try {
    const updated = await Employee.update(
      {
        phone_number: phone,
        street_address: street,
        city,
        state,
        date_of_birth,
        nationality,
        gender,
        weight,
        height,
        genotype,
        blood_group,
      },
      {
        where: {
          id: employee.id,
        },
      }
    );

    if (updated) {
      return res.json({
        message: "Updated!",
        updated,
      });
    }
  } catch (error) {
    console.log(error);
  }
};
