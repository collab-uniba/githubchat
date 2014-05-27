/**
 *
 *  Secure Hash Algorithm (SHA256)
 *  http://www.webtoolkit.info/
 *
 *  Original code by Angel Marin, Paul Johnston.
 *
 **/
function SHA256(s) {

    var chrsz = 8;
    var hexcase = 0;

    function safe_add(x, y) {
        var lsw = (x & 0xFFFF) + (y & 0xFFFF);
        var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return (msw << 16) | (lsw & 0xFFFF);
    }

    function S(X, n) {
        return ( X >>> n ) | (X << (32 - n));
    }

    function R(X, n) {
        return ( X >>> n );
    }

    function Ch(x, y, z) {
        return ((x & y) ^ ((~x) & z));
    }

    function Maj(x, y, z) {
        return ((x & y) ^ (x & z) ^ (y & z));
    }

    function Sigma0256(x) {
        return (S(x, 2) ^ S(x, 13) ^ S(x, 22));
    }

    function Sigma1256(x) {
        return (S(x, 6) ^ S(x, 11) ^ S(x, 25));
    }

    function Gamma0256(x) {
        return (S(x, 7) ^ S(x, 18) ^ R(x, 3));
    }

    function Gamma1256(x) {
        return (S(x, 17) ^ S(x, 19) ^ R(x, 10));
    }

    function core_sha256(m, l) {
        var K = new Array(0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5, 0x3956C25B, 0x59F111F1, 0x923F82A4, 0xAB1C5ED5, 0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3, 0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174, 0xE49B69C1, 0xEFBE4786, 0xFC19DC6, 0x240CA1CC, 0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA, 0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7, 0xC6E00BF3, 0xD5A79147, 0x6CA6351, 0x14292967, 0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13, 0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85, 0xA2BFE8A1, 0xA81A664B, 0xC24B8B70, 0xC76C51A3, 0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070, 0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5, 0x391C0CB3, 0x4ED8AA4A, 0x5B9CCA4F, 0x682E6FF3, 0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208, 0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2);
        var HASH = new Array(0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A, 0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19);
        var W = new Array(64);
        var a, b, c, d, e, f, g, h, i, j;
        var T1, T2;

        m[l >> 5] |= 0x80 << (24 - l % 32);
        m[((l + 64 >> 9) << 4) + 15] = l;

        for (var i = 0; i < m.length; i += 16) {
            a = HASH[0];
            b = HASH[1];
            c = HASH[2];
            d = HASH[3];
            e = HASH[4];
            f = HASH[5];
            g = HASH[6];
            h = HASH[7];

            for (var j = 0; j < 64; j++) {
                if (j < 16) W[j] = m[j + i];
                else W[j] = safe_add(safe_add(safe_add(Gamma1256(W[j - 2]), W[j - 7]), Gamma0256(W[j - 15])), W[j - 16]);

                T1 = safe_add(safe_add(safe_add(safe_add(h, Sigma1256(e)), Ch(e, f, g)), K[j]), W[j]);
                T2 = safe_add(Sigma0256(a), Maj(a, b, c));

                h = g;
                g = f;
                f = e;
                e = safe_add(d, T1);
                d = c;
                c = b;
                b = a;
                a = safe_add(T1, T2);
            }

            HASH[0] = safe_add(a, HASH[0]);
            HASH[1] = safe_add(b, HASH[1]);
            HASH[2] = safe_add(c, HASH[2]);
            HASH[3] = safe_add(d, HASH[3]);
            HASH[4] = safe_add(e, HASH[4]);
            HASH[5] = safe_add(f, HASH[5]);
            HASH[6] = safe_add(g, HASH[6]);
            HASH[7] = safe_add(h, HASH[7]);
        }
        return HASH;
    }

    function str2binb(str) {
        var bin = Array();
        var mask = (1 << chrsz) - 1;
        for (var i = 0; i < str.length * chrsz; i += chrsz) {
            bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (24 - i % 32);
        }
        return bin;
    }

    function Utf8Encode(string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";

        for (var n = 0; n < string.length; n++) {

            var c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }

        return utftext;
    }

    function binb2hex(binarray) {
        var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
        var str = "";
        for (var i = 0; i < binarray.length * 4; i++) {
            str += hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8 + 4)) & 0xF) +
                hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8  )) & 0xF);
        }
        return str;
    }

    s = Utf8Encode(s);
    return binb2hex(core_sha256(str2binb(s), s.length * chrsz));

}
var messages = new Array();
var senders = new Array();
var avatars= new Array();
var fired = false;
var firedTabId = null;
var nomeCanale = null;
var channel = null;
var avatar =null;
var username = null;
var opened = false;
var newmessage;
var chatusing=true;

var inotification;

function appendROW(data, userid,avatar) {
    var views = chrome.extension.getViews({type: "popup"});
    if (views.length > 0 && chatusing) {

// si stà visualizzando il popup come chat

        newmessage=false;
        var popup = views[0];
        var chat_output_table = popup.document.getElementById('chat-output-table');
        var chat_output = popup.document.getElementById('chat-output');

        if (chat_output_table) {
            //compongo il messaggio
            var msg ='<tr>';
            msg += '<td>';
            msg += showuser(userid);
            msg += '<br>';
            msg += showavatar(avatar);
            msg +=     '</td>';
            msg += '<td class="data">' + data +'</td>';
            msg +=    '</tr>';

            //chat_output_table.appendChild( popup.document.createTextNode(msg));
            chat_output_table.innerHTML = chat_output_table.innerHTML + msg;
            chat_output.scrollTop = chat_output.scrollHeight;
        }
    }
}
//restituisce una stringa html con la formattazione per mostrare l'username e l'avatar
function showuser(userid){
    userid = userid || "&nbsp";
    return '<class="user">' + userid ;
}
function showavatar(avatar){
    if (avatar)
        return '<img class="avatar" height="60" width="60" src=' +"https://avatars.githubusercontent.com/u/"+avatar+"?s=60" + '>';
    else return "";
}



function appendLINE() {
    var views = chrome.extension.getViews({type: "popup"});
    if (views.length > 0) {
        var popup = views[0];
        var chat_output_table = popup.document.getElementById('chat-output-table');
        if (chat_output_table) {
            var msg = '<tr><td colspan="2" class="line"><hr/></td></tr>';
            chat_output_table.innerHTML = chat_output_table.innerHTML + msg;
            chat_output_table.scrollTop = chat_output_table.scrollHeight;

           /* //salvo messaggio in locale
            var storage= chrome.storage.local;
           storage.set({'value':msg}, function() {
                // Notify that we saved.
                message('Settings saved');
            });
            */
        }
    }
}




function printNewMessage(data, userid, avatar, timestamp) {
    newmessage=true;
if(timestamp) data="<p>"+data+"<h6>"+timestamp+"</h6></p>";
    if (senders.length == 0) {
        appendROW(data, userid,avatar);
    } else if (senders.length > 0)
        if (userid == senders[senders.length - 1]) {
            appendROW(data);
        } else {
            appendLINE();
            appendROW(data, userid, avatar);
        }
    messages.push(data);
    senders.push(userid);
    avatars.push(avatar);
}

function printOldMessage(i) {
    if ((i < 0) || ( i > messages.length - 1)) {
        alert("Errore di indice");
        return;
    }

    if (i == 0)
        appendROW(messages[i], senders[i], avatars[i]);
    else {
        if (senders[i] == senders[i - 1])
            appendROW(messages[i]);
        else {
            appendLINE();
            appendROW(messages[i], senders[i], avatars[i]);
        }
    }
}

function ristampaMessaggi() {
    for (var i = 0; i < messages.length; i++) {
        printOldMessage(i);
    }
}



chrome.tabs.onUpdated.addListener(checkForValidUrl);
chrome.tabs.onRemoved.addListener(resetBackground);

function resetBackground(tabId, removeInfo) {
    if (fired) {
        if (tabId == firedTabId) {
//            alert("Logout a causa della chiusura della pagina.");
            firedTabId = null;
            fired = false;
            if (opened){
                channel.leave();
                opened=false;
            }
            channel = null;
            nomeCanale = null;
            username = null;
            avatar =null;
            messages = new Array();
            senders = new Array();
            avatars= new Array();


        }
    }
}


function checkForValidUrl(tabId, changeInfo, tab) {

    if (changeInfo.status= "complete"){
    var matched = tab.url.match(/github.com\/([^\/\s\t\v\n\r\0]+)\/([^\/\s\t\v\n\r\0]+)/i);
        //se sono in una pagina di chat visualizzo il popup
    if (matched != null){
        chrome.pageAction.show(tabId);
       // if(matched[1]!=userOwner || matched[2]!= project && fired)
          //  resetBackground(firedTabId);
    }
    if ((matched != null) && (!fired)) {

        fired = true;
        firedTabId = tabId;

        setTimeout(function () {
            chrome.tabs.sendMessage(tabId, {greeting: "hello"}, function (response) {
                username = response.username;
                avatar= response.avatar;
            })
        }, 1500);

        setTimeout(function () {
            if (username != null) {
                console.info("Username loggato: " + username);
                var  userOwner = matched[1];
                var project = matched[2];
                nomeCanale = SHA256(userOwner + "__" + project);

             // chrome.pageAction.show(tabId);

                avvia();
            } else {
                alert("Errore. Nessun login. Provare a riaggiornare la pagina");
                fired=false;
            }
        }, 3000);

//Icona lampeggiante
        inotification=0;
        window.setInterval(function() {
            if (fired){
                inotification++;
                inotification=inotification%2;
                if(newmessage){
                    if(inotification==0)
                        chrome.pageAction.setIcon({path: "images/logo16N.png",tabId:firedTabId});
                    else
                        chrome.pageAction.setIcon({path: "images/logo16.png", tabId:firedTabId});
                }
                else{
                    chrome.pageAction.setIcon({path: "images/logo16.png",tabId:firedTabId});
                }
            }
        }, 500);


    }
    }
}

function getTime(currentdate){
    var tipologia;
    if (currentdate){
        currentdate= new Date(currentdate);
        tipologia="Ricevuto alle "
    }else{
        currentdate= new Date();
        tipologia="Inviato alle "
    }
    var datetime = "["+
        //tipologia
        + currentdate.getHours() + ":"
        + currentdate.getMinutes()
        //+ ":"+ currentdate.getSeconds()
       // +" il "
        //+ currentdate.getDate() + "/"
      //  + (currentdate.getMonth()+1)  + "/"
       // + currentdate.getFullYear()
        +"]";
    return datetime;
}

function avvia() {

    channel = new DataChannel(nomeCanale);
    //console.debug(channel).

    //utilizzo un simbolo !@! per separare username e avatar
   channel.userid = username+"!@!"+avatar;


    channel.onmessage = function (data, userid,latency) {
        console.debug(userid, 'posted', data);

        userid= userid.toString().split("!@!");
        var sendingTime  = new Date() - latency;

        //console.log('sendingtime:', getTime(sendingTime));

        printNewMessage(data, userid[0], userid[1],getTime(sendingTime));


    };
    channel.onopen = function () {
        opened = true;
        channel.send("&Egrave; connesso");
        var views = chrome.extension.getViews({type: "popup"});
        if (views.length > 0) {
            var popup = views[0];
            var chat_input = popup.document.getElementById('chat-input');

            if (chat_input) {
                chat_input.disabled = false;
            }
        }
    };

    /* users presence detection */
    channel.onleave = function (userid) {
        userid= userid.toString().split("!@!");
        printNewMessage("&Egrave; uscito", userid[0], userid[1],getTime());
        console.warn(userid + ' left!');
    };

    channel.onclose = function () {
       console.warn('canale chiuso');

    };

// channel.leave( userid ); --- eject a user
// channel.leave(); --- leave the room yourself!
}