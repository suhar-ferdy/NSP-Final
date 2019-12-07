const socket = io("http://localhost:3000");
const messageContainer = document.getElementById("message-container");
const messageForm = document.getElementById("send-container");
const messageInput = document.getElementById("message-input");
const memberContainer = document.getElementById("member-container");

//prompt -> pop out message and return value
var name = prompt("What is your name?");
//prompt will keep pop out if user don't input name
while (name == "") {
  name = prompt("What is your name?");
}
//if user already input name then update the UI
appendMessage("You joined", "user");
appendMember(name);

//send request server.js to broadcast new user has join the group
socket.emit("new-user", name);

//update UI client
//if another user send new message
socket.on("chat-message", data => {
  appendMessage(`${data.name} : ${data.message}`, "message");
});

//update UI client
//if another user has join the group
socket.on("user-connected", name => {
  appendMessage(`${name} connected`, "user");
});

//update UI client
//if another user has leave the group
socket.on("user-disconnected", name => {
  appendMessage(`${name} disconnected`, "user");
});

//button event listener
messageForm.addEventListener("submit", e => {
  //prevent page refresh every new message
  e.preventDefault();
  const message = messageInput.value;
  appendMessage(`You : ${message}`, "message");
  socket.emit("send-chat-message", message);
  messageInput.value = "";
});

//display message
function appendMessage(message, category) {
  const messageElement = document.createElement("div");
  if (category == "message") {
    messageElement.innerText = message;
    messageContainer.append(messageElement);
  } else if (category == "user") {
    messageElement.style.textAlign = "center";
    messageElement.innerText = message;
    messageContainer.append(messageElement);
  }
}
//display current user
function appendMember(message) {
  const messageElement = document.createElement("div");
  messageElement.style.textAlign = "center";
  messageElement.style.color = "green";
  messageElement.innerText = "User : " + message;
  memberContainer.append(messageElement);
}
