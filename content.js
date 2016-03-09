document.addEventListener('DOMContentLoaded', function(){

    var btn        = document.getElementById('btn'),
        onAirClass = 'on-air';

    if(isOn()) btn.classList.add(onAirClass);

    btn.addEventListener('click', clickHandler);

    function clickHandler(){
        isOn() ? btn.classList.remove(onAirClass) : btn.classList.add(onAirClass);
        return chrome.extension.sendMessage('btn-clicked');
    }

    function isOn(){
        return chrome.extension.getBackgroundPage().isOn;
    }

});
