const dotenv = require('dotenv')
const { join } = require('path')
const fs = require('fs')
dotenv.config()

module.exports = {
  "development": {
    "username": process.env.DB_USER,
    "password": process.env.DB_PASS,
    "database": process.env.DB_NAME,
    "host": process.env.DB_HOST,
    "port": process.env.DB_PORT,
    "dialect": "mysql",
    "dialectModule": require('mysql2'),
    "dialectOptions": {
      "ssl": {
        "ca": fs.readFileSync(join(__dirname, '../cert/ca.pem')),
        "require": true
      },
      "timezone": "local"
    },
    "timezone": "America/Sao_Paulo",
    "logging": false
  },
  "homolog": {
    "username": process.env.DB_USER,
    "password": process.env.DB_PASS,
    "database": process.env.DB_NAME,
    "host": process.env.DB_HOST,
    "port": process.env.DB_PORT,
    "dialect": "mysql",
    "dialectModule": require('mysql2'),
    "dialectOptions": {
      "ssl": {
        "ca": fs.readFileSync(join(__dirname, '../cert/ca.pem')),
        "require": true
      },
      "timezone": "local"
    },
    "timezone": "America/Sao_Paulo",
    "logging": false
  },
  "production": {
    "username": "",
    "password": "",
    "database": "",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "dialectOptions": {
      "timezone": "local"
    },
    "timezone": "America/Sao_Paulo",
    "logging": false
  }
}
