    /*start Notifications
    * Modifies innerHTMl of div with id of "notification"
    * Use "selected_option" to change the selected background color of alert message 
    * Use message to edit the notification message contents
    * */
   var NotificationView = function (data) { 

    var options = {
        1:"default",
        2:"blue-green",
        3:"blue",
        4:"purple",
        5:"gold",
        6:"green",
        7:"red"
    }

    //modify message variable to change the message
    var message = " Fall back message";
    if ('message' in data){
        message = data.message;
    }
    
    //modify this to change background color
    var selected_option = 1 //fall back default color
    if ('selected_color_option' in data){
        selected_option = data.selected_color_option;
    }

    this.init = function(){
        this.$el = $('<div/>');
    }    

    this.template = function(){
        return '<div class="panel accent-'+options[selected_option]+' fill"> \
                    <p><i class="fas fa-exclamation-triangle exclamation-triangle"></i>'+message+'</p> \
                </div> ';
    }

    this.render = function( ){
        var template = this.template();
        this.$el.html( template )
        return this;
    }

    this.init();    
}
