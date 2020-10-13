"use strict";
const { Model } = require("sequelize");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

module.exports = (sequelize, DataTypes) => {
  class Company extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Company.hasMany(models.Employee);
    }
  }
  Company.init(
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      logo: DataTypes.STRING,
      confirm_token: DataTypes.STRING,
      email_verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "Company",
    }
  );
  Company.beforeCreate(async (company, options) => {
    const salt = await bcrypt.genSalt(10);
    company.password = await bcrypt.hash(company.password, salt);
  });

  // Match user entered password to hashed password in database
  Company.matchPassword = async (enteredPassword, password) => {
    return await bcrypt.compare(enteredPassword, password);
  };

  // Sign JWT and return
  Company.getSignedJwtToken = (id) => {
    return jwt.sign({ id, role: "company" }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });
  };

  return Company;
};
