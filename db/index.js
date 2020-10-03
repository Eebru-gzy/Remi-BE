const mysql = require('mysql2');

const pool = mysql.createPool({
  connectionLimit: 100,
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "remi"
});

const connection = () => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        if (err.code === "ER_ACCESS_DENIED_ERROR") {
          console.error("Database error from connection.");
        } else if (err.code === "PROTOCOL_CONNECTION_LOST") {
          console.error("Database connection was closed.");
        } else if (err.code === "ER_CON_COUNT_ERROR") {
          console.error("Database has too many connections.");
        } else if (err.code === "ECONNREFUSED") {
          console.error("Database connection was refused.");
        } else {
          throw err.code;
        }
        reject(err);
      }
      console.log("Pool connected ==> threadId: " + connection.threadId);
      const query = (sql, binding) => {
        return new Promise((resolve, reject) => {
          connection.query(sql, binding, (err, result) => {
            if (err) reject(err);
            resolve(result);
          });
        });
      };
      const release = () => {
        return new Promise((resolve, reject) => {
          if (err) reject(err);
          console.log("Pool released ==> threadId: " + connection.threadId);
          resolve(connection.release());
        });
      };
      resolve({ query, release });
    });
  });
};
const query = (sql, binding) => {
  return new Promise((resolve, reject) => {
    pool.query(sql, binding, (err, result, fields) => {
      if (err) reject(err);
      resolve(result);
    });
  });
};

module.exports = { pool, connection, query };