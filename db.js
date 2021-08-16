import Sequelize from 'sequelize'


const sequelize = new Sequelize('fil_rouge', "postgres", "admin", {
  dialect: 'postgres',
});



export default sequelize;