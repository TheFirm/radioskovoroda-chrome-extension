var isOn     = false,
    callData = {
        type  : 'GET',
        url   : 'http://195.248.234.62:8000/json.xsl',
        async : true
    };

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
    chrome.browserAction.setIcon({
        path: './pause-brws.png'
    });

    radio.play();
    isOn = !isOn;
}


function disableRadio(radio){
    chrome.browserAction.setIcon({
        path: './play-brws.png'
    });

    radio.pause();
    isOn = !isOn;
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

    return $.ajax(callData).done(trackDataCallback);
}


function badFetch(){
    chrome.extension.sendMessage({msg: 'current-track', track: ""});
}


function parseResp(str){
    return JSON.parse(str.split('parseMusic(')[1].split(');')[0])['/radioskovoroda'];
}


