var images = {
	'A': $('<img>'),
	'H': $('<img>'),
	'L': $('<img>'),
	'N': $('<img>'),
	'S': $('<img>')
};

$.each(images, function (key, value) {
  value.prop('src', './img/'+key+'.jpg')
       .addClass('polaroid')
       .attr('data-letter', key )
});

var correctCards = 0;
$( init );

function getHelp() {
	$('.modal').removeClass('hide');
};

function closeHelp() {
  $('.modal').addClass('hide');
};

function checkAnswer() {

  var success = true;

  $('#cardPile > img').each(function(ind) {
    if ($(this).data('letter') != $(this).data('check') && success) {
      success = false;
    }
  });

  if (!success) {
    alert('This is not correct! Please, try again.')
  }
  else {
    $('#successMessage').show();
    $('#successMessage').animate( {
      left: '380px',
      top: '200px',
      width: '400px',
      height: '100px',
      opacity: 1
    } );
  }
};

function init() {

  // Hide the success message
  $('#successMessage').hide();
  $('#successMessage').css( {
    left: '580px',
    top: '250px',
    width: 0,
    height: 0
  } );

  // Reset the game
  correctCards = 0;
  $('#cardPile').html( '' );
  $('#cardSlots').html( '' );

  // Create the pile of shuffled cards
  var answer = ['N','N','L','S','H','A','A','H','S','L','N','A','H','S','L','N','A'];
  answer.sort( function() { return Math.random() - .5 } );

  $.each(answer, function (ind, key) {
    $(images[key]).clone().appendTo('#cardPile').draggable( {
          containment: '#content',
          stack: '#cardPile img',
          cursor: 'move',
          revert: false
       });
  });

  // Create the card slots
  var words = ['N','N','L','S','H','A','A','H','S','L','N','A','H','S','L','N','A'];
  for ( var i=0; i<words.length; i++ ) {
    $('<div>&nbsp;</div>').data('letter', words[i]).appendTo( '#cardSlots' ).droppable( {
      accept: '#cardPile img',
      hoverClass: 'hovered',
      drop: handleCardDrop
    } );
  }

}

function handleCardDrop( event, ui ) {
    ui.draggable.data('check', $(this).data('letter'))
    ui.draggable.position( { of: $(this), my: 'left top', at: 'left top' } );
    ui.draggable.draggable( 'option', 'revert', false );
}