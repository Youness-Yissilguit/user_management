
// Import required modules
const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const port = 5050;
const bodyParser = require('body-parser')
// Create connection to MySQL
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "users_management"
});

//start the Express app
const app = express();

//body parser: 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//static folder
app.use('/public', express.static('./public'));

//connect to the database
connection.connect(error => {
  if (error) throw error;
  console.log('MySQL connected...');
});

// starting the server
app.listen(port, () => {
    console.log(`Server started on port ${port}...`);
});

// set the view engine to ejs
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
    res.render('index');
});

// Create user
app.post('/userform', (req, res) => {
  const { firstName, lastName, cin, address, about } = req.body;
  const sql = `INSERT INTO users (first_name, last_name, cin, address, about) VALUES ('${firstName}', '${lastName}', '${cin}', '${address}', '${about}')`;
  connection.query(sql, (error, result) => {
    if (error) throw error;
    res.redirect('/users')
  });
});
app.get('/userform', (req, res) => {
    res.render("userform");
});

// Get all users
app.get('/users', (req, res) => {
  const sql = 'SELECT * FROM users';
  connection.query(sql, (error, result) => {
    if (error) throw error;
    res.render('users', {users: result});
  });
});

// Get user by ID
app.get('/users/:id', (req, res) => {
  const { id } = req.params;
  const sql = `SELECT * FROM users WHERE id = ${id}`;
  connection.query(sql, (error, result) => {
    if (error) throw error;
    res.render('user', {user: result[0]});
    return  false;
  });
});


// Update user
app.post('/userform/:id', (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, cin, address, about } = req.body;
  const sql = `UPDATE users SET first_name = '${firstName}', last_name = '${lastName}', cin = '${cin}', address = '${address.replace(/'/g, "''")}', about = '${about.replace(/'/g, "''")}' WHERE id = ${id}`;
  connection.query(sql, (error, result) => {
    if (error) throw error;
    res.redirect('/users/' + id)
  });
});
app.get('/userform/:id', (req, res) => {
    const { id } = req.params;
    const sql = `SELECT * FROM users WHERE id = ${id}`;
    connection.query(sql, (error, result) => {
      if (error) throw error;
      res.render('userform', {user: result[0]});
      return  false;
    });
});

// Delete user
app.post('/users/:id', (req, res) => {
  const { id } = req.params;
  const sql = `DELETE FROM users WHERE id = ${id}`;
  connection.query(sql, (error, result) => {
    if (error) throw error;
    res.redirect('/users')
  });
});



