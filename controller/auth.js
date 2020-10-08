// @desc    Register a company
// @route   POST /api/auth/company/signup
// @access  Public
exports.companyRegister = async (req, res, next) => {
  res.send("Register a company");
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
