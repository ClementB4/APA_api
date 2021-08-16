import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class parametre_export extends Model {
  static init(sequelize, DataTypes) {
  super.init({
        id: {
        autoIncrement: true,
        autoIncrementIdentity: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
        },
        path_to_cardiogramme: {
            type: DataTypes.STRING(255),
            allowNull: true      
        },
        path_to_tablette : {
            type: DataTypes.STRING(255),
            allowNull: true      
        },
        lissage_courbe : {
            type: DataTypes.BOOLEAN,
            allowNull: true  
        },
        statut : {
            type: DataTypes.STRING(55),
            allowNull: true  
        }
    }, {
        sequelize,
        tableName: 'parametre_export',
        schema: 'public',
        timestamps: false,
        indexes: [      
        {
            name: "parametre_export_pkey",
            unique: true,
            fields: [
            { name: "id" },
            ]
        },
        ]
    });
  return parametre_export;
  }
}
