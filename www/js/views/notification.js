/**
* 
* @description Creates a Jquery Html object
* Use "selected_option" to change the selected background color of alert message 
* Use message to edit the notification message contents
* @param {object} data a notification data object to set content
*/
var NotificationView = function (data) { 
    'use strict';
    //theme color options defined in 
    var options = {
        1:"default",
        2:"blue-green",
        3:"blue",
        4:"purple",
        5:"gold",
        6:"green",
        7:"red"
    }
    
    //set background color
    var selected_option = 1 //fall back default color
    if ('selected_color_option' in data){
        selected_option = parseInt(data.selected_color_option);
    }

    this.init = function(){
        this.$el = $('<div/>');
    }    

    this.template = function(){
        var myHTML = ''
        if ('message' in data){
            myHTML = '<div class="panel accent-'+options[selected_option]+' fill"> \
            <p><i class="fas fa-exclamation-triangle exclamation-triangle"></i>'+data.message+'</p> \
        </div> ';            
        }else{
            console.warn('error in notification data');
        }
        return myHTML
    }

    this.render = function( ){
        var template = this.template();
        this.$el.html( template )
        return this;
    }

    this.init();    
}
