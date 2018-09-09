
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