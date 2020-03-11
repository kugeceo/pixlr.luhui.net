$(function() {
    $('#social-count p:gt(0)').hide();
    $('#social-magnitude p:gt(0)').hide();
    $('#social-type p:gt(0)').hide();
    
    setInterval(function(){
        $('#social-count p:first-child').fadeOut()
        $('#social-type p:first-child').fadeOut()
        $('#social-magnitude p:first-child').fadeOut()
        $('#social-count p:first-child').next('p').fadeIn().end().appendTo('#social-count');
        $('#social-magnitude p:first-child').next('p').fadeIn().end().appendTo('#social-magnitude');
        $('#social-type p:first-child').next('p').fadeIn().end().appendTo('#social-type');
    }, 4000);

})

$(document).ready(function() {
    var $window = $(window);
  
    $('.parallax').each(function() {
      var $bgobj = $(this); // assigning the object
      $(window).scroll(function() {
        var yPos = -(($window.scrollTop() - 2000) / $bgobj.data('speed'));
        // Put together the final background position (bgp)
        var bgp = '50%' + yPos + 'px';
        // Move the background
        $bgobj.css("background-position", bgp);
      });
    });
  });


  // function splitScroll() {
  //   const controller = new ScrollMagic.Controller();
  //   new ScrollMagic.Scene({
  //       duration: '230%',
  //       triggerElement: '.slideshow-image',
  //       triggerHook: 0
  //   })
  //   .setPin('.slideshow-image')
  //   .addTo(controller)
// }

// if (screen.width > 1000) {
//   splitScroll()
// }
AOS.init()