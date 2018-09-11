/**
 * index.js
 * - initialize the app
 * use anonymous self-invoking function to not pollute namespace
 * requires service, template, and json data feed
 */
(function () {
    var spotlightTarget = '#spotlight';
    var notificationTarget = '#notification';
    var spotlightDataURL =  "./imports/spotlightdata.json";
    var rssSpotlight = "https://psw-ctiteach.pantheonsite.io/showcase/rss.xml";
    var rssNotification = 'https://psw-ctiteach.pantheonsite.io/notification/rss.xml';

    //var rssSpotlightBU = "./imports/spotlightdata.xml";
    //var jsonSpotlight = 'https://psw-ctiteach.pantheonsite.io/spotlight/feed.json';    

    //should this come from CMS?
    var spotlightContent = {
        "title": "Announcements"
    }

    //var notificationdatURL = "./imports/notificationdata.json";
    
    var rssSpotlightService = new RssSpotlightService( rssSpotlight );
    var rssNotificationService = new RssNotificationService( rssNotification );
    //var notificationService = new Service( notificationdatURL );
    var spotlightService = new Service(spotlightDataURL);
    
    //CTI must enable view display feed at /showcase/rss.xml
    rssSpotlightService.init()
        .done(
            function(data){
                if (data){
                    console.log(data);
                    var view = new SpotlightView(data, spotlightContent);
                    $(spotlightTarget).html( view.render().$el );       
                }
            }
        )
        .fail( 
            function(){
                //used saved data
                console.log("failed to load data using backup");
                spotlightService.init()
                .done(
                    function(data){
                        if (data){
                            var view = new SpotlightView(data, spotlightContent);
                            $(spotlightTarget).html( view.render().$el );       
                        }
                    }
                )
                .fail( 
                    //handle this
                )
            }
        )    

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
            //handle this
        )        
        
})();