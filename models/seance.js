import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class Seance extends Model {
  static init(sequelize, DataTypes) {
  super.init({
        id: {
        autoIncrement: true,
        autoIncrementIdentity: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
        },
        fk_patient: {
            type: DataTypes.INTEGER,
            allowNull: true              
        },
        date: {
            type: DataTypes.DATEONLY,
            allowNull: true      
        },
        csv: {
            type: DataTypes.JSON,
            allowNull: true
        },
        timestamp: {
        type: DataTypes.JSON,
        allowNull: true
        },        
        delta: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    }, {
        sequelize,
        tableName: 'seance',
        schema: 'public',
        timestamps: false,
        indexes: [      
        {
            name: "seance_pkey",
            unique: true,
            fields: [
            { name: "id" },
            ]
        },
        ]
    });
  return Seance;
  }
}
