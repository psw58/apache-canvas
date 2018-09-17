/**
 * @name index.js
 * @author psw58@cornell.edu
 * @version 0.5 release Alpha
 * @description initialize the app
 * @summary
 *  - uses anonymous self-invoking function to not pollute namespace
 *  - Fetches service data -> get view object -> render it as html in target
 *  - Has built in redundancy and fallback
 * @requires jQuery
 * @requires services fetches data and returns a data object
 * @requires templates recieve data obj and return a view object
 * 
 */
(function ($) {
    'use strict';
    //define variables
    var settings = {};
    settings.dataSource = {};
    //set the data source location
    settings.dataSource.JS_OBJ = false;
    settings.dataSource.canvas_XML = false;
    settings.dataSource.CTI_RSS = true;
    //render dom targets defined in index.html
    settings.domtargets = {
        "$spotlightTarget" : '#spotlight',
         "$notificationTarget" : '#notification'
    }
    //The notification field labels used on the cti site this is needed to map content from CTI to 
    var NotificationLabels = {
        "message":"Message",
        "color":"Select color option"
    };
    //should this come from CTI?
    var spotlightContent = {
        "title": "Announcements",
        "maxlength": 3
    };
    //rss CTI feeds
    var rssSpotlight = "https://canvas-ctiteach.pantheonsite.io/showcase/rss.xml";
    var rssNotification = 'https://canvas-ctiteach.pantheonsite.io/notification/rss.xml';
    //local RSS feeds edit these feeds for local development
    var localSpotlight = "./imports/spotlightdata.xml";
    var localNotification = './imports/notificationdata.xml';
    //back up data incase ajax request fails
    var buSpotlightData = [{"link":"https://teaching.cornell.edu/","title":"Canvas at Cornell","thumbnail":"./images/Spotlight Image 2 canvas_0.jpg","alt":"The logo for the Learning Mangement System Canvas"}];
    var buNotificationData = [{"message":"Notification: Welcome to Canvas, Make sure to review the Canvas terms of use","selected_color_option":"6"}];

    //determine wich data to render, then call functions to fetch it and render it
    switch(true){
        case settings.dataSource.canvas_XML:
            //use xml data stored on this server
            var rssSpotlightService = new RssSpotlightService( localSpotlight );
            var rssNotificationService = new RssNotificationService( localNotification, NotificationLabels );
            fetchRender(rssSpotlightService, rssNotificationService, settings);
            break;
        case settings.dataSource.CTI_RSS:
            //use RSS feed from CTI 
            var rssSpotlightService = new RssSpotlightService( rssSpotlight );
            var rssNotificationService = new RssNotificationService( rssNotification, NotificationLabels );
            fetchRender(rssSpotlightService, rssNotificationService, settings);
            break;
        case settings.dataSource.JS_OBJ:
            //use local data obj
            if (buSpotlightData && buSpotlightData.length){
                var view1 = new SpotlightView(buSpotlightData, spotlightContent);
                $(settings.domtargets.$spotlightTarget).html( view1.render().$el );   
            }
    
            if (buNotificationData && buNotificationData.length){
                var view2 = new NotificationView(buNotificationData[0], spotlightContent);
                $(settings.domtargets.$notificationTarget).html( view2.render().$el ); 
            }
            break;            
        default:
            console.warn("WARNING: No source selected");

    };

    /**
    * @description helper function Fetch xml and render content in: Announcements/Spotlight, Notifications
    * @param {object} spotlightService 
    * @param {Object} notificationService 
    * @access settings domTarget
    */
    function fetchRender( spotlightService, notificationService, appSettings){
        spotlightService.init()
            .done(
                function(data){
                    if (data && data.length){
                        var view = new SpotlightView(data, spotlightContent);
                        $(appSettings.domtargets.$spotlightTarget).html( view.render().$el );   
                    }
                }
            )
            .fail( 
                //if failed default to nothing
                function(){
                    console.log('XML parse spotlight failed');  
                }
            )    
        /*
        * initialize notification and parse RSS fed from CTI
        * this requires notification view to be implimented 
        */
        notificationService.init()
            .done(
                function(data){
                    if (data && data.length){
                        var message = data[0];//assume there is only one element
                        var notificationView = new NotificationView(message);
                        $(appSettings.domtargets.$notificationTarget).html( notificationView.render().$el );       
                    }
                }
            )
            .fail( 
                function(){
                    //if fails default to nothing
                    console.log('XML parse notification failed');
                }
            )
    }
    
})(jQuery);