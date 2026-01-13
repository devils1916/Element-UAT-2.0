// const { element } = require('../config/db');
// const { QueryTypes } = require('sequelize');

// const executeQuery = async (query) => {
//     try {
//         return await element.query(query, {
//             type: QueryTypes.SELECT
//         });
//     } catch (error) {
//         console.error('Database Query Error:', error.message);
//         throw new Error('Database operation failed');
//     }
// };

// module.exports = { executeQuery };

const { element } = require('../config/db');
const { QueryTypes } = require('sequelize');

const executeQuery = async (query, replacements = {}) => {
  try {
    return await element.query(query, {
      replacements, // <-- now it's always defined
      type: QueryTypes.SELECT
    });
  } catch (error) {
    console.error('Database Query Error:', {
      message: error.message,
      sql: query,
      replacements,
      original: error
    });
    throw error; // throw the original error so you can see Sequelize details
  
}
};

module.exports = { executeQuery };
