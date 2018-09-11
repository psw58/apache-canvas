
/*
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
var RssService = function( url ){
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

var JsonService = function( url ){
    var data;
    this.init = function(){
        var deferred = $.Deferred();
        $.ajax({
            type: 'GET',
            url: url,
            dataType: 'json',
            crossOrigin: true,
            success: function(rss) {
              console.log(rss);    
              //console.log( JSON.stringify(rss.items));
              //an array of spotlight items
              data = rss.items
              deferred.resolve(data);
            }
        });  
        return deferred.promise( data );
    }
}
