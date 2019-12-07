const io = require("socket.io")(3000);

const users = {};

io.on("connection", socket => {
  //if got request from client
  socket.on("new-user", name => {
    users[socket.id] = name;
    //send reply to client
    socket.broadcast.emit("user-connected", name);
  });
  //if got request from client
  socket.on("send-chat-message", message => {
    //send reply to client
    socket.broadcast.emit("chat-message", {
      message: message,
      name: users[socket.id]
    });
  });

  //if got request from client
  socket.on("disconnect", () => {
    //send reply to client
    socket.broadcast.emit("user-disconnected", users[socket.id]);
    delete users[socket.id];
  });
});

const express = require("express");
const app = express();
const port = 3004;
const path = require("path");
const bodyParser = require("body-parser");

var firebase = require("firebase");
var firebaseConfig = {
  apiKey: "AIzaSyCdTezNtrBu3KxMhFL4GADsNjKs1Hmq51M",
  authDomain: "nsp-final.firebaseapp.com",
  databaseURL: "https://nsp-final.firebaseio.com",
  projectId: "nsp-final",
  storageBucket: "nsp-final.appspot.com",
  messagingSenderId: "411298478967",
  appId: "1:411298478967:web:6f2039830adc8109c9bf72",
  measurementId: "G-CMYV9B3BX1"
};

firebase.initializeApp(firebaseConfig);

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/modal.html"));
  //__dirname : It will resolve to your project folder.
});
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname + "/login.html"));
  //__dirname : It will resolve to your project folder.
});

app.post("/register", (req, res) => {
  const { password, email, username } = req.body;

  var referencePath = "/Users/" + username + "/";
  var userReference = firebase.database().ref(referencePath);
  userReference.set({ email, password, username }, error => {
    if (error) {
      res.send("Data could not be updated." + error);
    } else {
      res.sendFile(path.join(__dirname + "/login.html"));
    }
  });
});

app.post("/login", (req, res) => {
  const { password, username } = req.body;

  var userReference = firebase.database().ref("/Users/" + username + "/");

  userReference.on(
    "value",
    function(snapshot) {
      res.json(snapshot.val());
      userReference.off("value");
      if (snapshot.val()) {
        const { passwordF } = snapshot.val();
        if (passwordF === password) {
          console.log(";asd");
          return res.send("Succesfully login as " + username);
        } else {
          return res.send("Password Incorrect");
        }
      } else {
        console.log(";asd2");
        return res.send("user not registered");
      }
    },
    function(errorObject) {
      res.send("The read failed: " + errorObject.code);
    }
  );
});

app.listen(port, () => {
  console.log(`CORS-enabled web server listening on port ${port}`);
});
