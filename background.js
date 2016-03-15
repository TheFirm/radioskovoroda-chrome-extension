var isOn = false;

chrome.runtime.onMessage.addListener(function(msg, sender){
    
    chrome.browserAction.setIcon({
        path: isOn ? './play-brws.png': './pause-brws.png' 
    });

    var stream = document.getElementById('radio-skovoroda');
    isOn ? stream.pause() : stream.play();
    isOn = !isOn;
});
