
var config = require('../../config.json');
var mysql = require('mysql');

function promiseQuery(aquery)
{
  
  return new Promise((resolve, reject) => {
    var con = mysql.createConnection(config.connection);;
    con.connect(function(err) {
      if (err) {
        console.log(" connection lost :" + err )
        con.end();
          return reject(err.message)        
      }
    con.query(aquery, 
        function (err, result, fields) {
          con.end();
          if (err)
          {
            console.log(" execution error :" + err )

            return reject(err.message)
          }
          resolve(result,fields);      
        });
      });
  });

}


module.exports = promiseQuery;