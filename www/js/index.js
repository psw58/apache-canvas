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
    //define debug variables
    var USE_CTI_RSS = false;
    var DEBUG = false;
    //jQuery FadeIn speed of targets
    var FADEINSPEED = 200;

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

    //targets
    var spotlightTarget = '#spotlight';
    var notificationTarget = '#notification';

    //rss CTI feeds
    var rssSpotlight = "https://canvas-ctiteach.pantheonsite.io/showcase/rss.xml";
    var rssNotification = 'https://canvas-ctiteach.pantheonsite.io/notification/rss.xml';

    //local RSS feeds edit these feeds for local development
    var localSpotlight = "./imports/spotlightdata.xml";
    var localNotification = './imports/notificationdata.xml';

    //back up data incase ajax request fails
    var buSpotlightData = [{"link":"https://teaching.cornell.edu/","title":"Canvas at Cornell","thumbnail":"./images/Spotlight Image 2 canvas_0.jpg","alt":"The logo for the Learning Mangement System Canvas"}];
    var buNotificationData = [{"message":"Notification: Welcome to Canvas, Make sure to review the Canvas terms of use","selected_color_option":"6"}];

    if (USE_CTI_RSS){
        //use RSS feed from CTI 
        var rssSpotlightService = new RssSpotlightService( rssSpotlight );
        var rssNotificationService = new RssNotificationService( rssNotification, NotificationLabels );
    }else{
        //use xml data stored on this server
        var rssSpotlightService = new RssSpotlightService( localSpotlight );
        var rssNotificationService = new RssNotificationService( localNotification, NotificationLabels );
    }

    /* 
    *  Fetch xml and render content in:
    *   Announcements/Spotlight,
    *   Notifications
    * */
    if ( !DEBUG ){
        rssSpotlightService.init()
            .done(
                function(data){
                    if (data && data.length){
                        var view = new SpotlightView(data, spotlightContent);
                        $(spotlightTarget).html( view.render().$el );   
                    }
                }
            )
            .fail( 
                function(){
                    console.log('XML parse spotlight failed using back up');
                    var view = new SpotlightView(buSpotlightData, spotlightContent);
                    $(spotlightTarget).html( view.render().$el );   
                }
            )    
        /*
        * initialize notification and parse RSS fed from CTI
        * this requires notification view to be implimented 
        */
        rssNotificationService.init()
            .done(
                function(data){
                    if (data && data.length){
                        var message = data[0];//assume there is only one element
                        var notificationView = new NotificationView(message);
                        $(notificationTarget).html( notificationView.render().$el );       
                    }
                }
            )
            .fail( 
                function(){
                    console.log('XML parse notification failed using back up');
                    var view = new NotificationView(buNotificationData[0], spotlightContent);
                    $(notificationTarget).html( view.render().$el );   
                }
            )
    }
    else{
        //debug is enabled
        if (buSpotlightData && buSpotlightData.length){
            var view1 = new SpotlightView(buSpotlightData, spotlightContent);
            $(spotlightTarget).html( view1.render().$el );   
        }

        if (buNotificationData && buNotificationData.length){
            var view2 = new NotificationView(buNotificationData[0], spotlightContent);
            $(notificationTarget).html( view2.render().$el ); 
        }
    }

})(jQuery);