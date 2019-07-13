/*
	The block of code below is used to access packages
	and assign constants to the packages. These packages are blocks or written also known as dependencies
	that consists of various methods and properties that are required for our project development
*/

var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
var crypto = require('crypto');

/* 
	The block of code below is used to establish connection to the database

*/


var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'alican',
	password : '123',
	database : 'nodelogin'
});

/*
	Assigning the express object to the variable called app
*/

var app = express();


/*
	generate a unique/secret session id
	store that session id in a session cookie (so subsequent requests made by the client can be identified)
*/

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));



/*
	This section helps you to get the request from the input fields from the html body and returns in json format

*/

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());


/* 
	The block of code below is used to allocate static files for example HTML, CSS, JavaScript and
*/

app.get('/', (request, response)=> {
	response.sendFile(path.join(__dirname + '/index.html'));
});

app.use(express.static(path.join(__dirname , '/public')));


app.get('/register', (request, response)=> {
	response.sendFile(path.join(__dirname + '/register.html'));
});


app.get('/toyota', (request, response)=> {
	response.sendFile(path.join(__dirname + '/toyota.html'));
});


/*
	the block of code below is used to take the users inputs from the html assign them to various constatnts and insert them into 
	database table called accounts
*/

app.post("/register", (req, res) => {
	const username = req.body.username;
	const hash = req.body.password;
	const password = crypto.createHash('md5').update(hash).digest('hex');
	const email = req.body.email;
  
	const queryString =
	  "INSERT INTO `accounts` (`username`, `password`, `email`) VALUES (?, ?, ?)";
	  connection.query(
	  queryString,
	  [username, password, email],
	  (err, result, field) => {
		if (err) {
		  console.log("an error has occured " + err);
		  res.status(500);
		  return;
		}
		else{
			res.redirect('/');
		}
	  }
	);
  });

  /*
	  This is used to take the inputs from an input field compare the values with that in the data base table
	  and grant access if a user of that particular name and password exists.
	  if he doesnt exist an alert is shown to him
   */
  
app.post('/auth', function(request, response) {
	var username = request.body.username;
	var passwordData = request.body.password;
	var password = crypto.createHash('md5').update(passwordData).digest('hex');
	if (username && password) {
		connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', 
		[username, password], 
		function(error, results, fields) {
			if (results.length > 0) {
				request.session.loggedin = true;
				request.session.username = username;
				response.redirect('/toyota');
			} else {
				response.send('Incorrect Username and/or Password!');
			}			
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});


/*
This helps to give a user the toyota home page if he or she has the correct access requirement
*/

app.get('/toyota', (request, response)=> {
	if (request.session.loggedin) {
		response.sendFile(path.join(__dirname + '/toyota.html'));
	} else {
		response.send('Please login to view this page!');
	}
	response.end();
});


/*
	the block of code below is used to take the users inputs from the html assign them to various constatnts and insert them into 
	database table called toyota
*/

app.post("/toyota", (req, res) => {
	const customerID = req.body.id_value;
	const name = req.body.name_value;
	const state = req.body.state_input;
	const retail = req.body.name_checkbox;
	const part = req.body.part_number_value;
	const description = req.body.description_value;
	const price = req.body.price_part;
	const quantity = req.body.quantity;
	const oversize = req.body.oversize;
	const shipping = req.body.choice;
  
	const queryString =
	  "INSERT INTO `toyota` (`customerID`, `name`, `state`, `retail`, `part`, `description`, `price`, `quantity`, `oversize`, `shipping`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
	  connection.query(
	  queryString,
	  [customerID, name, state, retail, part, description, price, quantity, oversize, shipping],
	  (err, result, field) => {
		if (err) {
		  console.log(`an error has occured  ${err}`);
		  result.status(500);
		  return;
		}
		}
	);
  });	


/*
This page enables a user to logout. It redirects the user to the login page 
*/

app.get('/logout', (request, response) => {

	request.session.loggedin = false;
	
	if (!request.session.loggedin) {
		response.redirect('/');
	}
	});


/*
The block of code below is used to provide a port on which the project is suppose to run.
*/

const PORT = process.env.PORT || 3003

app.listen(PORT,()=>{
	console.log(`server is running on ${PORT}`)
})
