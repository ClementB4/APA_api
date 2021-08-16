import express from 'express';
const app = express();
import sequelize from './db.js'
import { fillDb, syncDb, comparePswd } from './helpers/index.js'
import initModels from './models/init-models.js'
import * as models from './models/index.js'
import fs from 'fs';
import FormData from 'form-data';
import axios from 'axios';
import qs from 'qs';
import csv from 'csvtojson';
import moment from 'moment';
import DataFrame from 'dataframe-js';
import xlsx from 'node-xlsx';
import cors from 'cors'
import jwt from 'jsonwebtoken'
import { readFile } from 'fs/promises';

const PATIENTS = async () => {
  return JSON.parse(
    await readFile(
      new URL('./data/patient.json', import.meta.url)
    )
  )
}


const verifyJWT = (req, res, next) => {
  const token = req.headers["x-acces-token"]
  console.log(token)

  if (!token) {
    res.send("you need to send a token !!!")
  } else {
    jwt.verify(token, "secretToStoreInDotEnv", (err, decoded) => {
      if (err) {
        res.json({ auth: false, message: "authentifation failed" })
      } else {
        req.userId = decoded.id
        next()
      }
    })
  }
}


initModels(sequelize)
syncDb(sequelize)

  .then(async () => {
    // check if user table is empty (yes --> fillDb)
    const countUsers = await models.User.count()


    if (countUsers === 0) fillDb()
  })
  .catch(function (error) {
    console.log('CATCH : ', error)
  })

app.use(
  express.urlencoded({
    extended: true,
    limit: '500mb',
    parameterLimit: 1000000
  })
)
app.use(express.json({ limit: '500mb' }));
app.use(cors())


app.post('/user/register', async (req, res, next) => {

  const { login, password } = req.body

  const myUser = await models.User.findAll({
    raw: true,
    where: {
      login
    }
  })

  if (!myUser || myUser.length !== 1) {
    console.log('not found !')
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.status(401)
    res.send('No user found')
  } else {
    console.log('found !')
    let id = myUser[0].id
    let myUserHash = {
      salt: myUser[0].salt,
      hashedPassword: myUser[0].password
    }


    console.log(await comparePswd(password, myUserHash))

    let match = await comparePswd(password, myUserHash);
    if (match) {
      const token = jwt.sign({ id }, "secretToStoreInDotEnv", {
        expiresIn: "1d",
      })

      console.log('match');

      res.setHeader("Content-Type", "application/json");
      res.setHeader("Access-Control-Allow-Origin", "*")
      res.status(200)
      //res.send('WORKING NICE')     
      res.json({ auth: true, token, result: myUser[0].login })
    } else {
      res.status(401)
      res.send('ERROR IN LOGGIN')
    }
  }
})

app.get('/home', (req, res) => {

  res.setHeader("Access-Control-Allow-Origin", "*")
  res.send('WORKING HOME')

})

app.post('/getpatients', async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*")
  const myUsers = await models.Patient.findAll({
    raw: true,
  })
  console.log(myUsers)
  myUsers.forEach((user) => {
    const dateSplit = user.birth_date.split("-");
    user.birth_date = dateSplit[2] + "/" + dateSplit[1] + "/" + dateSplit[0]
  })
  res.send(myUsers)
})

app.post('/getpatientsbyid', async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*")
  const myUsers = await models.Patient.findOne({
    raw: true,
    where: { id: req.body['0'].id_value }
  })
  console.log(myUsers)
  const dateSplit = myUsers.birth_date.split("-");
  myUsers.birth_date = dateSplit[2] + "/" + dateSplit[1] + "/" + dateSplit[0]
  res.send(myUsers)
})

app.post('/deletepatient', async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*")
  await models.Patient.destroy({
    where: { id: req.body['0'].id }
  })
  res.send("delete")
})

app.post('/setpatient', async (req, res) => {

  console.log(new Date(req.body['0'].birthdate))
  res.setHeader("Access-Control-Allow-Origin", "*")
  try {
    const myUsers = await models.Patient.create({
      last_name: req.body['0'].name,
      first_name: req.body['0'].firstname,
      birth_date: req.body['0'].birthdate,
      real: req.body['0'].real,
      theory: req.body['0'].theory
    })
    res.send('patient créé')
  } catch {
    res.status(599).send('Echec de la création patient')
  }
})

app.post('/updatepatient', async (req, res) => {
  console.log('in update patient !!!!!!')
  console.log(req.body)

  req.body['0'].birthdate = moment(new Date(req.body['0'].birthdate)).format('YYYYMMDD')
  if (req.body['0'].real !== '') req.body['0'].real = parseInt(req.body['0'].real)
  else req.body['0'].real = null
  if (req.body['0'].theory !== '') req.body['0'].theory = parseInt(req.body['0'].theory)
  else req.body['0'].theory = null
  try {
    const myUsers = await models.Patient.update({
      last_name: req.body['0'].name,
      first_name: req.body['0'].firstname,
      birth_date: req.body['0'].birthdate,
      real: req.body['0'].real,
      theory: req.body['0'].theory
    },
      { where: { id: parseInt(req.body['0'].id) } }
    )
    res.send('patient modifié')
  } catch (err) {
    console.log(err)
    res.status(599).send('Echec de la modification patient')
  }
})

app.post('/getParamExport', async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*")
  const myExport = await models.parametre_export.findAll({
    raw: true,
  })
  res.send(myExport[0])
})
app.post('/updateParamExport', async (req, res) => {
  console.log("UPDATE PARAMETRE DEXPORT !!!!!!")
  res.setHeader("Access-Control-Allow-Origin", "*")
  try {
    console.log(req.body)
    const myUsers = await models.parametre_export.update({
      path_to_cardiogramme: req.body['0'].cardioPath,
      path_to_tablette: req.body['0'].tablettPath,
      lissage_courbe: req.body['0'].BooleanLissage
    },
      { where: { statut: 'ACTIF' } }
    )
    res.send("parametres d'export modifié")
  } catch {
    res.status(599).send('Echec de la modification des parametres')
  }
})
app.post('/getSeanceById', async (req, res) => {

  const fk_patient = req.body.patient;
  try {
    const seances = await models.Seance.findAll({
      raw: true,
      where: {
        fk_patient
      }
    })
    res.send(seances)
  } catch {
    res.status(599).send('Echec')
  }
})

app.post('/getSeanceBydate', async (req, res) => {
  const date = req.body.date;

  // try {
  //   const PatientsSeance = await models.Seance.findAll({
  //     // raw: true,
  //     include: 
  //     {
  //       model: models.Patient,        
  //       where: { date :  date }
  //     }
  //   });
  //   res.send(PatientsSeance)

  // } catch {
  //   res.status(599).send('Echec')
  // }  

  try {
    const seances = await models.Seance.findAll({
      raw: true,
      where: {
        date
      }
    })
    if (seances.length > 0) {
      var temp = [];

      seances.forEach((item, index) => {
        const id = item.fk_patient;
        temp.push(item.fk_patient)
        console.log(temp)
      });

      try {
        const patients = models.Patient.findAll({
          raw: true,
          // where: { id: {in: [temp]} }
          where: {
            id: temp
          }
        }).then((value) => {
          res.send(value)
        })

      } catch {
        res.status(599).send('Echec')
      }


    } else {
      res.send(undefined);
    }
  } catch {
    res.status(599).send('Echec')
  }

})

app.get('/sendDataToML', async (req, res) => {

  const seances = await models.Seance.findAll({
    raw: true,
    attributes: ['csv', 'timestamp', 'activites'],
  })
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.send(seances);

})

app.get('/getTypeNiveau_1', async (req, res) => {

  const TypeNiveau_1 = await models.TypeNiveau_1.findAll({
    raw: true
  })
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.send(TypeNiveau_1);
})

app.get('/getTypeNiveau_2', async (req, res) => {

  const TypeNiveau_2 = await models.TypeNiveau_2.findAll({
    raw: true
  })
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.send(TypeNiveau_2);
})

app.post('/envoiCsv', async (req, res) => {

  // var UnityJson = {"sceances_list":[{"name":"Romann","surname":"Daniel","age":55,"timestamp":["0","180","180","1620812350","1620812510","1620813654"],"pause_list":["1620811304"],"startTime":"1620811304","stopTime":"1620813655"}]}
  // const CardioJson = {"time":["0:00","0:01","0:02","0:03","0:04","0:05","0:06","0:07","0:08","0:09","0:10","0:11","0:12","0:13","0:14","0:15","0:16","0:17"],"HR":["99","98","99","101","102","104","106","108","110","111","111","110","93","94","98","100","101","102"]}
  // UnityJson = UnityJson["sceances_list"][0];
  // var Delta = 1;
  // var SeanceType = [[1,2],[2,3],[3,1]];

  var UnityJson = req.body; // à completer
  const CardioJson = req.body; // à completer
  // UnityJson = UnityJson["sceances_list"]['0']; // à modifier si besoin
  var Delta = req.body; // à completer
  var SeanceType = req.body; // à completer

  const dict = { key1: UnityJson, key2: CardioJson, key3: Delta, key4: SeanceType };

  axios({
    method: 'post',
    url: 'http://localhost:5000/api/apa/CsvTimestamp',
    data: dict
  })
    .then(async (res) => {
      var timestamp = res.data["key1"];
      var csv = res.data["key2"];
      var delta = res.data["key3"];
      var seanceType = res.data["key4"];

      var today = moment(new Date).format('YYYY-MM-DD')

      const fk_patient = await models.Patient.findAll({
        raw: true,
        attributes: ['id'],
        where: {
          last_name: timestamp['name'],
          first_name: timestamp['surname'],
        },
      })

      if (!fk_patient || fk_patient.length !== 1) {
        console.log('Patient no found => Seance not saved !!')
      } else {
        const Seance = await models.Seance.create({
          fk_patient: fk_patient[0].id,
          date: today,
          csv: csv,
          timestamp: timestamp,
          delta: delta
        }).then(function (m) {
          seanceType.forEach((value) => {
            const SeanceType = models.SeanceType.create({
              fk_typeNiveau_1: value[0],
              fk_typeNiveau_2: value[0],
              fk_seance: m.id
            })
          })
        });
        console.log('Seance saved in bdd !!')

      }

    }).catch(err => {
      console.log(err)
    });
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.send('ok')
})

app.get('/test', async (req, res) => {

  const patients = await PATIENTS()

  csv({
    noheader: true,
    output: "csv"
  })
    .fromFile('./data/APA_Signaux_last_clean.csv')
    .then(async (csvRow) => {

      const mylen = csvRow.length
      for (let i = 1; i < mylen; i++) {
        console.log(csvRow[i])
        const patientNumber = csvRow[i][6].split('.')[0]
        const myFreqFileNumber = csvRow[i][6]
        const myPatient = patients[patientNumber]


        let CardioJson = getFreq(myFreqFileNumber)


        const newPatient = await models.Patient.findOrCreate(
          {
            where: {
              first_name: myPatient.first_name, last_name: myPatient.last_name
            }, defaults: myPatient
          })

        const [UnityJson, SeanceType] = getTimestamp(csvRow[i], newPatient)
        console.log('unityJson :')
        console.log(UnityJson.seance_List[0].timestamp)
        console.log('seanceType :')
        console.log({ SeanceType })


        const dict = { key1: UnityJson, key2: CardioJson, key3: 0, key4: SeanceType };

        axios({
          method: 'post',
          url: 'http://localhost:5000/api/apa/CsvTimestamp',
          data: dict
        })
          .then(async (res) => {
            var timestamp = res.data["key1"];
            console.log('******** timestamp *******')
            console.log(res.data["key4"])
            console.log(timestamp.seance_List[0]['name'])
            console.log(timestamp.seance_List[0]['surname'])
            console.log('**************************')


            var csv = res.data["key2"];
            var delta = res.data["key3"];
            var seanceType = res.data["key4"];

            var today = moment(new Date).format('YYYY-MM-DD')

            const fk_patient = await models.Patient.findAll({
              raw: true,
              attributes: ['id'],
              where: {
                last_name: timestamp.seance_List[0]['surname'],
                first_name: timestamp.seance_List[0]['name'],
              },
            })

            if (!fk_patient || fk_patient.length !== 1) {
              console.log('Patient no found => Seance not saved !!')

            } else {

              const Seance = await models.Seance.create({
                fk_patient: fk_patient[0].id,
                date: today,
                csv: csv,
                timestamp: timestamp,
                delta: delta
              })
              console.log(Seance)
              const idSeance = Seance.dataValues.id
              console.log(idSeance)
              try {
                await seanceType.forEach((value) => {
                  console.log(value[0] + ' ' +value[1])
                  console.log(typeof value[0])
                  const typeNiveau1 = (parseInt(value[0])) +1
                  const typeNiveau2 = (parseInt(value[1])) +1
                  console.log(typeNiveau1 + ' ' + typeNiveau2)
                  const SeanceType = models.SeanceType.create({
                    fk_typeNiveau_1: parseInt(value[0]) +1,
                    fk_typeNiveau_2: parseInt(value[1]) +1,
                    fk_seance: idSeance
                  })
                })
                console.log(SeanceType)
                console.log('Seance saved in bdd !!')
              } catch(err) {
                console.log('ERROR CREATE SEANCETYPE')
              }


              

            }

          }).catch(err => {
            console.log(err)
          });
        //res.setHeader("Access-Control-Allow-Origin", "*")
        //res.send('ok')
      }

    })


})

function getFreq(fileNumber) {
  let myFreqFile = xlsx.parse(fs.readFileSync(`./data/freq/${fileNumber}.xls`))[0].data;
  let cardioJson = {
    time: [],
    HR: [],
  }
  for (const property in myFreqFile) {
    if (parseInt(myFreqFile[property][0][0]) >= 0) {
      cardioJson.time.push(myFreqFile[property][0])
      cardioJson.HR.push(myFreqFile[property][1])
    }
  }
  return cardioJson
}

function getTimestamp(row, newPatient) {
  // var UnityJson = {"sceances_list":[{"name":"Romann","surname":"Daniel","age":55,"timestamp":["1620811314","1620811315","1620811392","1620812350","1620812510","1620813654"],"pause_list":["1620811304"],"startTime":"1620811304","stopTime":"1620813655"}]}
  const UnityJson = {
    "seance_List": [{
      "name": newPatient[0].dataValues['first_name'],
      "surname": newPatient[0].dataValues['last_name'],
      "age": row[1],
      "timestamp": []
    }]
  }
  const SeanceType = []
  console.log(UnityJson)


  let start1 = 0
  let end1 = convertTime(row[10])
  let activitePhase1 = [row[7], row[8]]
  if (start1 !== '' && end1 !== '' && activitePhase1 !== []) {
    UnityJson.seance_List[0].timestamp.push(start1, end1)
    SeanceType.push(activitePhase1)
  }

  let start2 = convertTime(row[13])
  let end2 = convertTime(row[14])
  let activitePhase2 = [row[11], row[12]]
  if (start2 !== '' && end2 !== '' && activitePhase2 !== []) {
    UnityJson.seance_List[0].timestamp.push(start2, end2)
    SeanceType.push(activitePhase2)
  }

  let start3 = convertTime(row[17])
  let end3 = convertTime(row[18])
  let activitePhase3 = [row[15], row[16]]
  if (start3 !== '' && end3 !== '' && activitePhase3 !== []) {
    UnityJson.seance_List[0].timestamp.push(start3, end3)
    SeanceType.push(activitePhase3)
  }


  let start4 = convertTime(row[21])
  let end4 = convertTime(row[22])
  let activitePhase4 = [row[19], row[20]]
  if (start4 !== '' && end4 !== '' && activitePhase4 !== []) {
    UnityJson.seance_List[0].timestamp.push(start4, end4)
    SeanceType.push(activitePhase4)
  }


  /*
    console.log('start1 at : ' + start1)
    console.log('end1 at : ' + end1)
    console.log('activitePhase1 : ' + activitePhase1)
  
    console.log('start2 at : ' + start2)
    console.log('end2 at : ' + end2)
    console.log('activitePhase2 : ' + activitePhase2)
  
    console.log('start3 at : ' + start3)
    console.log('end3 at : ' + end3)
    console.log('activitePhase3 : ' + activitePhase3)
  
    console.log('start3 at : ' + start4)
    console.log('end3 at : ' + end4)
    console.log('activitePhase3 : ' + activitePhase4)
  
  
    console.log(UnityJson)
    console.log(UnityJson.seance_List[0].timestamp) 
    console.log(SeanceType)
  */
  return [UnityJson, SeanceType]
}

function convertTime(timeStr) {
  if (timeStr === '') return ''
  if (timeStr === '0') return parseInt(timeStr)
  const timeArray = timeStr.split('min')
  //console.log('minute = '+timeArray[0])
  //console.log('seconde = ' +timeArray[1])

  if (timeArray[1]) return parseInt(timeArray[0]) * 60 + parseInt(timeArray[1])
  return parseInt(timeArray[0]) * 60
}

export default app