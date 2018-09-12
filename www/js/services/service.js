/**
 * Description: fetch a xml document and return a data object
 * 
 * @param {string} url a string to the fetched .xml file location
 * @param {Object} NotificationLabels the maping values in the xml description
 */
var RssSpotlightService = function( url ){
    'use strict';
    var data;

    /**
     * 
     * @param {jQuery parseXML Object} $xml Should contain items
     * @returns {Array} an array of objects
     */
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

    /**
     * @returns {jQuery promise} .done or .fail
     */
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

/**
 * 
 * @param {string} url a string to the fetched .xml file location
 * @param {Object} NotificationLabels the maping values in the xml description
 */
var RssNotificationService = function( url, NotificationLabels  ){
    var data;
    var myArr = [];

    /**
     * 
     * @param {jQuery parseXML Object} $xml Should contain items
     * @returns {Array} an array of objects
     */
    function parseRSS($xml){
        var items = $($xml).find('item');
        $(items).each(function () {
            var myobj = {};
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

    /**
     * @returns {jQuery promise} done or fail
     */
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
