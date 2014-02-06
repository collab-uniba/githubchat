var connected = false;
var listening = false;
var fired = false;
var messages = new Array();
var senders = new Array();
var nomeCanale = null;
var channel = null;
var username = null;

chrome.tabs.onUpdated.addListener(checkForValidUrl);

function checkForValidUrl(tabId, changeInfo, tab) {
    var matched = tab.url.match(/github.com\/([^\/\s\t\v\n\r\0]+)\/([^\/\s\t\v\n\r\0]+)/i);

    if ((fired) || (matched == null)) {
        return;
    } else {
        fired = true;

        setTimeout(function () {
            chrome.tabs.sendMessage(tabId, {greeting: "hello"}, function (response) {
                username = response.username;
            })
        }, 1500);

        setTimeout(function () {
            if (username != null) {
                console.info("Username loggato: " + username);
                var userOwner = matched[1];
                var project = matched[2];
                nomeCanale = userOwner + "__" + project;
                nomeCanale = nomeCanale.substring(0, 20);

                chrome.pageAction.show(tabId);
                if (!listening) {
                    avvia();
                }
            } else {
                alert("Errore. Nessun login.");
            }
        }, 3000);
    }
}

function getMessages() {
    return messages;
}

function getSenders() {
    return senders;
}

function isConnected() {
    return connected;
}


function avvia() {
    listening = true;
    console.info("Sto per creare il canale " + nomeCanale);

    window.userid = username;
    channel = new DataChannel(nomeCanale, {userid: username});
    channel.userid = username;
    window.userid = username;


    channel.onopen = function (userid) {
        console.log("Mi chiamo " + userid + " e mi sono connesso. userid = " + userid)
//        alert("Canale aperto");
//        if (window.webkitNotifications) {
//            var notification = webkitNotifications.createHTMLNotification('notification.html');
//            notification.show();
//            setTimeout(function () {
//                notification.cancel();
//            }, '7000');
//        }
        connected = true;
        newMessage(' joined.', userid);
    };

    channel.onmessage = function (message, sender) {
        var split = message.split(':::');
        console.log(split[0] + ' posted ' + split[1]);
//        salvaEPubblicaNuovoMessaggio(message, sender);
        salvaEPubblicaNuovoMessaggio(split[1], split[0]);
    };

    channel.onleave = function (userid) {
//        alert("Leave");
        newMessage(' left.', userid);
    };

    //printNewMessage(' joined.', userid);
}

function chiudi() {
    salvaEPubblicaNuovoMessaggio("Bye.", userid);
    channel.leave();
    connected = false;
    listening = false;
    fired = false;
    messages = new Array();
    senders = new Array();
    nomeCanale = null;
    channel = null;
    username = null;

    chrome.tabs.onUpdated.addListener(checkForValidUrl);
}

function newMessage(message, userid) {
    channel.send(userid + ":::" + message);
    salvaEPubblicaNuovoMessaggio(message, userid);
}


function salvaEPubblicaNuovoMessaggio(message, sender) {
    messages.push(message);
    senders.push(sender);

    var views = chrome.extension.getViews({type: "popup"});

    if (views.length > 0) {
        var popup = views[0];
        var docPopup = popup.document;
        var chatOutput = docPopup.getElementById('chat-output');
//        var inputText = docPopup.getElementById('inputText');

        if (chatOutput) {
            chatOutput.innerHTML = chatOutput.innerHTML + '<hr/><p>' + sender + ': ' + message + '</p>';
            chatOutput.scrollTop = chatOutput.scrollHeight;
        }
    }
}