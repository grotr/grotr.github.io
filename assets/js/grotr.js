$().ready( function() {

    $('.navitem').tooltip();

    var $images = $('img');
    $images.each(function(index) {
        if (!$(this).hasClass('img-responsive'))
            $(this).addClass('img-responsive');
    });
});

