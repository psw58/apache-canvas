    /*start Notifications
    * Modifies innerHTMl of div with id of "notification"
    * Use "selected_option" to change the selected background color of alert message 
    * Use message to edit the notification message contents
    * */
   (function () { 
    //modify message variable to change the message
    var message = 'notification    mm/dd/yy: A notification bar to provide users with additional information, and changes background color, with seven different color options. Which is Often Long Enough to Wrap to a Second Line';
    //modify this to change background color
    var selected_option = 6;

    var options = {
        1:"default",
        2:"blue-green",
        3:"blue",
        4:"purple",
        5:"gold",
        6:"green",
        7:"red"
    }
    var target = document.getElementById('notification');
    var content = '<div class="panel accent-'+options[selected_option]+' fill">'+
                    '<p><i class="fas fa-exclamation-triangle exclamation-triangle"></i>'+message+'</p>'+
                  '</div> ';
    target ? target.innerHTML = content: console.log('WARNING: unable to locate notifications in DOM');
})();
