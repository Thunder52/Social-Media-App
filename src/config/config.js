  require('dotenv').config();

  module.exports={
  development: {
    username: process.env.USER,
    password: process.env.PASS,
    database: process.env.NAME,
    host: process.env.HOST,
    dialect:'mysql'
  },
  test: {
    username: process.env.USER,
    password: process.env.PASS,
    database: process.env.NAME,
    host: process.env.HOST,
    dialect:'mysql'
  },
  production: {
    username: "root",
    password: null,
    database: "database_production",
    host: "127.0.0.1",
    dialect:'mysql'
  }
  }
