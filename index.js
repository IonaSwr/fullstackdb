// var config = require('./config.json');
// var express = require( 'express' );
 var vhost = require( 'vhost' );
// const path = require('path');
// const mysql = require('mysql');
// var fs = require('fs');
// const jwt = require('jsonwebtoken');
// const expressJwt = require('express-jwt');
// const bodyParser = require('body-parser');
var promiseQuery = require('./_root/server/db');


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
const sysdbs= {
    information_schema:"information_schema",
    mysql:"mysql",
    performance_schema:"performance_schema",
    sys:"sys"
}
var app = express();
app.use(vhost('localhost', express.static( 'client' )));


app.get('/updateprocs',function(req,res){
    var dbs = [];  
    var parameters = [];

    promiseQuery("show databases;")
    .then(result =>{
      
        for(var  i = 0 ; i < result.length ; i++)
            if(sysdbs[result[i].Database] ==null){
                dbs.push(result[i].Database);
                var dir = './apis';

                if (!fs.existsSync(dir + '/' + result[i].Database ))
                    fs.mkdirSync(dir + '/' + result[i].Database);
                
            }

        return promiseQuery("SELECT SPECIFIC_SCHEMA,SPECIFIC_NAME,ORDINAL_POSITION,PARAMETER_NAME,DTD_IDENTIFIER from information_schema.PARAMETERS where ROUTINE_TYPE = 'PROCEDURE' and SPECIFIC_SCHEMA != 'sys' and SPECIFIC_SCHEMA != 'mysql' and SPECIFIC_SCHEMA != 'information_schema' and SPECIFIC_SCHEMA != 'performance_schema' order by SPECIFIC_SCHEMA,SPECIFIC_NAME,ORDINAL_POSITION;")

    })
    .then(result=>{
        for(var  i = 0 ; i < result.length ; i++)
        {
            parameters.push(result[i]);
        }
        return promiseQuery("SELECT ROUTINE_SCHEMA,SPECIFIC_NAME,ROUTINE_DEFINITION FROM INFORMATION_SCHEMA.ROUTINES WHERE ROUTINE_SCHEMA != 'sys' and ROUTINE_SCHEMA != 'mysql' and ROUTINE_SCHEMA != 'information_schema' and ROUTINE_SCHEMA != 'performance_schema' order by ROUTINE_SCHEMA,SPECIFIC_NAME;  ")
    })
    .then(result=>{

        var counter = 0 ;
        var counterParams = 0 ;
        for(var  i = 0 ; i < result.length ; i++)
            if(sysdbs[result[i].ROUTINE_SCHEMA] ==null){
                //console.log(result[i].ROUTINE_SCHEMA + '.' + result[i].SPECIFIC_NAME)
                counter++;
                var parametersStr = ''
                for(var j = 0 ; j < parameters.length ; j++)
                    if(parameters[j].SPECIFIC_SCHEMA == result[i].ROUTINE_SCHEMA && parameters[j].SPECIFIC_NAME == result[i].SPECIFIC_NAME )
                        {parametersStr += parameters[j].PARAMETER_NAME + ' ' + parameters[j].DTD_IDENTIFIER+ ',';counterParams++}
                parametersStr=   parametersStr.substring(0,parametersStr.length -1);
                fs.writeFile('./apis/' + result[i].ROUTINE_SCHEMA + '/' + result[i].SPECIFIC_NAME + '.sql',
                'DROP procedure IF EXISTS '+result[i].ROUTINE_SCHEMA+'.'+result[i].SPECIFIC_NAME+';\n'+
                'CREATE DEFINER=root@localhost PROCEDURE '+result[i].ROUTINE_SCHEMA+'.'+result[i].SPECIFIC_NAME+' ( '+parametersStr+')\n'+
                result[i].ROUTINE_DEFINITION, function (err) {
                    if (err) throw err;
                  });
            }
        
        res.send({success:true,procedures:counter,parameters:counterParams})
    })
  
  });

app.post('/',function(req,res){
    promiseQuery('call work_missions.test();')
    .then(result=>{
        res.send({success:true,data:result})
    })
})

app.post('/:dbname/:procname',function(req,res){
    promiseQuery('call ' + req.params.dbname + '.' + req.params.procname + '();')
    .then(result=>{
        res.send({success:true,data:result})
    })
})

// app.get('/updateprocs',function(req,res){
//     promiseQuery(query)
//     .then(result => {
        
//         return res.send({success:true})
//     })    
  
//   });
  
//SELECT ROUTINE_SCHEMA,SPECIFIC_NAME,ROUTINE_DEFINITION FROM INFORMATION_SCHEMA.ROUTINES         WHERE ROUTINE_SCHEMA != 'sys' and ROUTINE_SCHEMA != 'mysql' and ROUTINE_SCHEMA != 'information_schema' and ROUTINE_SCHEMA != 'performance_schema'          and dbname = ROUTINE_SCHEMA           order by ROUTINE_SCHEMA,SPECIFIC_NAME;  
  
//SELECT SPECIFIC_SCHEMA,SPECIFIC_NAME,ORDINAL_POSITION,PARAMETER_NAME,DTD_IDENTIFIER from information_schema.PARAMETERS where ROUTINE_TYPE = 'PROCEDURE'         and SPECIFIC_SCHEMA != 'sys' and SPECIFIC_SCHEMA != 'mysql' and SPECIFIC_SCHEMA != 'information_schema' and SPECIFIC_SCHEMA != 'performance_schema'         and dbname = SPECIFIC_SCHEMA          order by SPECIFIC_SCHEMA,SPECIFIC_NAME,ORDINAL_POSITION;   

var port = config.serverport;
app.listen( port, function() {
    console.log( 'Express server listening on port %d in %s mode', port, app.settings.env );
});