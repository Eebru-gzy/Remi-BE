const { Router } = require("express");
const {
  addEmployee,
  employeeResetPass,
  updateProfile,
  nextOfKin,
  payroll
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
router.patch("/employee/update/nok", protect, employeeAuthorize, nextOfKin);
router.patch("/employee/update/payroll", protect, employeeAuthorize, payroll);

module.exports = router;
