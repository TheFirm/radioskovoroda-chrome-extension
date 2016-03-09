var isOn   = false;

chrome.runtime.onMessage.addListener(function(msg, sender){
    var stream = document.getElementById('radio-skovoroda');
    isOn ? stream.pause() : stream.play();
    isOn = !isOn;
});
