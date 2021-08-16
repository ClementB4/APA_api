import _sequelize from "sequelize";
const DataTypes = _sequelize.DataTypes;
import _user from  "./user.js";
import _patient from  "./patient.js";
import _seance from  "./seance.js";
import _typeNiveau_1 from  "./TypeNiveau_1.js";
import _typeNiveau_2 from  "./TypeNiveau_2.js";
import _seanceType from './SeanceType.js';
import _parametre_export from  "./parametre_export.js";



export default function initModels(sequelize) {
  var user = _user.init(sequelize, DataTypes);
  var patient = _patient.init(sequelize, DataTypes);
  var seance = _seance.init(sequelize, DataTypes);  
  var typeNiveau_1 = _typeNiveau_1.init(sequelize, DataTypes);
  var typeNiveau_2 = _typeNiveau_2.init(sequelize, DataTypes);
  var seanceType = _seanceType.init(sequelize, DataTypes);
  var parametre_export = _parametre_export.init(sequelize, DataTypes);

  seance.belongsTo(patient, { as: "patient",foreignKeyConstraint: true, foreignKey: "fk_patient"});  
  patient.hasMany(seance, { as: "seances",foreignKeyConstraint: true, foreignKey: "fk_patient"})  

  seanceType.belongsTo(seance, { as: "seance",foreignKeyConstraint: true, foreignKey: "fk_seance"});  
  seance.hasMany(seanceType, { as: "seanceType",foreignKeyConstraint: true, foreignKey: "fk_seance"})  

  seanceType.belongsTo(typeNiveau_1, { as: "typeNiveau_1",foreignKeyConstraint: true, foreignKey: "fk_typeNiveau_1"});  
  typeNiveau_1.hasMany(seanceType, { as: "seanceTypeN1",foreignKeyConstraint: true, foreignKey: "fk_typeNiveau_1"})  

  seanceType.belongsTo(typeNiveau_2, { as: "typeNiveau_2",foreignKeyConstraint: true, foreignKey: "fk_typeNiveau_2"});  
  typeNiveau_1.hasMany(seanceType, { as: "seanceTypeN2",foreignKeyConstraint: true, foreignKey: "fk_typeNiveau_2"})  
 
  return {
    user,
    patient,
    seance,
    typeNiveau_1,
    typeNiveau_2,
    seanceType,
    parametre_export 
  };
}
