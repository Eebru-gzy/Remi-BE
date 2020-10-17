const { Router } = require("express");
const multer = require("multer");
const {
  addEmployee,
  employeeResetPass,
  personal,
  physical,
  nextOfKin,
  payroll,
  document,
  employeeProfile,
} = require("../../controller/employee");

const {
  protect,
  companyAuthorize,
  employeeAuthorize,
} = require("../../middleware/auth");

const router = Router();

const upload = multer({ dest: "uploads/" });

router.post("/add_employee", protect, companyAuthorize, addEmployee);
router.patch(
  "/employee/reset_password",
  protect,
  employeeAuthorize,
  employeeResetPass
);
router.patch("/employee/update/personal", protect, employeeAuthorize, personal);
router.patch("/employee/update/physical", protect, employeeAuthorize, physical);
router.patch("/employee/update/nok", protect, employeeAuthorize, nextOfKin);
router.patch("/employee/update/payroll", protect, employeeAuthorize, payroll);
router.patch(
  "/employee/update/document",
  upload.array("docs", 4),
  protect,
  employeeAuthorize,
  document
);
router.get("/employee", protect, employeeAuthorize, employeeProfile);

module.exports = router;
