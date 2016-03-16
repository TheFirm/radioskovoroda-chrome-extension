document.addEventListener('DOMContentLoaded', function(){

    var btn         = document.getElementById('btn'),
        onAirClass  = 'on-air',
        loopInterval = 15000;

    if(isOn()) {
        btn.classList.add(onAirClass); 
    }

    btn.addEventListener('click', clickHandler);
    startTrackDataLoop(loopInterval);

    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
        switch (request.msg){
            case 'current-track':
                updateTrack(request.track);
                break;
        }
    });


    function clickHandler(){
        if(isOn()){
            btn.classList.remove(onAirClass);
        } else {
            btn.classList.add(onAirClass);
        }
        chrome.extension.sendMessage({msg: 'trigger-radio'});
    }


    function startTrackDataLoop(interval){
        fetchTrackData();
        setInterval(function(){
            fetchTrackData();
        }, interval);
    }


    function fetchTrackData(){
        chrome.extension.sendMessage({msg: 'get-track-data'});
    }


    function isOn(){
        return chrome.extension.getBackgroundPage().isOn;
    }


    function updateTrack(track){
        track = track || '';
        if(!track) {
            return hideTrackHolder();
        } else {
            $('div.track').show().find('#track-title').html(track);
        }
    }


    function hideTrackHolder(){
        return $('div.track').hide();
    }

});

