var chat_input = document.getElementById('chat-input');
var chat_output_table = document.getElementById('chat-output-table');
var online=document.getElementById('online-button');
var back=document.getElementById('back-chat');

bgpage = chrome.extension.getBackgroundPage();

function checkchat(){
    if (bgpage.opened) {
        chat_output_table.innerHTML="";
        bgpage.chatusing=true;
        bgpage.ristampaMessaggi();
        bgpage.newmessage=false;
        chat_input.disabled = false;
    } else {
        chat_output_table.innerHTML = '<div class="message">'+ chrome.i18n.getMessage("noUsers")+'</div>';
        bgpage.chatusing=false;
    }
}
online.onclick=function(){
    online.style.visibility="hidden";
    back.style.visibility="visible";
    document.getElementById('typing-notification').style.visibility="hidden";
    chat_input.style.visibility="hidden";
    console.info("Getting online users");
    var msg= '<div class="message">'+chrome.i18n.getMessage("connectedUsers")+'</div>';
    msg+='<div class="chat">'+bgpage.showuser(bgpage.username)+bgpage.showavatar(bgpage.avatar)+'</div>';
    if (bgpage.channel)
    for(var userid in bgpage.channel.channels){
         var aux=userid.toString().split("!@!");
        msg+='<div class="chat">'+bgpage.showuser(aux[0])+bgpage.showavatar(aux[1])+'</div>';
    }
    chat_output_table.innerHTML= msg;
    bgpage.chatusing=false;
};

back.onclick=function(){
    console.log("Back to chat!");
    back.style.visibility="hidden";
    online.style.visibility="visible";
    document.getElementById('typing-notification').style.visibility="visible";
    chat_input.style.visibility="visible";
    checkchat();
}

back.style.visibility="hidden";

if (bgpage == null) {
    console.log("Absent backgroundpage");
    alert(chrome.i18n.getMessage("genericError"));
}

checkchat();

chat_input.onkeypress = function (e) {
    var  msg = this.value;
    if (e.keyCode !== 13 || !this.value) return;
        bgpage.channel.send(msg);
        bgpage.printNewMessage(msg, chrome.i18n.getMessage("me"), bgpage.avatar,bgpage.getTime());
        this.value = '';
        this.focus();

};

chat_input.onkeyup = function (e) {
    var  msg = this.value;
    if(msg !=""){
        bgpage.channel.send(bgpage.CODESCRITTURA);}
};

