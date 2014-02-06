var username;
var user_links;

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        while (user_links == undefined) {
            user_links = document.getElementById('user-links');
        }

        username = user_links.firstElementChild.firstElementChild.textContent;
        username = username.trim();

        if (username != null) {
            sendResponse({"username": username });
        }
    }
);