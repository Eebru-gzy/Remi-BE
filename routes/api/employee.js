const { Router } = require("express");
const {
  addEmployee,
  employeeResetPass,
  updateProfile,
} = require("../../controller/employee");

const {
  protect,
  companyAuthorize,
  employeeAuthorize,
} = require("../../middleware/auth");

const router = Router();

router.post("/add_employee", protect, companyAuthorize, addEmployee);
router.patch(
  "/employee/reset_password",
  protect,
  employeeAuthorize,
  employeeResetPass
);
router.patch("/employee/update", protect, employeeAuthorize, updateProfile);

module.exports = router;
