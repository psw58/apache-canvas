/**
 * 
 * @param {Array} data array of objects in format [{obj1:''},{obj2:''}....]
 * @param {object} content variable set in index.js
 */
var SpotlightView = function (data, content){
    'use strict';
    /**
     * @description declares a jQuery html object of this class
     */
    this.init = function(){
        this.$el = $('<div/>');
    }

    /**
     * 
     * @param {array} data passed data
     * @param {object} content passed content obj
     * @returns {string} HTML string
     */
    this.template = function( myData, myContent ){
        return '<h2 class="h3">'+myContent.title+'</h2> <div class="showcase">'+this.listTemplate(myData, myContent)+ '</div>';
    }

    /**
     * 
     * @param {array} myData passed data object
     * @returns {string} html string
     */
    this.listTemplate = function( myData, myContent ){
        var hinner = '';
        if (myData && (myData.length > myContent.maxlength)) { myData = myData.splice(0,myContent.maxlength) };
        $.each(myData, function(i, el){
            var $el = $('<div/>').html(el.description);
            el.alt = $($el).find('img').attr('alt');
            el.type = $($el).find('div').last().text();
            if (el.link && el.thumbnail && el.title ){
                hinner += '<div class="card"> \
                <div role="article" class="node"> <a href="'+el.link+'" rel="bookmark"> \
                        <div class="group-image field-group"> \
                            <div class="field field-name-field-image"> <img src="'+el.thumbnail                            +'" \
                                    width="720" height="480" alt="'+el.alt+'" /> \
                            </div> \
                        </div> \
                        <div class="group-fields field-group"> \
                            <div class="field field-name-category category">'+el.type+'</div> \
                            <div class="field field-name-title title"> \
                                <h3 class="sans">'+el.title+'</h3> \
                            </div> \
                        </div> \
                    </a> </div> \
            </div>';
            }else{
                console.warn("invalid obj data");
            }
        })
        return hinner;
    }

    /**
     * @returns jquery html object
     */
    this.render = function( ){
        this.$el.html( this.template( data, content ) )
        return this;
    }
    
    this.init();

}
