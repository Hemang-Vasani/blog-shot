//IMPORT ALL DEPENDENCIES
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { argv, nextTick } = require("process");
const path = require('path')
const bodyParser = require("body-parser");
const moment = require("moment");
const schedule = require("node-schedule");
const cookieParser = require("cookie-parser")
const cors = require("cors")
// const expSession = require("express-session")
const session = require('express-session');

//DOTENV CONFIGURATION
dotenv.config();

// view engine setup
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.static(path.join(__dirname + '/public')));


//DEFINE BODY-PARSER AS JSON
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(cors())
app.use(bodyParser.urlencoded({ urlextended: false }));
app.use(bodyParser.json());

app.use(session({
    key: 'adminUser',
    secret: process.env.ADMIN_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 21600000 
    }
}));




//IMPORT ROUTES
const fs = require('fs');
const routes = require("./routes/main.route");


app.use("/", routes);


//CONNECTION WITH DATABASE
try {
    let db_path = process.env.db_url;
    if (!db_path) throw new Error();
    connectDB(db_path);
} catch (error) {
    console.log("Path undefined!." + error.message);
}

function connectDB(db_path) {
    mongoose.connect(db_path, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        ignoreUndefined: true
    });
    var db = mongoose.connection;

    db.on("error", console.error.bind(console, "error occur in connectdb"));
    db.once("open", function callback() {
        console.log("connected with database successfully.");
    });
}

//CONNECTION WITH SERVER
try {
    let port = argv[2] || process.env.port;
    if (!port) throw new Error();
    connectServer(port);
} catch (error) {
    console.log("port undefined!." + error.message);
}

function connectServer(port) {
    app.listen(port, () => {
        console.log("server started at : " + port);
    });
}
var numClients = 0;


