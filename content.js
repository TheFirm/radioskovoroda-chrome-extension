document.addEventListener('DOMContentLoaded', function(){

    var btn        = document.getElementById('btn'),
        isOn       = chrome.extension.getBackgroundPage().isOn,
        onAirClass = 'on-air';

    if(isOn){
        btn.classList.add(onAirClass);
    }

    function clickHandler(){
        var btnClasses = btn.classList,
            onAir      = btnClasses.contains(onAirClass);
        onAir ? btnClasses.remove(onAirClass) : btnClasses.add(onAirClass)
        chrome.extension.sendMessage('test');
    }
    
    btn.addEventListener('click', clickHandler);

});
