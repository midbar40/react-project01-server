"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize = new sequelize_1.Sequelize(process.env.POSTGRE_DB_DATABASE, process.env.POSTGRE_DB_USER, process.env.POSTGRE_DB_PASSWORD, {
    host: process.env.POSTGRE_DB_HOST,
    dialect: 'postgres',
    port: process.env.POSTGRE_DB_PORT,
    logging: false
});
exports.default = sequelize;
