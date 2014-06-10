

var username;
var avatar;
var user_links;
//questo script aggiunge il listener che, alla ricezione di un messaggio scandisce l'albero degli elementi ed individua l'username
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        while (user_links == undefined) {
            user_links = document.getElementById('user-links');
        }

        username = user_links.firstElementChild.firstElementChild.textContent;
        username = username.trim();
        avatar = user_links.firstElementChild.firstElementChild.firstElementChild.getAttribute("src");
        avatar=avatar.match(/https:\/\/avatars\d.githubusercontent.com\/u\/([^\/\s\t\v\n\r\0]+)\?s=140/i);

        if (username != null) {
            //console.write("L'USERNAME è ::" + username);
            sendResponse({"username": username , "avatar": avatar[1]});
        }
    }
);