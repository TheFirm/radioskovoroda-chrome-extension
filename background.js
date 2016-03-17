var isOn     = false,
    callData = {
        type  : 'GET',
        url   : 'http://195.248.234.62:8000/json.xsl',
        async : true
    };

setPlayIcon();
chrome.runtime.onMessage.addListener(messageListener);


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
    var stream = document.getElementById('radio-skovoroda');

    if(!isOn){
        enableRadio(stream);
    } else {
        disableRadio(stream);
    }
}


function enableRadio(radio){
    setPauseIcon();
    radio.play();
    isOn = !isOn;
}


function disableRadio(radio){
    setPlayIcon();
    radio.pause();
    isOn = !isOn;
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


