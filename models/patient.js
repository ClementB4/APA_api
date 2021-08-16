import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class Patient extends Model {
  static init(sequelize, DataTypes) {
  super.init({
    id: {
      autoIncrement: true,
      autoIncrementIdentity: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    last_name: {
      type: DataTypes.STRING(50),
      allowNull: false      
    },
    first_name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    birth_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    sexe: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    taille: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    poids: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    theory: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    real: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
  }, {
    sequelize,
    tableName: 'patient',
    schema: 'public',
    timestamps: false,
    indexes: [      
      {
        name: "patient_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  return Patient;
  }
}
