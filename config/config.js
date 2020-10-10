module.exports = {
  development: {
    username: "root",
    password: "pureheart4life",
    database: "eim_module",
    host: process.env.DB_HOST,
    dialect: "mysql",
  },
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_TEST_NAME,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    operatorsAliases: false,
  },
  production: {
    use_env_variable: "DATABASE_URL",
  },
};
