import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const sequelize = new Sequelize(process.env.POSTGRE_DB_DATABASE!, process.env.POSTGRE_DB_USER!, process.env.POSTGRE_DB_PASSWORD, {
    host: process.env.POSTGRE_DB_HOST,
    dialect: 'postgres',
    port: parseInt(process.env.POSTGRE_DB_PORT!),
    logging: false
});

export default sequelize;