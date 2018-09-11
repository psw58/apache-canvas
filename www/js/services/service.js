
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

    function parseRSS(el){
        //console.log(el.context.outerHTML);
        $(el.context.outerHTML).find('link');
        var myobj = {};
        //var $html = $('<div/>').html(el.context.outerHTML);
        var $html = $($.parseXML(el));
        console.log($html);
        myobj.title = $html.find('title').text();
        //myobj.link =($html).text().replace(/\<link>|\<\/link>/gi,''); 
        myobj.link =$html.find('link').val()
        var desc = $html.find('description').text();
        var $desc = $('<div/>').html(desc);
        myobj.thumbnail = $desc.find('img').attr('src');
        myobj.alt = $desc.find('img').attr('alt');
        

        return myobj;

    } 

    this.init = function(){
        var deferred = $.Deferred();
        var ret = [];
        $.ajax({
            type: 'GET',
            url: url,
            success: function(rss) {
              console.log(rss);    
              rss = $(rss).find('rss').html();
              console.log(rss)
              var xml = $($.parseXML(rss));
              console.log(xml.find('channel'));
              /*
              $(rss).find("item").each(function () {
                var el = $(this);
                var myObj = parseRSS(el)
                console.log(myObj);
                ret.push(myObj);
                
          });
          */
            }
        });  
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
