const database = require("./index");
const express = require("express");
const router = express.Router();
const logger = require('turbo-logger').createStream({});

router.post('/globalemailtable', async (req, res)=> {
  const db = await database.connection();
  try {
    await db.query("START TRANSACTION");
    const result = await db.query(`CREATE TABLE global_email (
      id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
      email VARCHAR(100) NOT NULL,
      its_table VARCHAR(20) NOT NULL,
      UNIQUE (email)
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


router.post('/companytable', async (req, res)=> {
  const db = await database.connection();
  try {
    await db.query("START TRANSACTION");
    const result = await db.query(`CREATE TABLE companies (
      id INT NOT NULL AUTO_INCREMENT,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) NOT NULL,
      password TEXT NOT NULL,
      staff_id INT,
      UNIQUE (email),
      PRIMARY KEY (id),
      FOREIGN KEY (staff_id) REFERENCES staffs(id)
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


router.post('/stafftable', async (req, res)=> {
  const db = await database.connection();
  try {
    await db.query("START TRANSACTION");
    const result = await db.query(`CREATE TABLE staffs (
      id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) NOT NULL,
      address VARCHAR(255),
      DOB DATE,
      next_of_kin VARCHAR(100),
      password TEXT DEFAULT ('000000'),
      UNIQUE (email)
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