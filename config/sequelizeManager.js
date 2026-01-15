const { Sequelize, DataTypes } = require('sequelize');
const loadModels = require("../models");
require('dotenv').config();

const connections = {};

async function getSequelize(dbName) {
    if (connections[dbName]) {
        return connections[dbName];
    }

    const sequelize = new Sequelize(dbName, process.env.DB_USER, process.env.DB_PASSWORD, {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 1433,
        dialect: process.env.DB_DIALECT || 'mssql',
        dialectOptions: { options: { encrypt: false } },
        logging: false
    });

    loadModels(sequelize, DataTypes);

    await sequelize.authenticate()
        .then(() => console.log(`Connected to COMPANY DB (${dbName}) successfully`))
        .catch(err => console.error(`Error connecting COMPANY DB (${dbName}):`, err));

    connections[dbName] = sequelize;
    return sequelize;
}

module.exports = { getSequelize };


