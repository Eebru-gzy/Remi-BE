const { Router } = require("express");
const {
  companyRegister,
  employeeRegister,
  companyLogin,
} = require("../../controller/auth");

const router = Router();

router.post("/company/signup", companyRegister);
router.post("/employee/signup", employeeRegister);
router.post("/company/login", companyLogin);

module.exports = router;
