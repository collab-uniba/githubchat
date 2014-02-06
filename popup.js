var chat_input = document.getElementById('chat-input');

bgpage = chrome.extension.getBackgroundPage();

if (bgpage == null) {
    console.error("bgpage non presente!!!");
    alert("Impossibile proseguire.");
}

if (bgpage.opened) {
    console.log("Sto per invocare recupera!");
    bgpage.ristampaMessaggi();
    chat_input.disabled = false;
} else {
    chat_input.disabled = true;
}

chat_input.onkeypress = function (e) {
    if (e.keyCode !== 13 || !this.value) return;

    bgpage.channel.send(this.value);
    bgpage.printNewMessage(this.value, 'Me');
    this.value = '';
    this.focus();
};