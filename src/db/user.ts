const { DataTypes } = require("sequelize")
const path = require("path")
const sequelize = require(path.join(__dirname, "/client"))

const User = sequelize.define(
  process.env.NAME_TABLE_USER_DB,
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    permission: {
      type: DataTypes.TINYINT,
      allowNull: false,
    },
    last_connection: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
)

module.exports = User