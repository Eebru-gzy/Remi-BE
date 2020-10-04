"use strict";
const Auth = require("../utils/auths");
const auth = new Auth();
const database = require("../db/index");
const status = require("../utils/statuses");
const nodeMailer = require("../utils/nodemailer");
const utils = require("../utils/utils");

class User {
  async signup(req, res) {
    const db = await database.connection();
    const { company_name, company_email, password, urlForMail } = req.body;

    try {
      await db.query("START TRANSACTION");
      const emailCheck = await db.query(
        `SELECT * FROM companies WHERE email = ?`,
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
      console.log(hashPassword);

      // TODO add json schema validate

      const postToDb = await db.query(
        "INSERT INTO companies (name, email, password) VALUES (?,?,?)",
        [company_name, company_email, hashPassword]
      );
      const postToGlobalEmail = await db.query(
        "INSERT INTO global_email (email, its_table) VALUES (?,?)",
        [company_email, "companies"]
      );
      await db.query("COMMIT");
      //send mail
      // nodeMailer(company_email, urlForMail);

      if (postToDb.affectedRows === 1 && postToGlobalEmail.affectedRows === 1) {
        return res
          .status(200)
          .json({ status: 200, message: "User created Successfully" });
      }
    } catch (error) {
      await db.query("ROLLBACK");
      console.log("ROLLBACK at catch block =>", error);
    } finally {
      await db.release();
    }
  }

  async login(req, res) {
    const db = await database.connection();
    const { password, email } = req.body;

    try {
      await db.query("START TRANSACTION");
      const globalEmailCheck = await db.query(
        `SELECT * FROM global_email WHERE email = ?`,
        [email]
      );
      if (globalEmailCheck.length === 1) {
        const belongsTo = globalEmailCheck[0].its_table;
        const checkUser = await db.query("SELECT * FROM ?? WHERE email = ?", [
          belongsTo,
          email,
        ]);
        if (checkUser.length === 0) {
          return res
            .status(404)
            .json({ status: 404, message: "Invalid Credential(s)" });
        }
        const parsedUser = await utils.parseJSON(checkUser[0]);

        const validatePassword = await auth.bcryptCompare(
          password,
          parsedUser.password
        );
        if (!validatePassword) {
          return res.status(401).json({ message: "Incorrect Password" });
        }

        const token = await auth.jwtCreate(parsedUser.id);

        res.status(200).json({ status: 200, token });
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
