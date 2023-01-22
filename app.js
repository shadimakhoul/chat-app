const express = require("express");
const bodyparser = require("body-parser");
const connect = require("./connections/databaseConnection");
// const SOCKET_PORT = process.env.SOCKET_PORT || 5000;
const SERVER_PORT = process.env.SERVER_PORT || 3000; 

const util = require('util');
var cors = require('cors');

const users = require("./controller/users")
const admin = require("./controller/admin")
const realTimeChat = require("./controller/realTimeChat")

var con = connect.con
con.connect((err) => {//connect to database
    if (err){
        console.log("Err Here", err.message);
    }
})

var app = express()
var http = require('http').createServer(app);
var io = require('socket.io')(http, {// create socket IO connection
        cors: {
            origin: "*"
          }
        });

app.use(express.json())
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ extended: true }))
app.use(express.static("public"));
app.use(cors({ origin: '*', credentials: true }))
require('dotenv').config();

const query = util.promisify(con.query).bind(con);//asynchronous queries


// chat real time Section
// const io = require("socket.io")(SOCKET_PORT, {// create socket IO connection
//     cors: {
//         origin: "*"
//     }
// });

realTimeChat(io, query)
users(app, query)
admin(app, query)

http.listen(SERVER_PORT, () => {
    console.log("server is working on port 3000");
})

http.on('error', (err) => {
    console.log(err.message);
});
http.on('listening', () => {
  var addr = http.address();
  console.log(addr);
});

