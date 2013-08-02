$().ready( function() {
  $('.collapser').click(function() {
    if($('#navbar').hasClass('collapsed'))
    {
      $('#navbar').removeClass('collapsed');
      $('navitem').removeClass('collapsed');
    }
    else
    {
      $('#navbar').addClass('collapsed');
      $('navitem').removeClass('collapsed');
    }
    
  });

});