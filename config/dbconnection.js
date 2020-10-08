const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    logging: false,
  }
);

async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log("Database Connected!");
  } catch (error) {
    console.error("Unable to connect to the database:", error.stack);
  }
}

module.exports = connectDB;
