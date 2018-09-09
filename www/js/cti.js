/* CTI Scripting (last update: 4/29/18)
   ------------------------------------------------------------------------- */

(function ($, root, undefined) { $(function () { 'use strict';
	
	
	/* Five Elements transition 
	   ------------------------------------------------------------ */
	
	var ignore_scroll = false;
	var trigger = 0;
	$('#elements .element').addClass('transition');
	
	// Window Size Tracking
	function resizeChecks() {
		if ($('#elements').length > 0) {
			trigger = $('#elements').offset().top - $(window).height() + 200;
		}
	}
	
	function scrollChecks() {
		if ($(window).scrollTop() > trigger && !ignore_scroll) {
			$('#elements .element').removeClass('transition');
		}
	}
	if ($('html').hasClass('csstransitions')) {
		$(window).resize(resizeChecks);
		resizeChecks();
		$(window).scroll(scrollChecks);
		scrollChecks();
	}
	
	
		
});})(jQuery, this);
