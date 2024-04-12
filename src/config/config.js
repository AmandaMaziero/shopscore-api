const dotenv = require('dotenv')
dotenv.config()

module.exports = {
  development: {
    "username": "root",
    "password": "",
    "database": "shopscore",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "dialectOptions": {
      "timezone": "local"
    },
    "timezone": "America/Sao_Paulo",
    logging: false
  },
  homolog: {
    "username": "sql5698060",
    "password": "JsbgfI3FKU",
    "database": "sql5698060",
    "host": "sql5.freemysqlhosting.net",
    "dialect": "mysql",
    "dialectOptions": {
      "timezone": "local"
    },
    "timezone": "America/Sao_Paulo",
    logging: false
  },
  production: {
    "username": "",
    "password": "",
    "database": "",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "dialectOptions": {
      "timezone": "local"
    },
    "timezone": "America/Sao_Paulo",
    logging: false
  }
}
