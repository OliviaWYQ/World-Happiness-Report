setTimeout(function start (){
  
  $('.bar').each(function(i){  
    var $bar = $(this);
    $(this).append('<span class="count"></span>')
    setTimeout(function(){
      $bar.css('width', $bar.attr('data-percent')*100);      
    }, i*100);
  });
 
$('.count').each(function () {
    $(this).prop('Counter', 0).animate({
        Counter: $(this).parent('.bar').attr('data-percent')
    }, {
        duration: 5000,
        easing: 'swing',
        step: function (now) {
            $(this).text(now.toFixed(2));
        }
    });
});
 
}, 500)