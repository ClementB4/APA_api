import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class TypeNiveau_2 extends Model {
  static init(sequelize, DataTypes) {
  super.init({
        id: {
        autoIncrement: true,
        autoIncrementIdentity: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
        },
        name: {
            type: DataTypes.STRING(50),
            allowNull: false      
        }        
    }, {
        sequelize,
        tableName: 'typeNiveau_2',
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
  return TypeNiveau_2;
  }
}
