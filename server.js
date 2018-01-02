// server.js
const express        = require('express');
const MongoClient    = require('mongodb').MongoClient;
const bodyParser     = require('body-parser');
const db             = require('./config/db');
const mongoose       = require('mongoose');
const app            = express();

const port = 8000;

app.use(bodyParser.urlencoded({ extended: true }));

MongoClient.connect(db.url, (err, database) => {
    
    if (err) return console.log(err)
    require('./app/routes')(app, database);
    
    app.listen(port, () => {
        console.log('We are live on ' + port);
    });               
})


/// https://mlab.com/databases/tallyrec/collections/teams?q=&f=&s=&pageNum=0&pageSize=10
/// https://medium.freecodecamp.org/building-a-simple-node-js-api-in-under-30-minutes-a07ea9e390d2