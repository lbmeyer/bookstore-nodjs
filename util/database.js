const Sequelize = require('sequelize');

const sequelize = new Sequelize(
  'node_complete',
  'root',
  `${process.env.MYSQL_PASSWORD}`,
  { dialect: 'mysql', host: 'localhost', operatorsAliases: false }
);

module.exports = sequelize;