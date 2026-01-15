const Sequelize = require('sequelize');
require('dotenv').config();

function initializeSequelize(dbName, dbLabel) {

    console.log('db name ..', dbName, dbLabel)
    const sequelize = new Sequelize(dbName, process.env.DB_USER, process.env.DB_PASSWORD, {
        host: process.env.DB_HOST,     
        port: parseInt(process.env.DB_PORT) || 1433, 
        dialect: 'mssql',
        dialectOptions: {
            options: {
                encrypt: false,               
                enableArithAbort: true        
            }
        },
        logging: false
    });

    sequelize.authenticate()
        .then(() => console.log(`Connected to DB (${dbLabel}) successfully`))
        .catch(err => console.error(`Error connecting DB (${dbLabel}):`, err));

    return sequelize;
}

const element = initializeSequelize(process.env.DB_ELEMENT, 'ElementParishramMaster');

module.exports = { element };
