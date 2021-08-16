import * as models from '../models/index.js'
import sequelize from "sequelize";

export default async function createDb(sequelize) {

  await models.User  // Using sequelize.drop()
    .sync() // create database from models  { if already existe : delete last db  }
    .catch(error => console.log(error))


  console.log("user created")

  await models.Patient  // Using sequelize.drop()
    .sync() // create database from models  { if already existe : delete last db  }
    .catch(error => console.log(error))


  console.log("patient created")

  await models.Seance  // Using sequelize.drop()
    .sync() // create database from models  { if already existe : delete last db  }
    .catch(error => console.log(error))


  console.log("seance created")

  await models.TypeNiveau_1  // Using sequelize.drop()
    .sync() // create database from models  { if already existe : delete last db  }
    .catch(error => console.log(error))


  console.log("type created")

  await models.TypeNiveau_2  // Using sequelize.drop()
    .sync() // create database from models  { if already existe : delete last db  }
    .catch(error => console.log(error))


  console.log("type created")

  await models.SeanceType  // Using sequelize.drop()
    .sync() // create database from models  { if already existe : delete last db  }
    .catch(error => console.log(error))


  console.log("activite created")  

  await models.parametre_export  // Using sequelize.drop()
    .sync() // create database from models  { if already existe : delete last db  }
    .catch(error => console.log(error))

  console.log("parametre_export created")

}
