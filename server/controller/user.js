//var argv=require('yargs').argv;
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'mountblue',
  database : 'demo2'
});

connection.connect(function(err){
if(!err) {
    console.log("Database is connected ... nn");
} else {
    console.log("Error connecting database ... nn");
}
});

function loginUser(email,password,cb){
  connection.query('SELECT * FROM users WHERE email = ?',[email], function (error, results) {
      if (error) {
        cb(error, 0)
      }
      else{
        console.log('The solution is: ', results);
          if(results.length >0){
            if(results[0].password == password){
              cb(0,results)
            }
            else{
              error = "Email And Password Does Not Match"
              cb(error,0)
            }
          }
        else{
          error = "Email Does Not Exist";
          cb(error,0)
        }
    }
  })
}



function registerUser(users,cb){
  console.log(users);
  connection.query('INSERT INTO users SET ?',users, function (error, results) {
    if (error) {
      cb(error,0)
    }else{
      cb(0,results)
    }
  });
}


function subTournament(tour_name,id,cb){
  connection.query(`insert into tournament (tour_name,id)  values (?,?)`,[tour_name,id], function (error, results) {
      if (error) {
        cb(error, 0)
      }
      else{
        cb(0,results);
      }
  })
}


module.exports = {
  registerUser : registerUser,
  loginUser : loginUser,
  subTournament : subTournament
}


