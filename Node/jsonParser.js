const express = require('express');
const path = require('path');
var cors = require('cors')
const app = express();
var axios = require('axios');
var bodyParser = require('body-parser')
var fs = require('fs');
const NodeCache = require('node-cache');
const myCache = new NodeCache();
var admin = require("firebase-admin");
app.use(bodyParser.json())
app.use(cors())

var serviceAccount = require("./creds.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore()


const gas = [
    {gas: 'O2'},
    {gas: 'DA'},
    {gas: 'N2'}, 
    {gas: 'H2'},
    {gas: 'AMM'},
    {gas: 'CO2'}, 
    {gas: 'ARG'},
    {gas: 'AIR'},
    {gas: 'N20'},
]

const updateDB = async () =>{
    try{
        fs.readFile('csvjson.json', (err, data) => {
            if (err) throw err;
            let parties = JSON.parse(data);
            var cylinders = gas.map( item =>{
                var obj = {
                    gas: item.gas,
                    quantity: 0
                }
                return obj
              })
            const batchArray = [];
            batchArray.push(db.batch());
            let operationCounter = 0;
            let batchIndex = 0;
    
    
    
            parties.map( async item =>{
                item.Name = item.Name.replace(/\s+/g,' ').trim()
                item.Name = item.Name.replace(/[&\/\\#, +()$~%.'":*?<>{}]/g, '_')
                var obj = {
                    partyName: item.Name,
                    contactPerson: '',
                    partyContact: '',
                    balance: cylinders,
                    contactPersonSO: '',
                    partyCity: '',
                    partyVillage: '',
                    partyAddress: '',
                }
    
                // await fs.appendFile('parties.json', JSON.stringify(obj), function (err) {
                //     if (err) throw err;
                //     console.log('!');
                // });
    
                var docRef = db.collection('parties').doc(obj.partyName)
                await batchArray[batchIndex].set(docRef, obj);
                operationCounter++;
        
                if (operationCounter === 499) {
                    batchArray.push(db.batch());
                    batchIndex++;
                    operationCounter = 0;
                }
                console.log(obj)
            })
            batchArray.forEach(async batch => await batch.commit())
        })
    } catch (err) {
        console.log(err)
    }
}

updateDB()

