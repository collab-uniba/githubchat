var chatOutput = document.getElementById('chat-output');
var inputText = document.getElementById('inputText');
var logoutButton = document.getElementById('logout-button');

logoutButton.disabled = true;
inputText.disabled = true;

bgpage = chrome.extension.getBackgroundPage();

logoutButton.onclick = function () {
    bgpage.chiudi();
    logoutButton.disabled = true;
    inputText.disabled = true;
    inputText.value = '';
    chatOutput.innerHTML = '';
    chatOutput.scrollTop = chatOutput.scrollHeight;
}

inputText.onkeypress = function (e) {
    if (e.keyCode != 13) return;
    bgpage.newMessage(this.value, bgpage.channel.userid);
    this.value = '';
};


function recuperaMessaggi() {
    var messages = bgpage.getMessages();
    var senders = bgpage.getSenders();

    for (var i = 0; i < messages.length; i++) {
        chatOutput.innerHTML = chatOutput.innerHTML + '<hr /><p>' + senders[i] + ': ' + messages[i] + '</p>';
        chatOutput.scrollTop = chatOutput.scrollHeight;
    }
    // channel.send(this.value);
}


if (bgpage.isConnected()) {
    recuperaMessaggi();
    inputText.disabled = false;
    logoutButton.disabled = false;
}
