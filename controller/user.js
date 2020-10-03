"use strict";
const Auth = require("../utils/auths");
const auth = new Auth();
const database = require("../db/index");
const status = require("../utils/statuses");
const nodeMailer = require("../utils/nodemailer");

class User {
  async signup(req, res) {
    const db = await database.connection();
    const { company_name, company_email, password, urlForMail } = req.body;

    
    try {
      await db.query("START TRANSACTION");
      const emailCheck = await db.query(
        `SELECT * FROM company WHERE email = ?`,
        [company_email]
      );
      if (emailCheck.length !== 0) {
        return res
          .status(401)
          .json(
            status.unauthorizedResponse(
              `User with email ${company_email} already exist`
            )
          );
      }
      const hashPassword = await auth.bcryptHahser(password);

      // TODO add json schema validate

      const postToDb = await db.query(
        "INSERT INTO `company` (name, email, password) VALUES (?,?,?)",
        [company_name, company_email, hashPassword]
      );
      const postToGlobalEmail = await db.query(
        "INSERT INTO `global_email` (email, its_table) VALUES (?,?)",
        [company_email, "company"]
      );
      await db.query("COMMIT");

      nodeMailer(company_email, urlForMail);

      if (postToDb.affectedRows === 1 && postToGlobalEmail.affectedRows === 1) {
        return res.status(200).json({ status: 200, message: "User created Successfully" });
      }
    } catch (error) {
      await db.query("ROLLBACK");
      console.log("ROLLBACK at catch block =>", error);
    } finally {
      await db.release();
    }
  }
}

module.exports = User;
