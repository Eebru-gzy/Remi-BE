const database = require("./index");
const express = require("express");
const router = express.Router();
const logger = require('turbo-logger').createStream({});

router.post('/globalemail', async (req, res)=> {
  const db = await database.connection();
  try {
    await db.query("START TRANSACTION");
    const result = await db.query(`CREATE TABLE global_email (
      id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
      email VARCHAR(100) NOT NULL,
      its_table VARCHAR(20) NOT NULL
    )`)
    logger.log('global email table created>>>>', '\n', result)
    res.end();
  } catch (error) {
    await db.query("ROLLBACK");
    logger.error(error)
  } finally {
    await db.release();
  }
})


router.post('/company', async (req, res)=> {
  const db = await database.connection();
  try {
    await db.query("START TRANSACTION");
    const result = await db.query(`CREATE TABLE company (
      id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
      name TINYTEXT NOT NULL,
      email TINYTEXT NOT NULL,
      password TINYTEXT NOT NULL,
      staff_id INT
    )`)
    logger.log('company table  created>>>>', '\n', result)
    res.end();
  } catch (error) {
    await db.query("ROLLBACK");
    logger.error(error)
  } finally {
    await db.release();
  }
})


router.post('/staff', async (req, res)=> {
  const db = await database.connection();
  try {
    await db.query("START TRANSACTION");
    const result = await db.query(`CREATE TABLE staff (
      id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
      name TINYTEXT,
      email TINYTEXT NOT NULL,
      address TINYTEXT,
      DOB DATE,
      next_of_kin TINYTEXT,
      password TINYTEXT DEFAULT ('000000')
    )`)
    logger.log('staff table created>>>>', '\n', result)
    res.end();
  } catch (error) {
    await db.query("ROLLBACK");
    logger.error(error)
  } finally {
    await db.release();
  }
})
module.exports = router;