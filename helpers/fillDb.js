import * as models from '../models/index.js'
import { generateSalt, hash,  } from './index.js'

async function fillUser() {
    let psw1 = 'admin'
    let salt1 = generateSalt(12)
    const hashedPassword1 = hash('admin', salt1)


    let salt2 = generateSalt(12)
    let hashedPassword2 = hash('eApa', salt2)


    const admin = await models.User.create({
        login: 'admin',
        password: hashedPassword1.hashedPassword,
        salt: hashedPassword1.salt
    })

    const eApa = await models.User.create({
        login: 'eApa',
        password: hashedPassword2.hashedPassword,
        salt: hashedPassword2.salt
    })

    const Patient = await models.Patient.create({
        last_name: 'Romann',
        first_name: 'Daniel',
        birth_date: "1972-12-20"
    })

    const TypeNiveau_1 = await models.TypeNiveau_1.create({      
        name: 'Repos'            
    })

    const TypeNiveau_1_1 = await models.TypeNiveau_1.create({      
        name: 'Cardio'            
    })

    const TypeNiveau_1_2 = await models.TypeNiveau_1.create({      
        name: 'Renforcement'            
    })

    const TypeNiveau_1_3 = await models.TypeNiveau_1.create({      
        name: 'Etirements et recuperation'            
    })


    const TypeNiveau_2_1 = await models.TypeNiveau_2.create({      
        name: 'repos'            
    })

    const TypeNiveau_2_2 = await models.TypeNiveau_2.create({      
        name: 'Tronc'           
    })

    const TypeNiveau_2_3 = await models.TypeNiveau_2.create({      
        name: 'Membres supérieurs'           
    })
    const TypeNiveau_2_4 = await models.TypeNiveau_2.create({      
        name: 'Membres inferieurs'           
    })
    const TypeNiveau_2_5 = await models.TypeNiveau_2.create({      
        name: 'Global'           
    })

    const parametre_export = await models.parametre_export.create({
        path_to_cardiogramme : 'Path_To_PC_Cardiogramme_Folder',
        path_to_tablette : 'Path_To_Tab',
        lissage_courbe : true,
        statut : 'ACTIF'
    })

    // const Seance = await models.Seance.create({
    //     fk_patient: '1',
    //     date: "2021-04-14",
    //     csv: '{"csv":"hello"}',
    //     timestamp: '{"timestamp":"hello"}',
    //     activites: '{"1":"1","2":"2","3":"4"}'
    // })    

    // const SeanceType = await models.SeanceType.create({        
    //     fk_typeNiveau_1: '1',
    //     fk_typeNiveau_2: '1',
    //     fk_seance: '1'    
    // })

    // return [ admin, eApa, Patient, TypeNiveau_1, TypeNiveau_1_1, TypeNiveau_1_2, TypeNiveau_1_3, TypeNiveau_2, TypeNiveau_2_1, TypeNiveau_2_2, Seance, SeanceType, parametre_export]
    return [ admin, eApa, Patient, TypeNiveau_1, TypeNiveau_1_1, TypeNiveau_1_2, TypeNiveau_1_3, TypeNiveau_2_1, TypeNiveau_2_2,  TypeNiveau_2_3,  TypeNiveau_2_4, TypeNiveau_2_5, parametre_export]
}

export default fillUser