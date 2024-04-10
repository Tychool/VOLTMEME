//installed dependencies init
const express = require("express");
const app = express();
const bcrypt = require("bcrypt");

//database pool
const {
    createPool
} = require("mysql");

const pool = createPool({
    host: "localhost",
    user: "Admin",
    password: "Gabbyessentials",
    database: "volt_meme",
    connectionLimit: 10
});
//end of pool
//DB init

//end of db init

//posts
app.use(express.urlencoded({extended: false}));

//signup request
app.post("/signup", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    // Insert user data into the database
    pool.query('INSERT INTO users (id, fullname, email, password) VALUES (?, ?, ?, ?)',
      [Date.now().toString(), req.body.fullname, req.body.email, hashedPassword], (error, results) => {
        if (error) {
          console.error('Error inserting user data:', error);
          res.redirect("/signup"); // Redirect to registration page on error
          return;
        }

        // User signed up successfully
        res.redirect("/login"); // Redirect to login page on success
      });
  } catch (e) {
    console.error('Error hashing password:', e);
    res.redirect("/signup"); // Redirect to registration page on error
  }
});
//End signup req
 

 //end test DB

// Your other routes and middleware come here




//routes
app.use(express.static('public')); //Static web route

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
  });


  app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/public/login.html');
  });

  app.get('/signup', (req, res) => {
    res.sendFile(__dirname + '/public/signup.html');
  });

  app.get('/resetpw', (req, res) => {
    res.sendFile(__dirname + '/public/resetpw.html');
  });

  app.get("/dashboard", (req, res) => {
    res.render("/public/dashboard.html");
  });

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
