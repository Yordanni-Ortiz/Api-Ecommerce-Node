const { DataTypes } = require('sequelize');
const sequelize = require('../utils/connection');

const CloudinaryImg = sequelize.define('image', {
    url: {
        type: DataTypes.STRING,
        allowNull: false
    },
    publicId: {
        type: DataTypes.STRING,
        allowNull: false
    }
},{
    timestamps: false
});

module.exports = CloudinaryImg;