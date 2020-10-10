"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Employee extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Employee.hasMany(models.EmployeeDocument);
      Employee.belongsTo(models.Company);
    }
  }
  Employee.init(
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      department: DataTypes.STRING,
      line_manager_name: DataTypes.STRING,
      line_manager_position: DataTypes.STRING,
      line_manager_phone: DataTypes.STRING,
      office_phone: DataTypes.STRING,
      phone_number: DataTypes.STRING,
      street_address: DataTypes.STRING,
      city: DataTypes.STRING,
      sate: DataTypes.STRING,
      date_of_birth: DataTypes.DATE,
      nationality: DataTypes.STRING,
      gender: DataTypes.STRING,
      weight: DataTypes.DECIMAL,
      height: DataTypes.DECIMAL,
      genotype: DataTypes.STRING,
      blood_group: DataTypes.STRING,
      bank_name: DataTypes.STRING,
      account_number: DataTypes.STRING,
      tax_id: DataTypes.STRING,
      pension_id: DataTypes.STRING,
      insurance_number: DataTypes.STRING,
      nok_name: DataTypes.STRING,
      nok_email: DataTypes.STRING,
      nok_phone: DataTypes.STRING,
      nok_street: DataTypes.STRING,
      nok_address: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Employee",
    }
  );
  return Employee;
};
