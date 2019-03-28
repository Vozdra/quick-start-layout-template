$(function() {

  $(window).scroll(function() {
		if ($(this).scrollTop() > $(this).height()) {
			$('#to-top').addClass('show');
		} else {
			$('#to-top').removeClass('show');
		}
	});
	
	$('#to-top').click(function() {
		$('html, body').stop().animate({scrollTop: 0}, 'slow', 'swing');
  })

  $("a[rel='scrollToId']").click(function() {
    var targetDiv = $(this).attr('href');
    $('html, body').animate({
        scrollTop: $(targetDiv).offset().top
    }, 1000);
  });

})
