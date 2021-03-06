const express = require('express');
path = require('path');
bodyParser = require('body-parser');
cors = require('cors');
mongoose = require('mongoose');
var multer = require('multer');
var serveIndex = require('serve-index');

config = require('./DBConfiguration');

const submissionroute = require('./Routes/submission.route');
const metadataroute = require('./Routes/metadatafile.route');
const rawfileroute = require ('./Routes/rawfile.route');
const validationroute = require('./Routes/validation.route');
const searchroute = require('./Routes/search.route');
const downloadroute = require('./Routes/download.route');

//mongodb connection promise
mongoose.Promise = global.Promise;
mongoose.connect(config.DB, { useNewUrlParser: true }).then(
    () => { console.log('Database is connected') },
    err => { console.log('Can not connect to the database' + err) }
);

//express app configuration
const app = express();
//pointing to the submission route
app.use('/downloads', express.static('filepersistance/tempDownloadFiles'), serveIndex('filepersistance/tempDownloadFiles', {'icons': true}))
//app.use(connect.bodyParser());
app.set('json spaces', 40);
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(bodyParser.json());
app.use(cors());
//create a cors middleware
app.use(function (req, res, next) {
    //set headers to allow cross origin request.
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
// routes
app.use('/submissions', submissionroute);
app.use('/metadata', metadataroute);
app.use('/rawfile',rawfileroute);
app.use('/validation',validationroute);
app.use('/search',searchroute);
app.use('/download',downloadroute);
let port = process.env.PORT || 4000;



//Routes
app.get('/', function (req, res) {
    res.send('Testing Routes.')
})

//starting up the server
const server = app.listen(port, function () {
    console.log('NPServer Listening on port ' + port);
});