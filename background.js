var isOn = false;

chrome.runtime.onMessage.addListener(function(msg, sender){
    console.log(msg, sender);
    var stream     = document.getElementById('radio-skovoroda'),
        onAirClass = 'on-air',
        onAir      = stream.classList.contains(onAirClass);

    if(onAir){
        isOn = false;
        stream.classList.remove(onAirClass);
        return stream.pause();
     }
    isOn = true;
    stream.classList.add(onAirClass);
    return stream.play();
});
