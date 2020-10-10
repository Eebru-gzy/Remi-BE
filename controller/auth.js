const { Company } = require("../models");

// @desc    Register a company
// @route   POST /api/auth/company/signup
// @access  Public
exports.companyRegister = async (req, res, next) => {
  try {
    // const testCo = await Company.create({
    //   name: "Stutern Inc",
    //   email: "stutern@test.com",
    //   password: "1234567",
    // });

    const company = await Company.findByPk(2);
    const isMatch = await Company.matchPassword("1234567", company.password);
    const token = await Company.getSignedJwtToken(company.id);

    return res.status(201).json({
      password_match: isMatch,
      token,
      data: company,
    });
  } catch (error) {
    console.log("error:", error);
  }
};

// @desc    Register an Employee
// @route   POST /api/auth/employee/signup
// @access  Public
exports.employeeRegister = async (req, res, next) => {
  res.send("Register an Employee");
};

// @desc    Login a company
// @route   POST /api/auth/company/login
// @access  Public
exports.companyLogin = async (req, res, next) => {
  res.send("Login a company");
};
