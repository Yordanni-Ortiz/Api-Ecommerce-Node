require('dotenv').config();

module.exports = {
  development: {
    username: process.env.USER_NAME_DB,
    password: process.env.PASSWORD_DB,
    database: process.env.DB_NAME,
    host: process.env.HOST_DB,
    dialect: process.env.DIALECT_DB
  },
  test: {
    username: process.env.USER_NAME_DB,
    password: process.env.PASSWROD_DB,
    database: process.env.DB_NAME_TEST,
    host: process.env.HOST_DB,
    dialect: DIALECT_DB
  },
  production: {
    username: process.env.USER_NAME_DB,
    password: process.env.PASSWROD_DB,
    database: process.env.DB_NAME_PRODUCTION,
    host: process.env.HOST_DB,
    dialect: DIALECT_DB
  }
}
