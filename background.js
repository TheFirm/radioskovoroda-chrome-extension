var isOn     = false,
    callData = {
        type  : 'GET',
        url   : 'http://195.248.234.62:8000/json.xsl',
        async : true
    },
    stream = {
        title: "RadioSkovoroda",
        mp3: "http://195.248.234.62:8000/radioskovoroda"
    },
    ready = false;

setPlayIcon();
chrome.runtime.onMessage.addListener(messageListener);
jQuery(document).ready(domInit);
chrome.browserAction.onClicked.addListener(function() {
    enableRadio();
});

function domInit(){
    jQuery("body").jPlayer({
        ready: function (event) {
            ready = true;
        },
        pause: function() {
            jQuery(this).jPlayer("clearMedia");
        },
        error: function(event) {
            if(ready && event.jPlayer.error.type === jQuery.jPlayer.error.URL_NOT_SET) {
                jQuery(this).jPlayer("setMedia", stream).jPlayer("play");
            }
        },
        supplied: "mp3",
        solution: "html",
        preload: "none",
        wmode: "window",
        keyEnabled: true
    });
}

function messageListener(request, sender, sendResponse){
    switch (request.msg){
        case 'trigger-radio':
            triggerRadio();
            break;
        case 'get-track-data':
            fetchTrackData(callData, sendResponse);
            break;
    }
}

function triggerRadio(){

    if(!isOn){
        enableRadio();
    } else {
        disableRadio();
    }
}


function enableRadio(){
    setPauseIcon();
    addPopup();
    jQuery("body").jPlayer("play");
    isOn = !isOn;
}


function disableRadio(){
    setPlayIcon();
    removePopup();
    jQuery("body").jPlayer("clearMedia");
    isOn = !isOn;
}

function addPopup(){
    chrome.browserAction.setPopup({
        popup: 'popup.html'
    });

}

function removePopup(){
    chrome.browserAction.setPopup({
        popup: ''
    });
}


function setPauseIcon(){
    chrome.browserAction.setIcon({
        path: './pause-brws.png'
    });
}


function setPlayIcon(){
    chrome.browserAction.setIcon({
        path: './play-brws.png'
    });
}


function fetchTrackData(callData, callback){

    function trackDataCallback(data, status){
        if(status !== "success") {
            return badFetch();
        } else{
            var message = {
                msg   : 'current-track',
                track : parseResp(data)["title"]
            };
            chrome.extension.sendMessage(message);
        }
    }

    function badFetch(){
        chrome.extension.sendMessage({msg: 'current-track', track: ""});
    }

    return $.ajax(callData).done(trackDataCallback);
}

function parseResp(str){
    return JSON.parse(str.split('parseMusic(')[1].split(');')[0])['/radioskovoroda'];
}
