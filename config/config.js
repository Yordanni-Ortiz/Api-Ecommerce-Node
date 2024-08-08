require('dotenv').config();

module.exports = {
  development: {
    username: process.env.USER_NAME_DB,
    password: process.env.PASSWORD_DB,
    database: process.env.DB_DEVELOPMENT,
    host: process.env.HOST_DB,
    dialect: process.env.DIALECT_DB
  },
  test: {
    username: process.env.USER_NAME_DB,
    password: process.env.PASSWROD_DB,
    database: process.env.DB_TEST,
    host: process.env.HOST_DB,
    dialect: process.env.DIALECT_DB
  },
  production: {
    username: process.env.USER_NAME_DB,
    password: process.env.PASSWROD_DB,
    database: process.env.DB_PRODUCTION,
    host: process.env.HOST_DB,
    dialect: process.env.DIALECT_DB
  }
}
