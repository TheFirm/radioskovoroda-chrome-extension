var isOn     = false,
    callData = {
    type  : 'GET',
    url   : 'http://195.248.234.62:8000/json.xsl',
    async : true
};

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    switch (request.msg){
        case 'trigger-radio':
            triggerRadio();
            break;
        case 'get-track-data':
            fetchTrackData(callData, sendResponse);
            break;
    }
});

function triggerRadio(){
    var stream = document.getElementById('radio-skovoroda');

    chrome.browserAction.setIcon({
        path: isOn ? './play-brws.png': './pause-brws.png' 
    });
    
    // need to refactor
    isOn ? stream.pause() : stream.play();
    isOn = !isOn;
}

function fetchTrackData(callData, callback){
    return $.ajax(callData).done(function(data, status){
        if(status !== "success") return badFetch();
        chrome.extension.sendMessage({msg: 'current-track', track: parseResp(data)["title"]});
    });
}

function badFetch(){
    chrome.extension.sendMessage({msg: 'current-track', track: ""});
}

function parseResp(str){
    return JSON.parse(str.split('parseMusic(')[1].split(');')[0])['/radioskovoroda'];
}


