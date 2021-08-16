import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class SeanceType extends Model {
  static init(sequelize, DataTypes) {
  super.init({
        id: {
        autoIncrement: true,
        autoIncrementIdentity: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
        },
        fk_typeNiveau_1: {
            type: DataTypes.INTEGER,
            allowNull: false      
        },
        fk_typeNiveau_2: {
            type: DataTypes.INTEGER,
            allowNull: false      
        },
        fk_seance: {
            type: DataTypes.INTEGER,
            allowNull: false      
        }    
    }, {
        sequelize,
        tableName: 'seanceType',
        schema: 'public',
        timestamps: false,
        indexes: [      
        {
            name: "type_pkey",
            unique: true,
            fields: [
            { name: "id" },
            ]
        },
        ]
    });
  return SeanceType;
  }
}
