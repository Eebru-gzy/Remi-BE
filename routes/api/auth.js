const { Router } = require("express");
const {
  companyRegister,
  userLogin,
  confirmEmail,
} = require("../../controller/auth");

const router = Router();

router.post("/company/signup", companyRegister);
router.post("/login", userLogin);
router.get("/confirm_signup/:confirmToken", confirmEmail);

module.exports = router;
