const { Router } = require("express");
const {
  companyRegister,
  employeeRegister,
  companyLogin,
} = require("../../controller/auth");

const { protect } = require("../../middleware/auth");

const router = Router();

router.post("/company/signup", companyRegister);
router.post("/employee/signup", employeeRegister);
router.post("/company/login", companyLogin);

router.get("/company/profile", protect, (req, res) => {
  return res.send("company profile");
});

module.exports = router;
