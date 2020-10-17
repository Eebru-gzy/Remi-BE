const bcrypt = require("bcryptjs");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;
const { Company, Employee, EmployeeDocument } = require("../models");
const errorResponse = require("../utils/errorResponse");
const successResponse = require("../utils/successResponse");
const sendMail = require("../utils/mailer");

// cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// @desc    Company add Employee
// @route   POST /api/add_employee
// @access  Private
exports.addEmployee = async (req, res) => {
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

// @desc    Employee Update Personal Profile
// @route   PATCH /api/employee/personal/update
// @access  Private
exports.personal = async (req, res) => {
  const employee = req.user;
  const {
    phone_number,
    street_address,
    city,
    state,
    date_of_birth,
    nationality,
  } = req.body;

  try {
    const updated = await Employee.update(
      {
        phone_number,
        street_address,
        city,
        state,
        date_of_birth,
        nationality,
      },
      {
        where: {
          id: employee.id,
        },
      }
    );
    if (updated) {
      return successResponse(200, "SUCCESS!", res);
    }
  } catch (error) {
    return errorResponse(500, "Internal Server Error", res);
  }
};

// @desc    Employee Update Physical Profile
// @route   PATCH /api/employee/physical/update
// @access  Private
exports.physical = async (req, res) => {
  const employee = req.user;
  const { gender, weight, height, genotype, blood_group } = req.body;

  try {
    const updated = await Employee.update(
      {
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
      return successResponse(200, "SUCCESS!", res);
    }
  } catch (error) {
    return errorResponse(500, "Internal Server Error", res);
  }
};

// @desc    Employee Complete Profile
// @route   PATCH /api/employee/update/nok
// @access  Private
exports.nextOfKin = async (req, res) => {
  const user = req.user;
  const { nok_name, nok_email, nok_phone, nok_street, nok_address } = req.body;

  try {
    const updated = await Employee.update(
      {
        nok_name,
        nok_email,
        nok_phone,
        nok_street,
        nok_address,
      },
      {
        where: {
          id: user.id,
        },
      }
    );
    if (updated) {
      return successResponse(200, "SUCCESS!", res);
    }
  } catch (error) {
    return errorResponse(500, "Internal Server Error", res);
  }
};

// @desc    Employee Complete Profile
// @route   PATCH /api/employee/update/payroll
// @access  Private
exports.payroll = async (req, res) => {
  const user = req.user;
  const {
    insurance_number,
    pension_id,
    tax_id,
    account_number,
    bank_name,
  } = req.body;

  try {
    const updated = await Employee.update(
      {
        insurance_number,
        pension_id,
        tax_id,
        account_number,
        bank_name,
      },
      {
        where: {
          id: user.id,
        },
      }
    );
    if (updated) {
      return successResponse(200, "SUCCESS!", res);
    }
  } catch (error) {
    return errorResponse(500, "Internal Server Error", res);
  }
};

// @desc    Employee Upload Document
// @route   PATCH /api/employee/update/document
// @access  Private
exports.document = async (req, res) => {
  const employee = req.user;
  const docs = req.files;
  const uploaded_files = [];
  try {
    for (let i = 0; i < docs.length; i++) {
      const filePath = docs[i].path;
      const result = await cloudinary.uploader.upload(filePath);
      if (result) {
        uploaded_files.push(result["url"]);
      }
    }
    for (let i = 0; i < docs.length; i++) {
      const fileName = docs[i].originalname;
      const fileUrl = uploaded_files[i];
      var uploadedDocs = await EmployeeDocument.create({
        name: fileName,
        url: fileUrl,
        employeeId: employee.id,
      });
    }
    if (uploadedDocs) {
      fs.rmdir("uploads", { recursive: true });
      return successResponse(201, "Documents uploaded!", res);
    }
  } catch (error) {
    console.log(error);
  }
};

// @desc    Get employee profile
// @route   GET /api/employee
// @access  Private
exports.employeeProfile = async (req, res) => {
  const employeeId = req.user.id;
  const employee = await Employee.findOne({
    include: [
      { model: Company, attributes: ["name", "logo"] },
      { model: EmployeeDocument, attributes: ["id", "name", "url"] },
    ],
    where: {
      id: employeeId,
    },
    attributes: {
      exclude: ["password"],
    },
  });

  return res.status(200).json({
    success: true,
    user: employee,
  });
};
