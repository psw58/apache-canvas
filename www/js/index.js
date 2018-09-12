/**
 * index.js
 * - initialize the app
 * use anonymous self-invoking function to not pollute namespace
 * requires services, templates, and rss.xml data feed
 */

(function () {
    //define debug variables
    var USE_CTI_RSS = true;
    var DEBUG = false;
    var FADEINSPEED = 200;

    //should this come from Drupal?
    var spotlightContent = {
        "title": "Announcements"
    };

    //targets
    var spotlightTarget = '#spotlight';
    var notificationTarget = '#notification';

    //rss CTI feeds
    var rssSpotlight = "https://psw-ctiteach.pantheonsite.io/showcase/rss.xml";
    var rssNotification = 'https://psw-ctiteach.pantheonsite.io/notification/rss.xml';

    //local RSS feeds edit these feeds for local development
    var localSpotlight = "./imports/spotlightdata.xml";
    var localNotification = './imports/notificationdata.xml';

    //back up data incase there is a network error 
    var buSpotlightData = [{"link":"https://teaching.cornell.edu/","title":"Canvas at Cornell","thumbnail":"./images/Spotlight Image 2 canvas_0.jpg","alt":"The logo for the Learning Mangement System Canvas"}];
    var buNotificationData = [{"message":"Notification: Welcome to Canvas, Make sure to review the Canvas terms of use","selected_color_option":"6"}];

    if (USE_CTI_RSS){
        //use RSS feed from CTI 
        var rssSpotlightService = new RssSpotlightService( rssSpotlight );
        var rssNotificationService = new RssNotificationService( rssNotification );
    }else{
        //use xml data stored on this server
        var rssSpotlightService = new RssSpotlightService( localSpotlight );
        var rssNotificationService = new RssNotificationService( localNotification );
    }

    //CTI must enable view display feed at /showcase/rss.xml
    if (!DEBUG){
        rssSpotlightService.init()
            .done(
                function(data){
                    if (data && data.length){
                        
                        var view = new SpotlightView(data, spotlightContent);
                        $(spotlightTarget).hide().html( view.render().$el ).fadeIn(FADEINSPEED );     
                    }
                }
            )
            .fail( 
                function(){
                    var view = new SpotlightView(buSpotlightData, spotlightContent);
                    $(spotlightTarget).hide().html( view.render().$el ).fadeIn(FADEINSPEED );   
                }
            )    
        //initialize notification and parse RSS fed from CTI
        /* this requires notification view to be implimented 
        */
        rssNotificationService.init()
            .done(
                function(data){
                    if (data && data.length){
                        var message = data[0];//assume there is only one element
                        var notificationView = new NotificationView(message);
                        $(notificationTarget).hide().html( notificationView.render().$el ).fadeIn(FADEINSPEED );       
                    }
                }
            )
            .fail( 
                function(){
                    var view = new NotificationView(buNotificationData[0], spotlightContent);
                    $(notificationTarget).hide().html( view.render().$el ).fadeIn(FADEINSPEED );   
                }
            )
    }
    else{

        //debug local
        var view1 = new SpotlightView(buSpotlightData, spotlightContent);
        $(spotlightTarget).hide().html( view1.render().$el ).fadeIn(FADEINSPEED );;   

        if (buNotificationData && buNotificationData.length){
            var view2 = new NotificationView(buNotificationData[0], spotlightContent);
            $(notificationTarget).hide().html( view2.render().$el ).fadeIn(FADEINSPEED ); 
        }
    }

})();