const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Transaction extends Model {}

Transaction.init({
    description: {
        type: DataTypes.STRING,
    },
    value: {
        type: DataTypes.DECIMAL(10,2)
    },
    date: {
        type: DataTypes.DATE
    },
    cleared: {
        type: DataTypes.BOOLEAN
    }
},
{
    sequelize
})

module.exports = Transaction;