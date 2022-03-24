// var config = require('./config.json');
// var express = require( 'express' );
 var vhost = require( 'vhost' );
// const path = require('path');
// const mysql = require('mysql');
// var fs = require('fs');
// const jwt = require('jsonwebtoken');
// const expressJwt = require('express-jwt');
// const bodyParser = require('body-parser');


const watch = require('node-watch');
const fs = require('fs');
const express = require( 'express' );
var config = require('./config.json');

fs.watch('models', function (event, filename) {
    console.log('event is: ' + event);
    if (filename) {
        console.log('filename provided: ' + filename);
    } else {
        console.log('filename not provided');
    }
});

var app = express();


// app.get('/',function(req,res){

//     console.log("get success");
//     res.send("OK");
// });

app.use(vhost("localhost",express.static( "client/") ));

app.get('/updateprocs',function(req,res){
    promiseQuery(query)
    .then(result => {
        
        return res.send({success:true})
    })    
  
  });
  
//SELECT ROUTINE_SCHEMA,SPECIFIC_NAME,ROUTINE_DEFINITION FROM INFORMATION_SCHEMA.ROUTINES         WHERE ROUTINE_SCHEMA != 'sys' and ROUTINE_SCHEMA != 'mysql' and ROUTINE_SCHEMA != 'information_schema' and ROUTINE_SCHEMA != 'performance_schema'          and dbname = ROUTINE_SCHEMA           order by ROUTINE_SCHEMA,SPECIFIC_NAME;  
  
//SELECT SPECIFIC_SCHEMA,SPECIFIC_NAME,ORDINAL_POSITION,PARAMETER_NAME,DTD_IDENTIFIER from information_schema.PARAMETERS where ROUTINE_TYPE = 'PROCEDURE'         and SPECIFIC_SCHEMA != 'sys' and SPECIFIC_SCHEMA != 'mysql' and SPECIFIC_SCHEMA != 'information_schema' and SPECIFIC_SCHEMA != 'performance_schema'         and dbname = SPECIFIC_SCHEMA          order by SPECIFIC_SCHEMA,SPECIFIC_NAME,ORDINAL_POSITION;   

var port = config.serverport;
app.listen( port, function() {
    console.log( 'Express server listening on port %d in %s mode', port, app.settings.env );
});