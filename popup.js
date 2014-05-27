var chat_input = document.getElementById('chat-input');
var chat_output_table = document.getElementById('chat-output-table');
var online=document.getElementById('online-button');
//var exit=document.getElementById('exit-button');
bgpage = chrome.extension.getBackgroundPage();

online.onclick=function(){
    console.info("Recupero gli utenti online");
    var msg="Utenti connessi:"+'<br><tr>'
    msg+='<tr><td>'+bgpage.showuser(bgpage.username)+'</td><td>'+bgpage.showavatar(bgpage.avatar)+'</td></tr>';
    if (bgpage.channel)
    for(var userid in bgpage.channel.channels){
         var aux=userid.toString().split("!@!");
        msg+='<tr><td>'+bgpage.showuser(aux[0])+'</td><td>'+bgpage.showavatar(aux[1])+'</td></tr>';
    }
    chat_output_table.innerHTML= msg;
    bgpage.chatusing=false;
};
//exit.onclick=function(){bgpage.leave();};


if (bgpage == null) {
    console.error("bgpage non presente!!!");
    alert("Impossibile proseguire.");
}

if (bgpage.opened) {
    console.log("Sto per invocare recupera!");
    bgpage.chatusing=true;
    bgpage.ristampaMessaggi();
    bgpage.newmessage=false;
    chat_input.disabled = false;
} else {
    chat_output_table.innerHTML = chat_output_table.innerHTML + "Nessun altro utente nella stanza";
    bgpage.chatusing=false;
}

chat_input.onkeypress = function (e) {
    var  msg = this.value;
    if (e.keyCode !== 13 || !this.value) return;
        //if(msg !="")
         //   bgpage.channel.send(bgpage.CODESCRITTURA);
      //  else
      //      bgpage.channel.send(bgpage.CODENONSCRITTURA);
   // }else{

        bgpage.channel.send(msg);
        bgpage.printNewMessage(msg, 'Me', bgpage.avatar,bgpage.getTime());
        this.value = '';
        this.focus();

};

chat_input.onkeyup = function (e) {
    var  msg = this.value;
    if(msg !="")
        bgpage.channel.send(bgpage.CODESCRITTURA);
    else
        bgpage.channel.send(bgpage.CODENONSCRITTURA);

};

