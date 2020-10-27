const { Router } = require("express");
const {
  companyRegister,
  userLogin,
  confirmEmail,
} = require("../../controller/auth");

const {sendConfirmEmailURL} = require('../../middleware/auth')
const router = Router();

router.post("/company/signup", sendConfirmEmailURL, companyRegister);
router.post("/login", userLogin);
router.get("/confirm_signup/:confirmToken", sendConfirmEmailURL, confirmEmail);

module.exports = router;
