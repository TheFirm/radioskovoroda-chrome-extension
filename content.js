
document.addEventListener('DOMContentLoaded', bootstrapPopup);

function bootstrapPopup(){

    var btn          = document.getElementById('btn'),
        onAirClass   = 'on-air',
        loopInterval = 15000,
        messages     = {
            triggerRadio: {
                msg: 'trigger-radio'
            },
            getTrackData: {
                msg: 'get-track-data'
            }
        };

    if(isOn()) {
        btn.classList.add(onAirClass); 
    }

    btn.addEventListener('click', clickHandler);
    chrome.runtime.onMessage.addListener(messageListener);

    startTrackDataLoop(loopInterval);


    function messageListener(request, sender, sendResponse){
        switch (request.msg){
            case 'current-track':
                updateTrack(request.track);
                break;
        }
    }

    function clickHandler(){
        if(isOn()){
            btn.classList.remove(onAirClass);
        } else {
            btn.classList.add(onAirClass);
        }
        chrome.extension.sendMessage(messages.triggerRadio);
    }


    function startTrackDataLoop(interval){
        fetchTrackData();
        setInterval(function(){
            fetchTrackData();
        }, interval);
    }


    function fetchTrackData(){
        chrome.extension.sendMessage(messages.getTrackData);
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
            updateSocSearch(track);
        }
    }


    function updateSocSearch(track){
        var socLinks      = $('div.soc-search'),
            searchQueries = buildQueries(track);
        for(var service in searchQueries){
           socLinks.find('a.socicon-' + service).attr('href', searchQueries[service]);
        }
    }


    function buildQueries(track){
        var protocol = "http://",
            queries  = {
                vkontakte  : "",
                youtube    : "",
                soundcloud : "",
                deezer     : ""
            };

        for (var service in queries) {
            var q = "";
            switch(service){
                case "vkontakte" :
                    q = '/search?c%5Bq%5D=' + track + '&c%5Bsection%5D=audio';
                    queries.vkontakte = createQuery(protocol, 'vk.com', q);
                    break;
                case "youtube"   :
                    q = '/results?search_query=' + track;
                    queries.youtube = createQuery(protocol, 'youtube.com', q);
                    break;
                case "soundcloud":
                    q = '/search?q=' + track;
                    queries.soundcloud = createQuery(protocol, 'soundcloud.com',q);
                    break;
                case "deezer"    :
                    q = '/search/' + track;
                    queries.deezer = createQuery(protocol, 'deezer.com',q);
                    break;
            }
        }

        function createQuery(protocol, domen, query){
            return protocol + domen + query;
        }

        return queries;
    }


    function hideTrackHolder(){
        return $('div.track-items').hide();
    }

}
