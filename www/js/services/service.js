//using Rssfeed from php cors enabled site
var RssSpotlightService = function( url ){
    var data;

    //parse the xml and return js obj
    function parseRSS($xml){
        var items = $($xml).find('item');
        var myArr = []
        //iterate through the rss items
        $(items).each(function () {
            // create a data obj to hold the message
            var myobj = {};
            var $el = $(this);
            myobj.link = $el.find('link').text();
            myobj.title = $el.find('title').text();
            var desc = $el.find('description').text();

            //search the description for the image
            var $desc = $('<div/>').html(desc);
            myobj.thumbnail = $desc.find('img').attr('src');
            myobj.alt = $desc.find('img').attr('alt');
            if(myobj && myobj.link && myobj.title && myobj.thumbnail){
                myArr.push(myobj);
            }else{
                console.warn("ERROR parsing xml content");
            }
            
        });
        return myArr;
    } 

    this.init = function(){
        var deferred = $.Deferred();
        $.ajax({
            type: 'GET',
            url: url,
            success: function(doc) {
              var xml = $(doc).find('rss').html();
              var $xml = $($.parseXML(xml));
              data = parseRSS( $xml );
              deferred.resolve(data);
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) { 
                console.log("Status: " + textStatus); 
                //console.log("Error: " + errorThrown); 
                deferred.reject();
            }   
        });  
        return deferred.promise( data );
    }
}

var RssNotificationService = function( url, NotificationLabels  ){
    var data;
    //parse the xml and return js obj
    var myArr = [];
    function parseRSS($xml){
        var items = $($xml).find('item');
        $(items).each(function () {
            myobj = {};
            var $el = $(this);
            var desc = $el.find('description').text();
            //search the description for the image
            var $desc = $('<div/>').html(desc);
            var divs = $desc.find('div');
            $(divs).each(function(i ,el){
                var $div = $(this);
                if ($div.text() == NotificationLabels.message ){
                    myobj.message = $(divs[i+1]).text();
                }else if( $div.text() == NotificationLabels.color ){
                    myobj.selected_color_option = $(divs[i+1]).text();
                }
            })
            myArr.push(myobj);
        });
        return myArr;
    } 

    this.init = function(){
        var deferred = $.Deferred();
        var ret = [];
        $.ajax({
            type: 'GET',
            url: url,
            success: function(doc) {  
              var xml = $(doc).find('rss').html();
              var $xml = $($.parseXML(xml));
              data = parseRSS( $xml );
              deferred.resolve(data);
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) { 
                console.log("Status: " + textStatus);
                //console.log("Error: " + errorThrown); 
                deferred.reject();
            }   
        });  
        return deferred.promise( data );
    }
}
/*
var Service = function( url ){
    var data;
    this.init = function(){
        var deferred = $.Deferred();
        $.getJSON( url , function(fetchedData) {
            data = fetchedData;
            deferred.resolve(data);
        })
        //@TODO handle errors
        return deferred.promise( data );
    }
    
}

//using https://rss2json.com API to go around CORS
var RssJsonService = function( url ){
    var data;
    var api = 'exd0j7x7qlnr5kjxvwpd0dur7gutotdnw6ozo6sa'
    this.init = function(){
        var deferred = $.Deferred();
        $.ajax({
            type: 'GET',
            url: "https://api.rss2json.com/v1/api.json?rss_url=" + url,
            dataType: 'jsonp',
            data: {
                rss_url: url,
                api_key: api
            },
            success: function(rss) {
              console.log(rss.feed);    
              //console.log( JSON.stringify(rss.items));
              //an array of spotlight items
              data = rss.items
              deferred.resolve(data);
            }
        });  
        return deferred.promise( data );
    }
}
*/

/* unused dont render until both data are recieved
var Service = function( url ){
    var that = this;
    var data = {};
    var notification;
    var spotlight;

    this.init = function(){
        var deferred = $.Deferred();
        $.when(
            $.getJSON( "./imports/spotlightdata.json", function(spotlightData) {
                spotlight = spotlightData;
              }),
            $.getJSON( "./imports/notificationdata.json", function(notificationData) {
                notification = notificationData;
            })              
        ).then(
            function( objs ){
                data.notification = notification;
                data.spotlight = spotlight; 
                deferred.resolve(data);
            }
            
        )
        return deferred.promise( data );
    }
}
*/


