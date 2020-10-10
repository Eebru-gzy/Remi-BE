const jwt = require("jsonwebtoken");
const Company = require("../models/index");

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
    req.user = await Company.findByPk(decoded);

    next();
  } catch (err) {
    return res.status(401).json({
      error: "Not authorized to access this resource",
    });
  }
};
