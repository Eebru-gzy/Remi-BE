"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class EmployeeDocument extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      EmployeeDocument.belongsTo(models.Employee);
    }
  }
  EmployeeDocument.init(
    {
      employeeId: DataTypes.INTEGER,
      name: DataTypes.STRING,
      url: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "EmployeeDocument",
    }
  );
  return EmployeeDocument;
};
