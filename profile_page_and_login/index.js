/*
	The block of code below is used to access packages
	and assign constants to the packages. These packages are blocks or written also known as dependencies
	that consists of various methods and properties that are required for our project development
*/

const express = require('express');
const mysql = require('mysql');
const parser = require('body-parser');
const crypto = require('crypto');
const session = require('express-session')

//Assigning the express object to the variable called app

const app = express();


//Establishing a connection to the database

const connection = mysql.createConnection({
	host:'localhost',
	user:'alican',
	password:'123',
	database:'alican1'
})

/*
	generate a unique/secret session id
	store that session id in a session cookie (so subsequent requests made by the client can be identified)
*/

app.use(session({
	secret:'secret',
	resave:true,
	saveUninitialized: true
}))


// This section helps you to get the request from the input fields from the html body and returns in json format
app.use(parser.urlencoded({extended : true}));
app.use(parser.json());


//locating the various static files that are required for the user interface e.g the HTML, CSS, and the images

app.get('/', (req,res)=>{
	res.sendFile(require('path').join(__dirname , './login.html'))
})

app.get('/register', (req,res)=>{
	res.sendFile(require('path').join(__dirname , './register.html'))
})

app.use(express.static(require('path').join(__dirname , '/public')));


app.get('/home', function(request, response) {
	response.sendFile(require('path').join(__dirname + '/index.html'));
});


// The section beloww helps to alert the user if there is an error in the connection to the data-base

connection.connect(err=>{
	if(err){
		throw err
	}
	console.log('connected to database')
})


/* 

The block of codes below is used to obtained the various inputs from the user interface, assign them to certain constants that are then 
later used to insert the information  into database.
if an error occurs in the insertion process, an alart is provided.
*/

app.post('/userProfile',(req,res)=>{
	const name = req.body.name;
	const company = req.body.company;
	const email = req.body.email;
	const phone = req.body.phone;
	const massage = req.body.massage;

	const queryString = "INSERT INTO `profile`(`name`, `company`, `email`, `phone`,`massage`) VALUES(?, ?, ?, ?, ?)";

	connection.query(queryString, [name, company, email, phone, massage], (err,results,fields)=>{
		if(err){
			console.log(`the error is ${err}`);
			res.status(500);
			return;
		}
		else{
			res.redirect('/home')
		}
	})
})

/*
The block of codes below is used to obtain database information, compare it with the user inputs and provide the home page
if a user has provided the correct inputs
*/

app.post('/login', (req,res)=>{
	const username = req.body.username;
	const unencrypted = req.body.password;
	const password = crypto.createHash('md5').update(unencrypted).digest('hex');
	if(username && password){
		connection.query(
			'SELECT * FROM `accounts` WHERE `username` = ? AND `password` =?',[username,password],
			(err,results,fields)=>{
				if(results.length > 0){
					req.session.loggedIn = true;
					req.session.username = username;
					res.redirect('/home')
				}
				else{
					res.send('Incorrect username or/and password')
				}
				res.end();
			}
		)}

	else{
		res.send('please enter username and password')
		res.end();
	}
});

/*
This page is rendered if a particular user has provided a correct input credentials of input and password

*/

app.get('/home', (req,res)=>{
	if(req.session.loggedIn){
		res.sendFile(require('path').join(__dirname, '/index.html'))
	}else{
		res.send('please login to view this page')
	}
	res.end();
})


/* 

The block of codes below is used to obtained the various inputs from the user interface, assign them to certain constants that are then 
later used to insert the information  into database.
if an error occurs in the insertion process, an alart is provided.
*/

app.post('/register', (req,res)=>{
	const username = req.body.username;
	const unencrypted = req.body.password
	const password = crypto.createHash('md5').update(unencrypted).digest('hex');
	const email = req.body.email;

	const queryString = "INSERT INTO `accounts` (`username`, `password`, `email`) VALUES (?, ?, ?)";

	connection.query(queryString, [username,password,email], (err,results,fields)=>{
		if(err){
			console.log(`an error occured ${err}`)
			results.status(500);
			return;
		}
		else{
			res.redirect('/')
		}

	})
})

/*
This section helps to create a port on which the application should run
*/
const PORT = process.env.PORT || 3001;

app.listen(PORT, ()=>{
	console.log(`connection established on port ${PORT}`)
});