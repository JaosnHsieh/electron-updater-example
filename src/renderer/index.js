

// Listen for messages
const {ipcRenderer} = require('electron');
ipcRenderer.on('message', function(event, text) {
  var container = document.getElementById('app');
  var message = document.createElement('div');
  message.innerHTML = text;
  container.appendChild(message);
})