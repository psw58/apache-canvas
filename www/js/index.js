/**
 * @name index.js
 * @author psw58@cornell.edu
 * @version 0.5 release Alpha
 * @description initialize the app
 * @repo https://github.com/psw58/canvas-login
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
    const settings = {
        //the data source location EDIT this to change data source location
        dataSource: {
            "JS_OBJ": false,
            "canvas_XML": false,
            "CTI_RSS": true,
        },
        //render dom targets defined in index.html
        domtargets: {
            "$spotlightTarget": '#spotlight',
            "$notificationTarget": '#notification'
        },
        //The notification field labels used on the cti site this is needed to map content from CTI
        //IF CTI field labels change these must be updated
        NotificationLabels: {
            "message": "Message",
            "color": "Select color option"
        },
        //should this come from CTI?
        spotlightContent: {
            "title": "Announcements",
            "maxlength": 3
        },
        //rss CTI feeds
        rssSpotlight: "https://canvas-ctiteach.pantheonsite.io/showcase/rss.xml",
        rssNotification: 'https://canvas-ctiteach.pantheonsite.io/notification/rss.xml',
        //local RSS feeds edit these feeds for local development
        localSpotlight: "./imports/spotlightdata.xml",
        localNotification: './imports/notificationdata.xml',
        //back up data incase ajax request fails
        buSpotlightData: [{ "link": "https://teaching.cornell.edu/", "title": "Canvas at Cornell", "thumbnail": "./images/Spotlight Image 2 canvas_0.jpg", "alt": "The logo for the Learning Mangement System Canvas" }],
        buNotificationData: [{ "message": "Notification: Welcome to Canvas, Make sure to review the Canvas terms of use", "selected_color_option": "6" }]

    };

    //determine wich data to render, then call functions to fetch it and render it
    switch (true) {
        case settings.dataSource.canvas_XML:
            //use xml data stored on this server
            const localSpotlightService = new RssSpotlightService(settings.localSpotlight);
            const localNotificationService = new RssNotificationService(settings.localNotification, settings.NotificationLabels);
            fetchRender(localSpotlightService, localNotificationService, settings.domtargets);
            break;
        case settings.dataSource.CTI_RSS:
            //use RSS feed from CTI 
            const rssSpotlightService = new RssSpotlightService(settings.rssSpotlight);
            const rssNotificationService = new RssNotificationService(settings.rssNotification, settings.NotificationLabels);
            fetchRender(rssSpotlightService, rssNotificationService, settings.domtargets);
            break;
        case settings.dataSource.JS_OBJ:
            //use local data obj
            if (settings.buSpotlightData && settings.buSpotlightData.length) {
                const view1 = new SpotlightView(settings.buSpotlightData, settings.spotlightContent);
                $(settings.domtargets.$spotlightTarget).html(view1.render().$el);
            }

            if (settings.buNotificationData && settings.buNotificationData.length) {
                const view2 = new NotificationView(settings.buNotificationData[0], settings.spotlightContent);
                $(settings.domtargets.$notificationTarget).html(view2.render().$el);
            }
            break;
        default:
            console.warn("WARNING: No source selected");

    };

    /**
    * @description helper function Fetch xml and render content in: Announcements/Spotlight, Notifications
    * @param {RssSpotlightService} spotlightService 
    * @param {RssNotificationService} notificationService 
    * @param {settings.domtargets} appSettings
    * @access settings domTarget
    */
    function fetchRender(spotlightService, notificationService, appSettings) {
        spotlightService.init()
            .done(
                function (data) {
                    if (data && data.length) {
                        const view = new SpotlightView(data, settings.spotlightContent);
                        $(appSettings.$spotlightTarget).html(view.render().$el);
                    }
                }
            )
            .fail(
                //if failed default to nothing
                function () {
                    console.log('XML parse spotlight failed');
                }
            )
        /*
        * initialize notification and parse RSS fed from CTI
        * this requires notification view to be implimented 
        */
        notificationService.init()
            .done(
                function (data) {
                    if (data && data.length) {
                        const message = data[0];//assume there is only one element
                        const notificationView = new NotificationView(message);
                        $(appSettings.$notificationTarget).html(notificationView.render().$el);
                    }
                }
            )
            .fail(
                function () {
                    //if fails default to nothing
                    console.log('XML parse notification failed');
                }
            )
    }

})(jQuery);