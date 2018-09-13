/**
 * @description fetch a xml document and return a data object
 * 
 * @param {string} url a string to the fetched .xml file location
 * @param {Object} NotificationLabels the maping values in the xml description
 * 
 * @summary MS ie11 does not support xml documents but does support text documents
 *          The loader checks to see if microsoft ie and then request as a text document
 *          Tested with ie9 and above
 *          https://stackoverflow.com/questions/17035794/how-to-read-xml-data-in-ie-browser-using-jquery-ajax-function#
 *          https://stackoverflow.com/questions/19999388/check-if-user-is-using-ie-with-jquery
 */
var RssSpotlightService = function (url) {
    'use strict';
    var data;

    /**
     * 
     * @param {jQuery parseXML Object} $xml Should contain items
     * @returns {Array} an array of objects
     */
    function parseRSS($xml) {
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
            if (myobj && myobj.link && myobj.title && myobj.thumbnail) {
                myArr.push(myobj);
            } else {
                console.warn("ERROR parsing xml content");
            }
        });
        return myArr;
    }

    /**
     * @returns {jQuery promise} .done or .fail
     */
    this.init = function () {
        $.support.cors = true;
        var deferred = $.Deferred();
        $.ajax({
            type: 'GET',
            url: url,
            dataType: MSIVERSION ? "text" : "xml",
            success: function (doc) {
                if (MSIVERSION) {
                    xml = doc;
                    var $xml = $($.parseXML(xml));
                    data = parseRSS($xml);
                    if (data && data.length) {
                        deferred.resolve(data);
                    } else {
                        console.log('error in data');
                        deferred.reject();
                    }
                } else {
                    var xml = $(doc).find('rss').html();
                    var $xml = $($.parseXML(xml));
                    data = parseRSS($xml);
                    if (data && data.length) {
                        deferred.resolve(data);
                    } else {
                        console.log('error in data');
                        deferred.reject();
                    }
                }

            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                console.log("Status: " + textStatus);
                //console.log("Error: " + errorThrown); 
                deferred.reject();
            }
        });
        return deferred.promise(data);
    }
}

/**
 * 
 * @param {string} url a string to the fetched .xml file location
 * @param {Object} NotificationLabels the maping values in the xml description
 * 
 * @summary MS ie11 does not support xml documents but does support text documents
 *          The loader checks to see if microsoft ie and then request as a text document
 *          only tested with ie11 
 */
var RssNotificationService = function (url, NotificationLabels) {
    'use strict';
    var data;   //the promised array of objects

    /**
     * 
     * @param {jQuery parseXML Object} $xml Should contain items
     * @returns {Array} an array of objects
     */
    function parseRSS($xml) {
        var myArr = [];
        var items = $($xml).find('item');
        $(items).each(function () {
            var myobj = {};
            var $el = $(this);
            var desc = $el.find('description').text();
            //search the description for the image
            var $desc = $('<div/>').html(desc);
            var divs = $desc.find('div');
            $(divs).each(function (i, el) {
                var $div = $(this);
                if ($div.text() == NotificationLabels.message) {
                    myobj.message = $(divs[i + 1]).text();
                } else if ($div.text() == NotificationLabels.color) {
                    myobj.selected_color_option = $(divs[i + 1]).text();
                }
            })
            myArr.push(myobj);
        });
        return myArr;
    }

    /**
     * @returns {jQuery promise} done or fail
     */
    this.init = function () {
        var deferred = $.Deferred();
        var ret = [];
        $.ajax({
            type: 'GET',
            url: url,
            dataType: MSIVERSION ? "text" : "xml",
            success: function (doc) {
                if (MSIVERSION) {
                    xml = doc;
                    var $xml = $($.parseXML(xml));
                    data = parseRSS($xml);
                    if (data && data.length) {
                        deferred.resolve(data);
                    } else {
                        console.log('error in data');
                        deferred.reject();
                    }
                } else {
                    var xml = $(doc).find('rss').html();
                    var $xml = $($.parseXML(xml));
                    data = parseRSS($xml);
                    if (data && data.length) {
                        deferred.resolve(data);
                    } else {
                        console.log('error in data');
                        deferred.reject();
                    }
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                console.log("Status: " + textStatus);
                //console.log("Error: " + errorThrown); 
                deferred.reject();
            }
        });


        return deferred.promise(data);
    }
}

function msieversion() {
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE ");
    // If Internet Explorer, return version number
    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
        return true;
    }
    return false;
}

var MSIVERSION = msieversion();

