require("dotenv").config();
module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false,
  },
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_TEST_NAME,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    operatorsAliases: false,
  },
  // production: {
  //   username: process.env.PROD_DB_USER,
  //   password: process.env.PROD_DB_PASS,
  //   database: process.env.PROD_DB_NAME,
  //   host: process.env.PROD_DB_HOST,
  //   dialect: "mysql",
  // },
  production: {
    use_env_variable: "CLEARDB_DATABASE_URL",
  },
};
