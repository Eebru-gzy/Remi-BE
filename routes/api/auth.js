const { Router } = require("express");
const {
  companyRegister,
  employeeRegister,
  userLogin,
  employeeResetPass,
} = require("../../controller/auth");

const {
  protect,
  companyAuthorize,
  employeeAuthorize,
} = require("../../middleware/auth");

const router = Router();

router.post("/company/signup", companyRegister);
router.post("/employee/signup", employeeRegister);
router.post("/login", userLogin);
router.patch('/employee/reset_password', protect, employeeResetPass)




router.get("/company/profile", protect, companyAuthorize, (req, res) => {
  res.send("company profile");
});

router.get("/employee/profile", protect, employeeAuthorize, (req, res) => {
  res.send("employee profile");
});

module.exports = router;
