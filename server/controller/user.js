var bcrypt = require('bcrypt');
const saltRounds = 10;

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

//+++++++++++++++++++++++++++++++++++++++++++++++++Logni User+++++++++++++++++++++++++++++++++++++++//

function loginUser(email,password,cb){

  connection.query('SELECT * FROM users WHERE email = ?',[email], function (error, results) {
    if (error) {
      cb(error, 0)
    }
    else{
      console.log('The solution is: ', results);
      if(results.length >0){
        if(bcrypt.compareSync(password, results[0].password)){
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


//++++++++++++++++++++++++++++++++++++++++++++++Register User++++++++++++++++++++++++++++++++++++++++++++


function registerUser(users,cb){
  uname = users.first_name;
  lname = users.last_name;
  email = users.email;
  password = users.password;

  var hash = bcrypt.hashSync(password, saltRounds);
  var sql = `INSERT INTO users (first_name,last_name,email,password) VALUES ('${uname}','${lname}','${email}','${hash}')`;
  connection.query(sql, function (error, results) {
    if (error) {
      cb(error,0)
    }else{
      cb(0,results)
    }
  });
}


//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

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


