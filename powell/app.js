// Import path to construct path file names
const path = require('path');

// Import npm libraries
const express = require("express");
const ejs = require("ejs");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require('mongoose')
const session = require('express-session'); // import express-session
const MongoDBStore = require('connect-mongodb-session')(session);
const flash = require('connect-flash');
const fileUpload = require('express-fileupload');




const homeRoutes = require("./routes/homeRoutes");
const stylesRoutes = require("./routes/stylesRoutes");
const blogRoutes = require("./routes/blogRoutes");
const contactRoutes = require("./routes/contactRoutes");
const authRoutes = require("./routes/auth-routes");
const apiRoutes = require("./routes/apiRoutes");
const weatherRoutes = require('./routes/weatherRoutes');




const middleware = require("./middleware");

const MONGODB_URI = 'mongodb+srv://a02303144:Realsaltlake_2005@weather.y7vpqbr.mongodb.net/?retryWrites=true&w=majority';



const app = express();
app.use(fileUpload());


const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});

// Load middleware to point to static resources
app.use(express.static(path.join(__dirname, 'public')));

// Load middleware to parse body
app.use(express.urlencoded({ extended: false }));



// Set the templating engine using app.set
app.set("view engine", "ejs");

// Tell the application where to find the views
app.set("views", "views");


app.use(middleware);

app.use(express.json());



app.use(
    session({
      secret: 'my secret',
      resave: false,
      saveUninitialized: false,
      store: store
    })
  );

  // Load the connect flash middleware
  app.use(flash());


app.use(expressLayouts);

app.use((req, res, next) => {
    res.locals.currentUser = req.session.user
    res.locals.isAuthenticated = req.session.isLoggedIn;
    next();
  });


//define route handlers


app.use("/styles", stylesRoutes);
app.use("/blog", blogRoutes);
app.use("/contacts", contactRoutes);
app.use("/auth", authRoutes);
app.use("/api", apiRoutes);
app.use("/weather", weatherRoutes);



app.use(homeRoutes);



//app.use(errorController.generalError);

mongoose.connect(MONGODB_URI).then(() => {
  app.listen(3000);
});

