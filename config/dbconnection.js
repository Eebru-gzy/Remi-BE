const { Sequelize } = require("sequelize");

let db_name =
  process.env.NODE_ENV === "production"
    ? process.env.PROD_DB_NAME
    : process.env.DB_NAME;
let db_user =
  process.env.NODE_ENV === "production"
    ? process.env.PROD_DB_USER
    : process.env.DB_USER;
let db_pass =
  process.env.NODE_ENV === "production"
    ? process.env.PROD_DB_PASS
    : process.env.DB_PASS;
let db_Host =
  process.env.NODE_ENV === "production"
    ? process.env.PROD_DB_HOST
    : process.env.DB_HOST;

const sequelize = new Sequelize(db_name, db_user, db_pass, {
  host: db_Host,
  dialect: process.env.DB_DIALECT,
  logging: false,
});

async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log("Database Connected!");
  } catch (error) {
    console.error("Unable to connect to the database:", error.stack);
  }
}

module.exports = connectDB;
