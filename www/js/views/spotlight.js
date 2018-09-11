//data obj should be json in format [{obj1:''},{obj2:''}....]
var SpotlightView = function (data, content){
    //the maximun nuber of spotlights
    var MAXLENGTH = 2;

    this.init = function(){
        this.$el = $('<div/>');
    }

    this.template = function( data, content ){
        return '<h2 class="h3">'+content.title+'</h2> <div class="showcase">'+this.listTemplate(data)+ '</div>';
    }

    this.listTemplate = function( myData ){
        var hinner = '';
        if (myData && (myData.length > MAXLENGTH)) { myData = myData.splice(0,MAXLENGTH) };
        $.each(myData, function(i, el){
            var $el = $('<div/>').html(el.description);
            el.alt = $($el).find('img').attr('alt');
            if (true){
                hinner += '<div class="card"> \
                <div role="article" class="node"> <a href="'+el.link+'" rel="bookmark"> \
                        <div class="group-image field-group"> \
                            <div class="field field-name-field-image"> <img src="'+el.thumbnail                            +'" \
                                    width="720" height="480" alt="'+el.alt+'" /> \
                            </div> \
                        </div> \
                        <div class="group-fields field-group"> \
                            <div class="field field-name-category category"> </div> \
                            <div class="field field-name-title title"> \
                                <h3 class="sans">'+el.title+'</h3> \
                            </div> \
                        </div> \
                    </a> </div> \
            </div>';
            }else{
                console.warn("invalid JSON data @TODO do fallback");
                console.log(el);
            }
        })
        return hinner;
    }

    this.render = function( ){
        this.$el.html( this.template( data, content ) )
        return this;
    }

    this.init();

}
