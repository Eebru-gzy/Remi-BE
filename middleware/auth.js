const jwt = require("jsonwebtoken");
const { Company } = require("../models");
const { Employee } = require("../models");

exports.protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(" ")[1];
    // Set token from cookie
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }
  // Make sure token exists
  if (!token) {
    return res.status(401).json({
      error: "Not authorized to access this resource",
    });
  }
  try {
    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role === "company") {
      req.user = await Company.findByPk(decoded.id);
      req.user.role = "company";
    } else {
      req.user = await Employee.findByPk(decoded.id);
      req.user.role = "employee";
    }

    next();
  } catch (err) {
    console.log(err);
    return res.status(401).json({
      error: "Not authorized to access this resource",
    });
  }
};

// Grant access to specific roles
exports.companyAuthorize = (req, res, next) => {
  if (req.user.role === "employee") {
    return res.status(401).json({
      error: "Employees are not authorized to access this route",
    });
  }
  next();
};

// Grant access to specific roles
exports.employeeAuthorize = (req, res, next) => {
  if (req.user.role === "company") {
    return res.status(401).json({
      error: "Companies are not authorized to access this route",
    });
  }
  next();
};
