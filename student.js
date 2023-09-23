

const con = require('./mysql')
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mysql = require("mysql");
const encoder = bodyParser.urlencoded();

app.use("/assets",express.static("assets"));


var router = express.Router();

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "bitshackdatabase",
    port:7000
});


// connect to the database
connection.connect(function(error){
    if (error) throw error
    else console.log("connected to the database successfully!")
});


app.get("/",function(req,res){
    res.sendFile(__dirname + "/login.html");
})
var user = "";

app.post("/",encoder, function(req,res){
    var username = req.body.username;
    var password = req.body.password;
    
    connection.query("select * from loginuser where user_name = ? and user_pass = ?",[username,password],function(error,results,fields){
        if (results.length > 0) {
            user = username;
            res.redirect("/studentss");
        } else {
            res.redirect("/");
        }
        res.end();
    })
})

// when login is success
app.get("/studentss",function(req,res){
    if(user!= ""){
        res.sendFile(__dirname + "/students.html")
    }
    else{
        res.redirect("/");
    }
})

// const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const mysql = require('mysql');
const session = require('express-session');
// const bodyParser = require('body-parser');



// Middleware for parsing JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize Express session
app.use(
  session({
    secret: 'cat', // Change this to a secure random key
    resave: true,
    saveUninitialized: true,
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Create a MySQL database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'bitshackdatabase',
    port: 7000,
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

// Define a Student model
const Student = {
  findStudentByEmail: (email, callback) => {
    const sql = 'SELECT * FROM students  WHERE students.email = ?';
    db.query(sql, [email], (err, results) => {
      if (err) {
        console.error('Error executing MySQL query:', err);
        return callback(err, null);
      }
      if (results.length > 0) {
        return callback(null, results[0]);
      }
      return callback(null, null);
    });
  },
};

// Passport Google OAuth 2.0 authentication strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: '658767425391-l7rlf148vp24rj6q6prvifhgde3r3kk6.apps.googleusercontent.com',
      clientSecret: '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',
      callbackURL: 'http://localhost:7500/auth/google/callback',
    },
    (accessToken, refreshToken, profile, done) => {
      // Use the Gmail ID from the Google authentication to find the student
      Student.findStudentByEmail(profile.emails[0].value, (err, student) => {
        if (err) {
          return done(err);
        }
        if (!student) {
          return done(null, false, { message: 'Student not found.' });
        }
        return done(null, student);
      });
    }
  )
);

app.get(
    '/auth/google',
    passport.authenticate('google', {
      scope: ['https://www.googleapis.com/auth/plus.login', 'email'],
    })
  );
  
  app.get(
    '/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
      // Successful authentication, redirect to the student information page
      res.redirect('/student');
    }
  );
  
  // Route to display student information
  app.get('/student', (req, res) => {
    if (req.isAuthenticated()) {
      // User is authenticated, display student information
      // const student = req.user;
      // res.json(student);
     // res.sendFile(__dirname + '/student.html');
     const student = req.user;
      
     // Render the student.html template and pass student data as JSON
     const studentData = JSON.stringify(student);
     
    
     const htmlTemplate = `
   
    
            <h1 style="text-align: center; color: red;">Student Information</h1>
       
       <div id="student-info" style="margin: 20px; padding: 10px; border: 1px solid #ccc; border-radius: 5px; background-color: #fff;">
       <p><strong> email:</strong> <span id="name">${student.name}</span></p>
           <p><strong>Roll Number:</strong> <span id="rollnumber">${student.rollnumber}</span></p>
           <p><strong>Designation:</strong> <span id="degignation">${student.designation}</span></p>
           <p><strong>department:</strong> <span id="department">${student.department}</span></p>
           <p><strong>gender:</strong> <span id="gender">${student.gender}</span></p>
           <p><strong>batch:</strong> <span id="batch">${student.batch}</span></p>
           <p><strong>Student Class:</strong> <span id="studentClass">${student.studentclass}</span></p>
           <p><strong>Student Id:</strong> <span id="studentID">${student.studentID}</span></p>
           <p><strong>dob:</strong> <span id="dob">${student.dob}</span></p>
           <p><strong> email:</strong> <span id="email">${student.email}</span></p>
           <p><strong>degreelevel:</strong> <span id="degreelevel">${student.degreelevel}</span></p>
        
           <button ><a style="text-decoration: none;" href="http://localhost:7500">Logout</a></button>
           <!-- Add more fields as needed -->
       </div>
     
     `;
  
     res.send(htmlTemplate.replace(`{studentData}`, studentData));
    } else {
      // User is not authenticated, redirect to login
      res.redirect('/auth/google');
    }
  });

// Serialize and deserialize user sessions
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});















app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine','ejs'); // 

console.log('Webloaded successfully')

app.get('/',function(req,res){
    res.sendFile(__dirname + '/login.html')
});

app.post('/studentss ',function(req, res){
    let name = req.body.name;
    let rollnumber = req.body.rollnumber;
    let designation = req.body.designation;
    let department = req.body.department;
    let gender = req.body.gender;
    let batch = req.body.batch;
    let studentclass = req.body.studentclass;
    let studentID = req.body.studentID;
    let dob = req.body.dob;
    let email = req.body.email;
    let degreelevel = req.body.degreelevel;

    if(name === "" || rollnumber==='' || designation==='' || department==='N/A' ||
     gender === 'N/A' || batch === 'N/A' || studentclass === '' || studentID === '' 
     || dob === '' || email === '' || degreelevel === 'N/A') return;

        const sqlquery =  "INSERT INTO students VALUES ?";
        const values = [
            [name,rollnumber,designation,department,gender,batch,studentclass,studentID,dob,email,degreelevel]
        ];
        con.query(sqlquery,[values],function(error,result){
            if(error) console.log('duplicate entry');
            else console.log('data inserted successfully')
        });
});

app.get('/students', (req,res)=>{ //
    const studentQuery = 'SELECT * FROM students INNER JOIN cloudinary ON students.rollnumber = cloudinary.display_name ORDER BY students.rollnumber';
    const attendanceQuery = 'SELECT * FROM attendanceTable ORDER BY rollnumber';

        
        // con.query(sqlquery,(error,result) => {
        //     if(error) console.log(error);
        //     console.log(result);
        //     res.render(__dirname + '/index', {students:result});
        // })

        con.query(studentQuery, (error,studentResult) => {
            if(error) {
                console.log(error);
                return;
            }
            
            con.query(attendanceQuery, (error,attendanceResult) => {
                if(error){
                    console.log(error);
                    return;
                }
                res.render(__dirname + '/index', {
                    students: studentResult,
                    attendanceTable: attendanceResult
                }) 
            })
        })

});


 
app.listen(7500);